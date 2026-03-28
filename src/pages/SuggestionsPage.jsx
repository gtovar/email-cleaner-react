import SuggestionsList from '../components/SuggestionsList.jsx';

export default function SuggestionsPage() {
  return (
    <div className="container py-8">
      <div className="mb-6 space-y-2">
        <span className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Empieza aqui
        </span>
        <h2 className="text-2xl font-semibold tracking-tight">
          Cola guiada de decisiones
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Este es el punto de entrada principal para limpiar tu inbox. Usa Inbox solo
          cuando necesites leer el correo completo o revisar mas contexto antes de decidir.
        </p>
      </div>
      <SuggestionsList />
    </div>
  );
}
