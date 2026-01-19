import { LogOut, Settings, X } from 'lucide-react';
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
      <SheetContent aria-label="Activity panel">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Resumen</h3>
          <SheetClose asChild>
            <Button variant="ghost" size="sm" aria-label="Cerrar panel">
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </SheetClose>
        </div>
        <div className="h-[calc(100vh-52px)] overflow-y-auto p-4">
          <SummaryPanel />
          <div className="mt-6 space-y-3">
            <Separator />
            <button
              type="button"
              onClick={() => onNavigate?.('settings')}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              Ajustes
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
