import InboxList from '../components/InboxList.jsx';

export default function InboxPage() {
  return (
    <div className="container space-y-6 py-8">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-[#0B1120] px-6 py-7 text-slate-100 shadow-[0_28px_80px_-52px_rgba(15,23,42,0.85)] md:px-8 md:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_28%),radial-gradient(circle_at_right,rgba(59,130,246,0.16),transparent_24%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-3">
            <span className="inline-flex w-fit rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
              Contexto manual
            </span>
            <h2 className="max-w-[13ch] font-home-display text-3xl font-bold leading-[0.96] tracking-[-0.03em] md:text-[2.7rem]">
              Bandeja de Entrada
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              Usa esta vista cuando necesites leer el correo completo o ejecutar acciones manuales.
              Suggestions sigue siendo el lugar recomendado para el loop de limpieza principal.
            </p>
          </div>
        </div>
      </section>

      <div className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] px-4 py-4 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.85)] md:px-5">
        <InboxList />
      </div>
    </div>
  );
}

