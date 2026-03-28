import InboxList from '../components/InboxList.jsx';

export default function InboxPage() {
  return (
    <div className="container py-8">
      <div className="mb-6 space-y-2">
        <span className="inline-flex w-fit rounded-full border border-border/70 bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Revision manual y contexto completo
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">Inbox</h1>
        <p className="text-sm text-muted-foreground">
          Usa esta vista cuando necesites leer el correo completo, revisar contexto adicional
          o ejecutar una accion manual fuera de la cola guiada.
        </p>
      </div>
      <InboxList />
    </div>
  );
}
