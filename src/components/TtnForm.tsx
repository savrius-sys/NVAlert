import { useState } from 'react';
import { t } from '../utils/i18n';
import { Plus, Loader2 } from 'lucide-react';

interface TtnFormProps {
  onAdd: (ttn: string) => Promise<void>;
  loading: boolean;
}

export function TtnForm({ onAdd, loading }: TtnFormProps) {
  const [newTtn, setNewTtn] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(newTtn);
    setNewTtn('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <input 
        type="text" 
        value={newTtn} 
        onChange={(e) => setNewTtn(e.target.value)} 
        placeholder={t('ttnPlaceholder')}
        className="ttn-input"
      />
      <button type="submit" disabled={loading} className="primary-btn flex-center">
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <Plus size={16} style={{ marginRight: '4px' }} />
            {t('addButton').replace('+ ', '')}
          </>
        )}
      </button>
    </form>
  );
}
