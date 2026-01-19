import HistoryList from '../components/HistoryList.jsx';

export default function HistoryPage() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Historial de acciones
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Consulta las decisiones anteriores y repite acciones si es necesario.
        </p>
      </div>
      <HistoryList />
    </div>
  );
}
