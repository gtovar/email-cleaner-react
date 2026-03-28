// src/components/HistoryItem.jsx
import React from 'react';
import { Badge } from './ui/badge.jsx';

export default function HistoryItem({ item }) {
  const { emailId, action, timestamp, subject } = item;
  const actionLabel = action === 'accept' ? 'Aceptada' : action === 'reject' ? 'Descartada' : action;

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Registro de decisión
        </p>
        <div className="text-sm font-semibold text-foreground">{subject || emailId}</div>
        {subject ? <div className="text-xs text-muted-foreground">{emailId}</div> : null}
      </div>
      <div className="mt-3 text-sm text-muted-foreground">
        Decisión registrada:{' '}
        {action === 'accept' ? (
          <Badge variant="success" className="rounded-full">{actionLabel}</Badge>
        ) : (
          <Badge variant="muted" className="rounded-full">{actionLabel}</Badge>
        )}
      </div>
      <div className="mt-3 rounded-xl bg-muted/45 px-3 py-2 text-xs text-muted-foreground">
        Fecha: {new Date(timestamp).toLocaleString()}
      </div>
    </div>
  );
}
