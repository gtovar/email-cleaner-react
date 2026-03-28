import { Bell, Info, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Switch } from '../components/ui/switch.jsx';
import { Separator } from '../components/ui/separator.jsx';
import { Badge } from '../components/ui/badge.jsx';

export default function SettingsPage() {
  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-8 space-y-2">
        <span className="inline-flex w-fit rounded-full border border-border/70 bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Alcance actual del producto
        </span>
        <h2 className="text-2xl font-semibold tracking-tight">Ajustes</h2>
        <p className="text-sm text-muted-foreground">
          Esta pantalla solo muestra preferencias coherentes con el flujo actual de revision.
          No administra password, perfil ni seguridad avanzada.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Preferencias de revision</CardTitle>
                <CardDescription>
                  Ajustes locales para la forma en que recorres sugerencias y casos manuales.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-foreground">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">Vista compacta en sugerencias</div>
                <div className="text-xs text-muted-foreground">
                  Empieza con tarjetas mas densas cuando revises varias decisiones seguidas.
                </div>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">Mostrar primero casos especializados</div>
                <div className="text-xs text-muted-foreground">
                  Da prioridad visual a recibos y correos que requieren mas supervision humana.
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">Recordar preferencia del panel Inbox</div>
                <div className="text-xs text-muted-foreground">
                  Conserva el contexto manual como vista de apoyo durante la sesion local.
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bell className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Notificaciones del flujo</CardTitle>
                <CardDescription>
                  Preferencias visibles para los recorridos que hoy existen en la app.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-foreground">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">Avisar cuando haya nuevas sugerencias</div>
                <div className="text-xs text-muted-foreground">
                  Mantiene visible el loop principal cuando reaparecen decisiones por revisar.
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">Confirmar antes de acciones sensibles</div>
                <div className="text-xs text-muted-foreground">
                  Conserva confirmacion explicita antes de descartar o ejecutar acciones destructivas.
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">Mantener feedback visible despues del envio</div>
                <div className="text-xs text-muted-foreground">
                  Deja visible el resultado del envio manual de WhatsApp hasta que cierres el dialogo.
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-muted/[0.18]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-primary shadow-sm">
                <Info className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Lo que esta fuera de alcance aqui</CardTitle>
                <CardDescription>
                  Para no prometer mas de lo que el producto sostiene hoy.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-foreground">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full border-border/70 bg-background">
                Password
              </Badge>
              <Badge variant="outline" className="rounded-full border-border/70 bg-background">
                2FA
              </Badge>
              <Badge variant="outline" className="rounded-full border-border/70 bg-background">
                Perfil editable
              </Badge>
              <Badge variant="outline" className="rounded-full border-border/70 bg-background">
                Preferencias persistidas en backend
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              La sesion y la conexion con Google se controlan desde el flujo actual de autenticacion.
              Esta pantalla no cambia credenciales ni configuracion de cuenta.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
