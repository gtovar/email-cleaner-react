import InboxList from '../components/InboxList.jsx';

export default function InboxPage() {
  return (
    <div className="container py-8">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Inbox</h1>
        <p className="text-sm text-muted-foreground">
          Tus correos recientes en una vista tipo Gmail.
        </p>
      </div>
      <InboxList />
    </div>
  );
}
