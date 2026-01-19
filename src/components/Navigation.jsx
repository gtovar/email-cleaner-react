// src/components/Navigation.jsx
import React from 'react';

import { History, Inbox, Mail } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip.jsx';

export default function Navigation({ currentView, setView }) {
  const baseClasses =
    'rounded-md px-3 py-2 text-sm font-medium transition-colors';
  const activeClasses = 'bg-primary/10 text-primary';
  const idleClasses = 'text-muted-foreground hover:text-foreground hover:bg-muted';

  return (
    <TooltipProvider>
      <nav className="flex flex-wrap items-center gap-2 rounded-lg bg-muted px-2 py-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={`${baseClasses} ${
                currentView === 'inbox' ? activeClasses : idleClasses
              }`}
              onClick={() => setView('inbox')}
            >
              <span className="flex items-center gap-2">
                <Inbox className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Inbox</span>
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Inbox</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={`${baseClasses} ${
                currentView === 'suggestions' ? activeClasses : idleClasses
              }`}
              onClick={() => setView('suggestions')}
            >
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Sugerencias</span>
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Sugerencias</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={`${baseClasses} ${
                currentView === 'history' ? activeClasses : idleClasses
              }`}
              onClick={() => setView('history')}
            >
              <span className="flex items-center gap-2">
                <History className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Historial</span>
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Historial</TooltipContent>
        </Tooltip>
      </nav>
    </TooltipProvider>
  );
}
