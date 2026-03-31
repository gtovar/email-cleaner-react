// src/components/Navigation.jsx
import React from 'react';

import { History, Inbox, Sparkles } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip.jsx';

export default function Navigation({ currentView, setView }) {
  const baseClasses =
    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors';
  const activeClasses = 'bg-teal-500/10 text-teal-400';
  const idleClasses = 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]';

  return (
    <TooltipProvider>
      <nav className="flex flex-wrap items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-1.5 py-1.5">
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
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Sugerencias</span>
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Loop principal</TooltipContent>
        </Tooltip>
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
          <TooltipContent side="bottom">Revision manual</TooltipContent>
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
