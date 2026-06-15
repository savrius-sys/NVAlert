import { t } from '../utils/i18n';
import type { TrackedTTN } from '../hooks/useTracking';
import { X, Truck, CheckCircle2, MapPin, Weight, CreditCard, Calendar } from 'lucide-react';

interface TtnListProps {
  ttns: TrackedTTN[];
  onRemove: (number: string) => void;
  appLang: string;
}

export function TtnList({ ttns, onRemove, appLang }: TtnListProps) {
  if (ttns.length === 0) {
    return <p className="empty-state">{t('emptyState')}</p>;
  }

  return (
    <div className="ttn-list">
      {ttns.map((ttn) => {
        const historyRev = ttn.history ? [...ttn.history].reverse() : [];
        
        return (
          <div key={ttn.number} className="ttn-item">
            <div className="ttn-header">
              <span className="ttn-number">{ttn.number}</span>
              <button onClick={() => onRemove(ttn.number)} className="delete-btn" title="Видалити">
                <X size={16} />
              </button>
            </div>

            {ttn.details && (
              <div className="ttn-details">
                {ttn.details.sender && ttn.details.recipient && (
                  <div className="detail-row route">
                    <MapPin size={14} className="detail-icon" />
                    <div className="route-text">
                      <span className="city" title={ttn.details.sender}>{ttn.details.sender.split(',')[0]}</span>
                      <span className="arrow">→</span>
                      <span className="city" title={ttn.details.recipient}>{ttn.details.recipient.split(',')[0]}</span>
                    </div>
                  </div>
                )}
                <div className="detail-row-group">
                  {ttn.details.weight && (
                    <div className="detail-row">
                      <Weight size={14} className="detail-icon" />
                      <span>{ttn.details.weight} {t('kg')}</span>
                    </div>
                  )}
                  {ttn.details.cost && (
                    <div className="detail-row">
                      <CreditCard size={14} className="detail-icon" />
                      <span>{ttn.details.cost} {t('uah')}</span>
                    </div>
                  )}
                  {ttn.details.scheduledDate && (
                    <div className="detail-row">
                      <Calendar size={14} className="detail-icon" />
                      <span>{ttn.details.scheduledDate}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="timeline-container">
              {historyRev.length > 0 ? historyRev.map((event, index) => (
                <div key={event.timestamp} className={`timeline-item ${index === 0 ? 'current' : ''}`}>
                  <div className="timeline-icon">
                    {index === 0 ? (
                      <Truck size={18} className="current-icon" />
                    ) : (
                      <CheckCircle2 size={18} className="past-icon" />
                    )}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-status">{event.status}</div>
                    <div className="timeline-date">
                      {new Date(event.timestamp).toLocaleString(appLang, { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="timeline-item current">
                  <div className="timeline-icon">
                    <Truck size={18} className="current-icon" />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-status">{ttn.status}</div>
                    <div className="timeline-date">
                      {new Date(ttn.lastUpdated).toLocaleString(appLang, { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
