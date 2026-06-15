import { useState, useEffect } from 'react';
import { t } from '../utils/i18n';
import { Bell, Info } from 'lucide-react';

interface SettingsPanelProps {
  initialApiKey: string;
  initialInterval: number;
  initialLang: string;
  onSave: (apiKey: string, interval: number, lang: string) => void;
  onCancel: () => void;
  onTestNotification: () => void;
}

export function SettingsPanel({ initialApiKey, initialInterval, initialLang, onSave, onCancel, onTestNotification }: SettingsPanelProps) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [intervalTime, setIntervalTime] = useState(initialInterval);
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    setApiKey(initialApiKey);
    setIntervalTime(initialInterval);
    setLang(initialLang);
  }, [initialApiKey, initialInterval, initialLang]);

  return (
    <div className="settings-panel">
      <h2>{t('languageTitle')}</h2>
      <select 
        value={lang} 
        onChange={(e) => setLang(e.target.value)}
        className="api-input"
        style={{ marginBottom: '15px' }}
      >
        <option value="uk">Українська</option>
        <option value="en">English</option>
      </select>

      <h2 className="flex-center" style={{ justifyContent: 'flex-start' }}>
        {t('apiKeyTitle')}
        <span className="tooltip-container" style={{ marginLeft: '8px' }}>
          <div style={{ display: 'inline-flex', padding: '4px', backgroundColor: 'var(--bg-color)', borderRadius: '4px', cursor: 'help' }}>
            <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--primary-color)' }}>{t('getApiKeyBtn')}</span>
          </div>
          <span className="tooltip-text" style={{ width: '280px', bottom: '130%', right: '-50px' }}>
            <p style={{ fontWeight: 600, margin: '0 0 6px 0', textAlign: 'left' }}>{t('apiKeyInstructionTitle')}</p>
            <ol style={{ margin: 0, paddingBottom: '8px', paddingLeft: '20px', textAlign: 'left', color: '#eee', borderBottom: '1px solid #555' }}>
              <li>{t('apiKeyInstruction1')}</li>
              <li>{t('apiKeyInstruction2')}</li>
              <li>{t('apiKeyInstruction3')}</li>
            </ol>
            <div style={{ marginTop: '8px', textAlign: 'center' }}>
              <a href="https://new.novaposhta.ua/dashboard/settings/developers" target="_blank" rel="noreferrer" style={{ color: '#4da6ff', textDecoration: 'underline' }}>
                {t('apiKeyInstruction4')}
              </a>
            </div>
          </span>
        </span>
      </h2>
      <p className="help-text flex-center" style={{ justifyContent: 'flex-start' }}>
        {t('apiKeyHelp')}
        <span className="tooltip-container" style={{ marginLeft: '6px' }}>
          <Info size={14} className="info-icon" />
          <span className="tooltip-text">{t('apiKeyDetails')}</span>
        </span>
      </p>
      <input 
        type="text" 
        value={apiKey} 
        onChange={(e) => setApiKey(e.target.value)} 
        placeholder={t('apiKeyPlaceholder')}
        className="api-input"
      />
      
      <h2 style={{ marginTop: '15px' }}>{t('intervalTitle')}</h2>
      <input 
        type="number" 
        min="1"
        max="1440"
        value={intervalTime} 
        onChange={(e) => setIntervalTime(parseInt(e.target.value) || 10)} 
        className="api-input"
      />
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <button onClick={() => onSave(apiKey, intervalTime, lang)} className="primary-btn" style={{ flex: 1 }}>
          {t('saveButton')}
        </button>
        <button onClick={onCancel} className="secondary-btn" style={{ flex: 1, marginTop: 0 }}>
          {t('cancelButton')}
        </button>
      </div>

      <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--border-color)' }}>
        <p className="help-text">{t('testNotifHelp')}</p>
        <button onClick={onTestNotification} className="secondary-btn flex-center">
          <Bell size={16} style={{ marginRight: '6px' }} />
          {t('testNotifButton').replace('🔔 ', '')}
        </button>
      </div>
    </div>
  );
}
