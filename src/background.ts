import { fetchTrackingStatus } from './api/novaPoshta';
import { t, setI18nLanguage, getI18nLanguage } from './utils/i18n';

const ALARM_NAME = 'check-np-status';

chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.local.get(['checkInterval', 'appLang']);
  const interval = Number(result.checkInterval) || 10;
  
  if (!result.appLang) {
    const defaultLang = getI18nLanguage();
    chrome.storage.local.set({ appLang: defaultLang });
  }
  
  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: interval,
  });
  console.log(`Nova Poshta tracking alarm scheduled for every ${interval} minutes.`);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.checkInterval) {
    const newInterval = Number(changes.checkInterval.newValue) || 10;
    chrome.alarms.create(ALARM_NAME, {
      periodInMinutes: newInterval,
    });
    console.log(`Alarm updated to run every ${newInterval} minutes.`);
  }
});

chrome.alarms.onAlarm.addListener(async (alarm: chrome.alarms.Alarm) => {
  if (alarm.name === ALARM_NAME) {
    try {
      const data = await chrome.storage.local.get(['npApiKey', 'trackedTTNs', 'appLang']) as { npApiKey?: string, trackedTTNs?: any[], appLang?: string };
      const apiKey = data.npApiKey || '';
      const trackedTTNs = data.trackedTTNs || [];
      const appLang = data.appLang || 'uk';
      
      setI18nLanguage(appLang);

      if (trackedTTNs.length === 0) return;

      const ttnNumbers = trackedTTNs.map((t: any) => t.number);
      const results = await fetchTrackingStatus(apiKey, ttnNumbers);

      let hasChanges = false;
      const updatedTTNs = trackedTTNs.map((item: any) => {
        const doc = results.find((r: any) => r.Number === item.number);
        if (doc && doc.StatusCode !== item.statusCode) {
          hasChanges = true;
          
          const now = Date.now();
          const newHistory = item.history ? [...item.history] : [];
          if (newHistory.length === 0) {
            newHistory.push({
              status: item.status,
              statusCode: item.statusCode,
              timestamp: item.lastUpdated || now
            });
          }
          
          newHistory.push({
            status: doc.Status,
            statusCode: doc.StatusCode,
            timestamp: now
          });

          chrome.notifications.create(`np-update-${doc.Number}-${now}`, {
            type: 'basic',
            iconUrl: 'favicon.svg',
            title: t('notifStatusChangedTitle', [doc.Number]),
            message: doc.Status || t('notifStatusUpdated'),
            priority: 2,
          });

          const detailsObj: any = {};
          if (doc.CitySender && doc.WarehouseSender) detailsObj.sender = `${doc.CitySender}, ${doc.WarehouseSender}`;
          if (doc.CityRecipient && doc.WarehouseRecipient) detailsObj.recipient = `${doc.CityRecipient}, ${doc.WarehouseRecipient}`;
          if (doc.DocumentWeight) detailsObj.weight = doc.DocumentWeight;
          if (doc.DocumentCost) detailsObj.cost = doc.DocumentCost;
          if (doc.ScheduledDeliveryDate) detailsObj.scheduledDate = doc.ScheduledDeliveryDate;

          return {
            ...item,
            status: doc.Status,
            statusCode: doc.StatusCode,
            lastUpdated: now,
            history: newHistory,
            details: Object.keys(detailsObj).length > 0 ? detailsObj : item.details
          };
        } else if (doc && Object.keys(item.details || {}).length === 0) {
          const detailsObj: any = {};
          if (doc.CitySender && doc.WarehouseSender) detailsObj.sender = `${doc.CitySender}, ${doc.WarehouseSender}`;
          if (doc.CityRecipient && doc.WarehouseRecipient) detailsObj.recipient = `${doc.CityRecipient}, ${doc.WarehouseRecipient}`;
          if (doc.DocumentWeight) detailsObj.weight = doc.DocumentWeight;
          if (doc.DocumentCost) detailsObj.cost = doc.DocumentCost;
          if (doc.ScheduledDeliveryDate) detailsObj.scheduledDate = doc.ScheduledDeliveryDate;
          
          if (Object.keys(detailsObj).length > 0) {
            hasChanges = true;
            return { ...item, details: detailsObj };
          }
        }
        return item;
      });

      if (hasChanges) {
        chrome.storage.local.set({ trackedTTNs: updatedTTNs });
      }
    } catch (error) {
      console.error('Failed to check NP status:', error);
    }
  }
});
