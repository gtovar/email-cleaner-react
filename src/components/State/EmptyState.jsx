import { Inbox, History, Mail } from 'lucide-react';

const EmptyState = ({ type }) => {
  const config = {
    suggestions: {
      icon: Inbox,
      title: 'All caught up!',
      description: 'No email cleanup suggestions right now. Check back later.',
    },
    history: {
      icon: History,
      title: 'No history yet',
      description: 'Your accepted and rejected suggestions will appear here.',
    },
    inbox: {
      icon: Mail,
      title: 'Inbox en cero',
      description: 'No encontramos correos para mostrar en este momento.',
    },
  };

  const { icon: Icon, title, description } = config[type];

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default EmptyState;
