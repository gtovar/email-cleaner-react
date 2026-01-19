import { Bell, Shield, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Switch } from '../components/ui/switch.jsx';
import { Button } from '../components/ui/button.jsx';
import { Separator } from '../components/ui/separator.jsx';

export default function SettingsPage() {
  return (
    <div className="container py-8 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Ajustes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configura tus preferencias de limpieza y seguridad.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Cuenta</CardTitle>
                <CardDescription>
                  Administra los datos principales de tu cuenta.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="account-email">Correo principal</Label>
              <Input id="account-email" type="email" placeholder="tu@email.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account-name">Nombre visible</Label>
              <Input id="account-name" type="text" placeholder="Nombre para mostrar" />
            </div>
            <Button type="button">Guardar cambios</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bell className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>
                  Elige como quieres recibir actualizaciones.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-foreground">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">Reportes por correo</div>
                <div className="text-xs text-muted-foreground">
                  Recibe reportes de limpieza en tu correo.
                </div>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">Resumen semanal</div>
                <div className="text-xs text-muted-foreground">
                  Ve un resumen semanal de la actividad.
                </div>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">Nuevas sugerencias</div>
                <div className="text-xs text-muted-foreground">
                  Avisar cuando haya nuevas sugerencias.
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
                <Shield className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>
                  Refuerza la proteccion de tu cuenta.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Password actual</Label>
              <Input id="current-password" type="password" placeholder="********" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">Password nueva</Label>
              <Input id="new-password" type="password" placeholder="********" />
            </div>
            <Button type="button" variant="outline">
              Actualizar password
            </Button>
            <div className="pt-4 space-y-4">
              <Separator />
              <div className="flex items-center justify-between gap-4 text-sm text-foreground">
                <div>
                  <div className="font-medium">Doble factor (2FA)</div>
                  <div className="text-xs text-muted-foreground">
                    Agrega una capa extra de seguridad.
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
