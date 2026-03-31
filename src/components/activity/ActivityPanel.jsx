import { LogOut, Settings, X } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Sheet, SheetContent, SheetClose } from '../ui/sheet.jsx';
import { Button } from '../ui/button.jsx';
import SummaryPanel from '../SummaryPanel.jsx';
import { Separator } from '../ui/separator.jsx';

export default function ActivityPanel({
  open,
  onOpenChange,
  onNavigate,
  onLogout,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent 
        aria-label="Activity panel"
        className="w-full border-l border-white/10 bg-[#0B1120]/95 p-0 text-slate-100 backdrop-blur-xl sm:max-w-md"
      >
        <DialogPrimitive.Title className="sr-only">Activity panel</DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">
          Summary drawer with recent activity, settings access, and logout action.
        </DialogPrimitive.Description>
        
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 py-5">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-100">Actividad</h3>
            <p className="text-[11px] text-slate-500">Resumen y herramientas</p>
          </div>
          <SheetClose asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              aria-label="Cerrar panel"
              className="h-8 w-8 rounded-lg p-0 text-slate-500 hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </SheetClose>
        </div>

        <div className="h-[calc(100vh-81px)] overflow-y-auto px-6 py-6 scrollbar-hide">
          <SummaryPanel />
          
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Preferencias</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <button
              type="button"
              onClick={() => onNavigate?.('settings')}
              className="group flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3.5 transition-all hover:border-white/10 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200">
                  <Settings className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100">Ajustes del Workspace</span>
              </div>
              <X className="h-4 w-4 rotate-45 text-slate-600 group-hover:text-slate-400" />
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="group flex w-full items-center justify-between rounded-2xl border border-rose-500/10 bg-rose-500/[0.02] px-4 py-3.5 transition-all hover:border-rose-500/20 hover:bg-rose-500/[0.05]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 group-hover:text-rose-300">
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-rose-400 group-hover:text-rose-300">Cerrar sesión</span>
              </div>
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-700">
              Email Cleaner v2.4
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

