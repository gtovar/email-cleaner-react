// src/components/HistoryList.jsx
import { useEffect, useState } from 'react';
import { getHistory, confirmAction } from '../services/api.js';
import HistoryItem from './HistoryItem.jsx';

function HistoryList() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      setFeedback(null);

      try {
        const data = await getHistory(1, 20);
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setFeedback(
          err.message || '❌ Error al cargar el historial desde el backend.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const repeatAction = async (emailId, action) => {
    try {
      setFeedback(null);
      await confirmAction([emailId], action);
      setFeedback(`✅ Acción "${action}" repetida para ${emailId}`);
    } catch (err) {
      console.error(err);
      setFeedback(err.message || '❌ Error al repetir la acción.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Historial de acciones</h2>

      {loading && <p className="mb-4 text-sm text-gray-500">Cargando...</p>}

      {feedback && (
        <div className="mb-4 text-sm text-blue-700">{feedback}</div>
      )}

      {!loading && history.length === 0 && (
        <p className="text-sm text-gray-500">
          No hay acciones registradas todavía.
        </p>
      )}

      <div className="space-y-3">
        {history.map((item) => {
          const key = item.id || item.emailId || item.timestamp;
          return (
            <div key={key} className="bg-white rounded-xl shadow-sm p-4">
              <HistoryItem item={item} />
              <button
                onClick={() => repeatAction(item.emailId, item.action)}
                className="mt-3 bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
              >
                Repetir acción
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HistoryList;

