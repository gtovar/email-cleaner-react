// src/components/SummaryPanel.jsx
import { useEffect, useState } from 'react';
import { getSummary } from '../services/api.js';

function SummaryPanel() {
  const [period, setPeriod] = useState('daily');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSummary() {
      setLoading(true);
      setError(null);
      try {
        const data = await getSummary(period);
        setSummary(data);
      } catch (err) {
        setError(err.message || 'Error loading summary.');
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, [period]);

  const suggestedActions = summary?.suggestedActions || {};
  const confirmedActions = summary?.confirmedActions || {};
  const classifications = summary?.classifications || {};

  return (
    <section className="mb-6 rounded-xl bg-white p-4 shadow-sm border">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Summary</h3>
          <p className="text-xs text-gray-500">
            Window: {period === 'daily' ? '24 hours' : '7 days'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded text-sm ${period === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setPeriod('daily')}
          >
            Daily
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${period === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setPeriod('weekly')}
          >
            Weekly
          </button>
        </div>
      </div>

      {loading && <p className="mt-3 text-sm text-gray-500">Loading summary...</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {!loading && !error && summary && (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-xs text-gray-500">Total suggestions</div>
            <div className="text-xl font-semibold text-gray-800">
              {summary.totalSuggestions ?? 0}
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-xs text-gray-500">Confirmed</div>
            <div className="text-xl font-semibold text-gray-800">
              {summary.totalConfirmed ?? 0}
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-xs text-gray-500">Events</div>
            <div className="text-xl font-semibold text-gray-800">
              {summary.totalEvents ?? 0}
            </div>
          </div>

          <div className="sm:col-span-3 grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">
                Suggested actions
              </div>
              {Object.keys(suggestedActions).length === 0 && (
                <div className="text-xs text-gray-400">No data</div>
              )}
              {Object.entries(suggestedActions).map(([action, count]) => (
                <div key={action} className="text-sm text-gray-700">
                  {action}: {count}
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">
                Confirmed actions
              </div>
              {Object.keys(confirmedActions).length === 0 && (
                <div className="text-xs text-gray-400">No data</div>
              )}
              {Object.entries(confirmedActions).map(([action, count]) => (
                <div key={action} className="text-sm text-gray-700">
                  {action}: {count}
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">
                Classifications
              </div>
              {Object.keys(classifications).length === 0 && (
                <div className="text-xs text-gray-400">No data</div>
              )}
              {Object.entries(classifications).map(([label, count]) => (
                <div key={label} className="text-sm text-gray-700">
                  {label}: {count}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SummaryPanel;
