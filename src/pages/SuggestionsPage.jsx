import SuggestionsList from '../components/SuggestionsList.jsx';

export default function SuggestionsPage() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Sugerencias de limpieza
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Revisa y confirma las acciones sugeridas por el sistema.
        </p>
      </div>
      <SuggestionsList />
    </div>
  );
}
