// src/components/HistoryList.jsx
import { useEffect, useState } from 'react';
import { getHistory, confirmAction } from '../services/api.js';
import HistoryItem from './HistoryItem.jsx';

function HistoryList() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 20; // fijo y explícito en el componente

    useEffect(() => {
        async function loadHistory() {
            setLoading(true);
            setFeedback(null);

            try {
                const data = await getHistory(page, perPage);
                setHistory(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setFeedback(
                    err.message || '❌ Error al cargar el historial desde el backend.',
                );
                setHistory([]); //esta linea porque la agregaste que hace cual es su funcion quiero imaginar que hay un error en el try luego que?
            } finally {
                setLoading(false);
            }
        }
        loadHistory();
    }, [page]); 

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

  const canGoPrev = page > 1;
  const canGoNext = history.length === perPage;

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

      {history.length > 0 && (// no me explicaste esto
          <>
          <div className="space-y-3">
          {history.map((item) => {
              const key = `${item.emailId}-${item.timestamp}`;
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

          <div className="mt-4 flex items-center justify-between">
          <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!canGoPrev || loading} 
          className="rounded border px-3 py-1 text-sm disabled:opacity-50"
          >
          Página anterior
          </button>

          <span className="text-sm text-gray-600">Página {page}</span>

          <button
          type="button"
          onClick={() => {
              if (canGoNext) { //Aqui no me explicaste esto en tus respuestas cambiaste esta linea
                  setPage((p) => p + 1);
              }
          }}
          disabled={!canGoNext || loading}
          className="rounded border px-3 py-1 text-sm disabled:opacity-50"
          >
          Página siguiente
          </button>
          </div>
          </>
      )}
    </div>
  );
}

export default HistoryList;

