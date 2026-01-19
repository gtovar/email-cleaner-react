// src/components/HistoryItem.jsx
import React from 'react';
import { Badge } from './ui/badge.jsx';

export default function HistoryItem({ item }) {
  const { emailId, action, timestamp } = item;

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="text-sm font-medium text-foreground">
        Correo: <span className="text-foreground">{emailId}</span>
      </div>
      <div className="text-sm text-muted-foreground">
        Accion:{' '}
        {action === 'accept' ? (
          <Badge variant="success">Aceptado</Badge>
        ) : (
          <Badge variant="muted">Rechazado</Badge>
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        Fecha: {new Date(timestamp).toLocaleString()}
      </div>
    </div>
  );
}
