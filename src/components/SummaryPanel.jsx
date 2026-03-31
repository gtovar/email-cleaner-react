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
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-400/80">
            {summary?.scopeLabel || 'Actividad guiada'}
          </p>
          <p className="text-[11px] text-slate-500">
            Ventana: {period === 'daily' ? 'ultimas 24 horas' : 'ultimos 7 dias'}
          </p>
        </div>
        <div className="flex rounded-lg border border-white/5 bg-white/[0.04] p-1">
          <button
            type="button"
            className={`rounded-md px-3 py-1 text-[11px] font-medium transition-all ${
              period === 'daily'
                ? 'bg-teal-500/20 text-teal-300'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            onClick={() => setPeriod('daily')}
          >
            24 h
          </button>
          <button
            type="button"
            className={`rounded-md px-3 py-1 text-[11px] font-medium transition-all ${
              period === 'weekly'
                ? 'bg-blue-500/20 text-blue-300'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            onClick={() => setPeriod('weekly')}
          >
            7 dias
          </button>
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          <div className="h-20 animate-pulse rounded-2xl bg-white/[0.03]" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-16 animate-pulse rounded-xl bg-white/[0.02]" />
            <div className="h-16 animate-pulse rounded-xl bg-white/[0.02]" />
            <div className="h-16 animate-pulse rounded-xl bg-white/[0.02]" />
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-300">
          {error}
        </div>
      )}

      {!loading && !error && summary && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-xs leading-relaxed text-slate-400 shadow-inner">
            {summary.scopeDescription ||
              'Este resumen muestra sugerencias generadas y decisiones guiadas dentro de la ventana seleccionada.'}
          </div>

          <div className="grid gap-3 grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-center transition-colors hover:bg-white/[0.04]">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">Sugerencias</div>
              <div className="mt-1 text-xl font-bold text-slate-100">
                {summary.totalSuggestions ?? 0}
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-center transition-colors hover:bg-white/[0.04]">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">Decisiones</div>
              <div className="mt-1 text-xl font-bold text-teal-400">
                {summary.totalConfirmed ?? 0}
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-center transition-colors hover:bg-white/[0.04]">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">Eventos</div>
              <div className="mt-1 text-xl font-bold text-blue-400">
                {summary.totalEvents ?? 0}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Acciones sugeridas</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              {Object.keys(suggestedActions).length === 0 ? (
                <p className="text-center text-xs text-slate-600">Sin actividad reciente</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(suggestedActions).map(([action, count]) => (
                    <div key={action} className="flex items-center justify-between text-xs">
                      <span className="capitalize text-slate-400">{action.replace('_', ' ')}</span>
                      <span className="font-mono font-medium text-slate-200">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Decisiones tomadas</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              {Object.keys(confirmedActions).length === 0 ? (
                <p className="text-center text-xs text-slate-600">Sin decisiones registradas</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(confirmedActions).map(([action, count]) => (
                    <div key={action} className="flex items-center justify-between text-xs">
                      <span className="capitalize text-slate-400">{action.replace('_', ' ')}</span>
                      <span className="font-mono font-medium text-teal-400">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Patrones</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              {Object.keys(classifications).length === 0 ? (
                <p className="text-center text-xs text-slate-600">No hay patrones detectados</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(classifications).map(([label, count]) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <span className="truncate pr-4 text-slate-400" title={label}>{label.replace(/_/g, ' ')}</span>
                      <span className="font-mono font-medium text-blue-400">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SummaryPanel;
