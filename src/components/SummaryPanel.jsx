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
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
        <p className="text-xs text-muted-foreground">
          Window: {period === 'daily' ? '24 hours' : '7 days'}
        </p>
        <div className="flex gap-2">
          <button
            className={`rounded px-3 py-1 text-xs font-medium ${
              period === 'daily'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
            onClick={() => setPeriod('daily')}
          >
            Daily
          </button>
          <button
            className={`rounded px-3 py-1 text-xs font-medium ${
              period === 'weekly'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
            onClick={() => setPeriod('weekly')}
          >
            Weekly
          </button>
        </div>
      </div>

      {loading && (
        <p className="mt-3 text-sm text-muted-foreground">
          Loading summary...
        </p>
      )}
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      {!loading && !error && summary && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-muted p-3">
              <div className="text-xs text-muted-foreground">Total suggestions</div>
              <div className="text-xl font-semibold text-foreground">
                {summary.totalSuggestions ?? 0}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="text-xs text-muted-foreground">Confirmed</div>
              <div className="text-xl font-semibold text-foreground">
                {summary.totalConfirmed ?? 0}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="text-xs text-muted-foreground">Events</div>
              <div className="text-xl font-semibold text-foreground">
                {summary.totalEvents ?? 0}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 text-xs font-semibold text-muted-foreground">
                Suggested actions
              </div>
              {Object.keys(suggestedActions).length === 0 && (
                <div className="text-xs text-muted-foreground">No data</div>
              )}
              {Object.entries(suggestedActions).map(([action, count]) => (
                <div key={action} className="text-sm text-foreground">
                  {action}: {count}
                </div>
              ))}
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold text-muted-foreground">
                Confirmed actions
              </div>
              {Object.keys(confirmedActions).length === 0 && (
                <div className="text-xs text-muted-foreground">No data</div>
              )}
              {Object.entries(confirmedActions).map(([action, count]) => (
                <div key={action} className="text-sm text-foreground">
                  {action}: {count}
                </div>
              ))}
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold text-muted-foreground">
                Classifications
              </div>
              {Object.keys(classifications).length === 0 && (
                <div className="text-xs text-muted-foreground">No data</div>
              )}
              {Object.entries(classifications).map(([label, count]) => (
                <div key={label} className="text-sm text-foreground">
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
