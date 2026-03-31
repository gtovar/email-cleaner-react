import SuggestionsList from '../components/SuggestionsList.jsx';

export default function SuggestionsPage() {
  return (
    <div className="container space-y-6 py-8">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-[#0B1120] px-6 py-7 text-slate-100 shadow-[0_28px_80px_-52px_rgba(15,23,42,0.85)] md:px-8 md:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_28%),radial-gradient(circle_at_right,rgba(59,130,246,0.16),transparent_24%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-3">
            <span className="inline-flex w-fit rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-teal-300">
              Empieza aqui
            </span>
            <h2 className="max-w-[13ch] font-home-display text-3xl font-bold leading-[0.96] tracking-[-0.03em] md:text-[2.7rem]">
              Cola guiada de decisiones
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              Este es el punto de entrada principal para limpiar tu inbox. Usa Inbox solo
              cuando necesites leer el correo completo o revisar mas contexto antes de decidir.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[24rem] lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Default mode
              </p>
              <p className="mt-1 text-sm font-medium text-slate-100">Suggestions first</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Visual rule
              </p>
              <p className="mt-1 text-sm font-medium text-slate-100">Reason and confidence stay visible</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Escalation
              </p>
              <p className="mt-1 text-sm font-medium text-slate-100">Inbox only when you need more evidence</p>
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] px-4 py-4 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.85)] md:px-5">
        <SuggestionsList />
      </div>
    </div>
  );
}
