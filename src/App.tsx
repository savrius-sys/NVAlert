import { useEffect } from 'react';
import { useTracking } from './hooks/useTracking';
import { SettingsPanel } from './components/SettingsPanel';
import { TtnForm } from './components/TtnForm';
import { TtnList } from './components/TtnList';
import { t, setI18nLanguage } from './utils/i18n';
import { Package, Settings, RefreshCw, ArrowLeft } from 'lucide-react';
import './App.css';

function App() {
  const {
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
  } = useTracking();

  useEffect(() => {
    setI18nLanguage(appLang);
  }, [appLang]);

  return (
    <div className="container">
      <header>
        <div className="header-top">
          <h1>
            <Package size={24} style={{ verticalAlign: 'text-bottom', marginRight: '8px' }} />
            {t('extensionName')}
          </h1>
          <button 
            className="icon-btn" 
            onClick={() => setShowSettings(!showSettings)}
            title={showSettings ? t('closeSettings') : t('settingsTitle')}
          >
            {showSettings ? <ArrowLeft size={20} /> : <Settings size={20} />}
          </button>
        </div>
      </header>

      {error && <div className="error-alert">{error}</div>}

      {showSettings ? (
        <SettingsPanel 
          initialApiKey={apiKey}
          initialInterval={intervalTime}
          initialLang={appLang}
          onSave={saveSettings}
          onCancel={() => setShowSettings(false)}
          onTestNotification={testNotification}
        />
      ) : (
        <div className="main-panel">
          <TtnForm onAdd={addTtn} loading={loading} />

          <div className="actions">
            <button 
              onClick={refreshAll} 
              disabled={loading || ttns.length === 0} 
              className="secondary-btn flex-center"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} style={{ marginRight: '6px' }} />
              {t('refreshAllButton')}
            </button>
          </div>

          <TtnList ttns={ttns} onRemove={removeTtn} appLang={appLang} />
        </div>
      )}
    </div>
  );
}

export default App;
