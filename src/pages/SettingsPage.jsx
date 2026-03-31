import { Bell, Info, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Switch } from '../components/ui/switch.jsx';
import { Separator } from '../components/ui/separator.jsx';
import { Badge } from '../components/ui/badge.jsx';

export default function SettingsPage() {
  return (
    <div className="container max-w-4xl space-y-6 py-8">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-[#0B1120] px-6 py-7 text-slate-100 shadow-[0_28px_80px_-52px_rgba(15,23,42,0.85)] md:px-8 md:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_28%),radial-gradient(circle_at_right,rgba(59,130,246,0.16),transparent_24%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-3">
            <span className="inline-flex w-fit rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-teal-300">
              Configuración del workspace
            </span>
            <h2 className="max-w-[13ch] font-home-display text-3xl font-bold leading-[0.96] tracking-[-0.03em] md:text-[2.7rem]">
              Ajustes de Workflow
            </h2>
            <p className="max-w-xl text-sm leading-7 text-slate-400 md:text-base">
              Esta pantalla muestra preferencias para el flujo actual de revisión.
              Email Cleaner se enfoca en la limpieza de tu inbox, no en la gestión de cuenta.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-white/[0.06] bg-white/[0.02] text-slate-100 shadow-xl backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10 text-teal-400">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-100">Revisión guiada</CardTitle>
                <CardDescription className="text-slate-500">
                  Preferencias para el loop de sugerencias.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium text-slate-200">Vista compacta</div>
                <div className="text-xs text-slate-500">
                  Tarjeta densas para revisión masiva.
                </div>
              </div>
              <Switch className="data-[state=checked]:bg-teal-500" />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium text-slate-200">Casos especializados</div>
                <div className="text-xs text-slate-500">
                  Prioridad a recibos y alertas.
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-teal-500" />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium text-slate-200">Contexto Inbox</div>
                <div className="text-xs text-slate-500">
                  Sincronizar vista con el panel manual.
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-teal-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.06] bg-white/[0.02] text-slate-100 shadow-xl backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                <Bell className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-100">Notificaciones</CardTitle>
                <CardDescription className="text-slate-500">
                  Avisos del sistema y feedback.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium text-slate-200">Nuevas sugerencias</div>
                <div className="text-xs text-slate-500">
                  Notificar cuando haya items nuevos.
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-blue-500" />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium text-slate-200">Confirmación de acciones</div>
                <div className="text-xs text-slate-500">
                  Pedir confirmación en items sensibles.
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-blue-500" />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium text-slate-200">Persistent feedback</div>
                <div className="text-xs text-slate-500">
                  Mantener estados de error visibles.
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.06] bg-slate-900/40 text-slate-100 shadow-xl backdrop-blur-xl md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400">
                <Info className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-100">Gestión de Cuenta</CardTitle>
                <CardDescription className="text-slate-500">
                  El alcance de este workspace se limita a la limpieza operativa.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-2">
              {['Password', '2FA', 'Perfil editable', 'Persistencia Backend'].map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full border-white/10 bg-white/5 text-slate-400">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              La conexión con Google se administra desde el flujo de autenticación principal.
              Email Cleaner no almacena contraseñas ni perfiles sociales propios.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

