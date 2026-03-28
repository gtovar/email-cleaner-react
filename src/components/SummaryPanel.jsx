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
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
            {summary?.scopeLabel || 'Actividad guiada'}
          </p>
          <p className="text-xs text-muted-foreground">
            Ventana: {period === 'daily' ? 'ultimas 24 horas' : 'ultimos 7 dias'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className={`rounded px-3 py-1 text-xs font-medium ${
              period === 'daily'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
            onClick={() => setPeriod('daily')}
          >
            24 h
          </button>
          <button
            className={`rounded px-3 py-1 text-xs font-medium ${
              period === 'weekly'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
            onClick={() => setPeriod('weekly')}
          >
            7 dias
          </button>
        </div>
      </div>

      {loading && (
        <p className="mt-3 text-sm text-muted-foreground">
          Cargando actividad guiada...
        </p>
      )}
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      {!loading && !error && summary && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-sm text-muted-foreground">
            {summary.scopeDescription ||
              'Este resumen muestra sugerencias generadas y decisiones guiadas dentro de la ventana seleccionada.'}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-muted p-3">
              <div className="text-xs text-muted-foreground">Sugerencias generadas</div>
              <div className="text-xl font-semibold text-foreground">
                {summary.totalSuggestions ?? 0}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="text-xs text-muted-foreground">Decisiones guiadas</div>
              <div className="text-xl font-semibold text-foreground">
                {summary.totalConfirmed ?? 0}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="text-xs text-muted-foreground">Eventos del resumen</div>
              <div className="text-xl font-semibold text-foreground">
                {summary.totalEvents ?? 0}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 text-xs font-semibold text-muted-foreground">
                Sugerencias por accion
              </div>
              {Object.keys(suggestedActions).length === 0 && (
                <div className="text-xs text-muted-foreground">Sin actividad en esta ventana</div>
              )}
              {Object.entries(suggestedActions).map(([action, count]) => (
                <div key={action} className="text-sm text-foreground">
                  {action}: {count}
                </div>
              ))}
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold text-muted-foreground">
                Decisiones registradas
              </div>
              {Object.keys(confirmedActions).length === 0 && (
                <div className="text-xs text-muted-foreground">Sin actividad en esta ventana</div>
              )}
              {Object.entries(confirmedActions).map(([action, count]) => (
                <div key={action} className="text-sm text-foreground">
                  {action}: {count}
                </div>
              ))}
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold text-muted-foreground">
                Clasificaciones detectadas
              </div>
              {Object.keys(classifications).length === 0 && (
                <div className="text-xs text-muted-foreground">Sin actividad en esta ventana</div>
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
