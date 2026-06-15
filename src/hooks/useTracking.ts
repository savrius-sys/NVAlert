import { useState, useEffect } from 'react';
import { fetchTrackingStatus } from '../api/novaPoshta';
import { t } from '../utils/i18n';

export interface TrackingEvent {
  status: string;
  statusCode: string;
  timestamp: number;
}

export interface TrackedDetails {
  sender?: string;
  recipient?: string;
  weight?: string;
  cost?: string;
  scheduledDate?: string;
}

export interface TrackedTTN {
  number: string;
  status: string;
  statusCode: string;
  lastUpdated: number;
  history: TrackingEvent[];
  details?: TrackedDetails;
}

export function useTracking() {
  const [apiKey, setApiKey] = useState('');
  const [intervalTime, setIntervalTime] = useState(10);
  const [appLang, setAppLang] = useState('uk');
  const [showSettings, setShowSettings] = useState(false);
  const [ttns, setTtns] = useState<TrackedTTN[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    chrome.storage?.local?.get(['npApiKey', 'trackedTTNs', 'checkInterval', 'appLang'], (result: any) => {
      if (result.npApiKey) setApiKey(result.npApiKey);
      if (result.checkInterval) setIntervalTime(result.checkInterval);
      
      if (result.trackedTTNs) {
        const migrated = result.trackedTTNs.map((item: any) => {
          if (!item.history) {
            return {
              ...item,
              history: [{
                status: item.status,
                statusCode: item.statusCode,
                timestamp: item.lastUpdated
              }]
            };
          }
          return item;
        });
        setTtns(migrated);
        
        if (JSON.stringify(migrated) !== JSON.stringify(result.trackedTTNs)) {
          chrome.storage?.local?.set({ trackedTTNs: migrated });
        }
      }
      
      if (result.appLang) {
        setAppLang(result.appLang);
      } else {
        import('../utils/i18n').then(({ getI18nLanguage }) => {
          const defaultLang = getI18nLanguage();
          setAppLang(defaultLang);
          chrome.storage?.local?.set({ appLang: defaultLang });
        });
      }
    });
  }, []);

  const saveSettings = (newKey: string, newInterval: number, newLang: string) => {
    const validInterval = Math.max(1, Math.min(1440, newInterval));
    setApiKey(newKey);
    setIntervalTime(validInterval);
    setAppLang(newLang);
    
    chrome.storage?.local?.set({ 
      npApiKey: newKey,
      checkInterval: validInterval,
      appLang: newLang
    }, () => {
      setShowSettings(false);
      setError(null);
    });
  };

  const addTtn = async (newTtn: string) => {
    const cleanTtn = newTtn.trim();
    if (!cleanTtn) return;

    if (ttns.some(t => t.number === cleanTtn)) {
      setError(t('errorAlreadyTracked'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await fetchTrackingStatus(apiKey, [cleanTtn]);
      if (results.length > 0) {
        const doc = results[0];
        const status = doc.Status || t('statusUnknown');
        const statusCode = doc.StatusCode || '';
        const now = Date.now();

        const detailsObj: TrackedDetails = {};
        if (doc.CitySender && doc.WarehouseSender) detailsObj.sender = `${doc.CitySender}, ${doc.WarehouseSender}`;
        if (doc.CityRecipient && doc.WarehouseRecipient) detailsObj.recipient = `${doc.CityRecipient}, ${doc.WarehouseRecipient}`;
        if (doc.DocumentWeight) detailsObj.weight = doc.DocumentWeight;
        if (doc.DocumentCost) detailsObj.cost = doc.DocumentCost;
        if (doc.ScheduledDeliveryDate) detailsObj.scheduledDate = doc.ScheduledDeliveryDate;
        
        const newTracked: TrackedTTN = {
          number: doc.Number,
          status: status,
          statusCode: statusCode,
          lastUpdated: now,
          history: [{
            status: status,
            statusCode: statusCode,
            timestamp: now
          }],
          details: Object.keys(detailsObj).length > 0 ? detailsObj : undefined
        };
        
        const updatedTtns = [...ttns, newTracked];
        setTtns(updatedTtns);
        chrome.storage?.local?.set({ trackedTTNs: updatedTtns });
      } else {
        setError(t('errorNotFound'));
      }
    } catch (err: any) {
      setError(err.message || t('errorAdd'));
    } finally {
      setLoading(false);
    }
  };

  const removeTtn = (numberToRemove: string) => {
    const updatedTtns = ttns.filter(t => t.number !== numberToRemove);
    setTtns(updatedTtns);
    chrome.storage?.local?.set({ trackedTTNs: updatedTtns });
  };

  const refreshAll = async () => {
    if (ttns.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const ttnNumbers = ttns.map(t => t.number);
      const results = await fetchTrackingStatus(apiKey, ttnNumbers);
      
      const updatedTtns = ttns.map(item => {
        const updatedDoc = results.find(r => r.Number === item.number);
        if (updatedDoc && updatedDoc.StatusCode !== item.statusCode) {
          const now = Date.now();
          const newHistory = item.history ? [...item.history] : [];
          newHistory.push({
            status: updatedDoc.Status,
            statusCode: updatedDoc.StatusCode,
            timestamp: now
          });
          
          const detailsObj: TrackedDetails = {};
          if (updatedDoc.CitySender && updatedDoc.WarehouseSender) detailsObj.sender = `${updatedDoc.CitySender}, ${updatedDoc.WarehouseSender}`;
          if (updatedDoc.CityRecipient && updatedDoc.WarehouseRecipient) detailsObj.recipient = `${updatedDoc.CityRecipient}, ${updatedDoc.WarehouseRecipient}`;
          if (updatedDoc.DocumentWeight) detailsObj.weight = updatedDoc.DocumentWeight;
          if (updatedDoc.DocumentCost) detailsObj.cost = updatedDoc.DocumentCost;
          if (updatedDoc.ScheduledDeliveryDate) detailsObj.scheduledDate = updatedDoc.ScheduledDeliveryDate;

          return {
            ...item,
            status: updatedDoc.Status,
            statusCode: updatedDoc.StatusCode,
            lastUpdated: now,
            history: newHistory,
            details: Object.keys(detailsObj).length > 0 ? detailsObj : item.details
          };
        } else if (updatedDoc && Object.keys(item.details || {}).length === 0) {
          // If status didn't change but we just got an API key and want to backfill details
          const detailsObj: TrackedDetails = {};
          if (updatedDoc.CitySender && updatedDoc.WarehouseSender) detailsObj.sender = `${updatedDoc.CitySender}, ${updatedDoc.WarehouseSender}`;
          if (updatedDoc.CityRecipient && updatedDoc.WarehouseRecipient) detailsObj.recipient = `${updatedDoc.CityRecipient}, ${updatedDoc.WarehouseRecipient}`;
          if (updatedDoc.DocumentWeight) detailsObj.weight = updatedDoc.DocumentWeight;
          if (updatedDoc.DocumentCost) detailsObj.cost = updatedDoc.DocumentCost;
          if (updatedDoc.ScheduledDeliveryDate) detailsObj.scheduledDate = updatedDoc.ScheduledDeliveryDate;
          
          if (Object.keys(detailsObj).length > 0) {
            return { ...item, details: detailsObj };
          }
        }
        return item;
      });
      
      setTtns(updatedTtns);
      chrome.storage?.local?.set({ trackedTTNs: updatedTtns });
    } catch (err: any) {
      setError(err.message || t('errorRefresh'));
    } finally {
      setLoading(false);
    }
  };

  const testNotification = () => {
    chrome.notifications?.create({
      type: 'basic',
      iconUrl: 'favicon.svg',
      title: t('testNotifTitle'),
      message: t('testNotifMessage')
    });
  };

  return {
    apiKey,
    intervalTime,
    appLang,
    showSettings,
    setShowSettings,
    ttns,
    loading,
    error,
    saveSettings,
    addTtn,
    removeTtn,
    refreshAll,
    testNotification
  };
}
