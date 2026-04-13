# Contextos listos para pegar en prompts UX

Usa estos bloques para reemplazar la sección `## Contexto` de los prompts en esta segunda ronda.

No uses un solo contexto para todas las screenshots.
El `evidence_pack_v2` mezcla superficies de onboarding, flujo general, flujo especializado y una pantalla de alcance dudoso (`Settings`).

## 1. Flujo general guiado

Usar con:

- `03-suggestions-overview.png`
- `05-inbox-overview.png`
- `07-history-current.png`
- `08-activity-panel-current.png`

Pega esto:

```md
## Contexto

* Producto: app web que ayuda a una persona a revisar y limpiar su inbox de Gmail con sugerencias guiadas, revisión manual y trazabilidad de acciones.
* Usuario objetivo: personas con inbox saturado que quieren decidir rápido qué archivar, borrar o conservar, sin perder control sobre correos importantes.
* Objetivo de esta pantalla: ayudar a entender el estado del inbox y tomar decisiones de limpieza con suficiente contexto, claridad y confianza.
* Momento del flujo: parte del flujo principal de uso después de autenticarse; representa la experiencia central del producto, no una herramienta secundaria.
* Restricciones: esta revisión está basada en screenshots actuales del producto local con backend en modo fixture; evalúa claridad de decisión y madurez percibida por separado; no asumas integraciones reales más allá de lo visible.
```

## 2. Flujo especializado de recibos

Usar con:

- `06-receipt-review-dialog.png`

Pega esto:

```md
## Contexto

* Producto: app web que ayuda a revisar y limpiar un inbox, pero que también puede abrir un flujo especializado para analizar un correo individual con más detalle.
* Usuario objetivo: personas que normalmente limpian su inbox rápido, pero que a veces necesitan inspeccionar un correo puntual con más contexto antes de decidir.
* Objetivo de esta pantalla: permitir revisar un correo de tipo recibo o comprobante como caso especializado, con suficiente detalle para decidir si conservarlo, organizarlo o descartarlo.
* Momento del flujo: aparece como rama operativa especializada desde Inbox; no representa la promesa completa del producto ni el flujo principal general.
* Restricciones: esta revisión está basada en screenshots; evalúa esta pantalla como herramienta especializada y no como resumen del producto entero; si detectas contradicciones con la promesa general, señálalas explícitamente.
```

## 3. Superficies públicas de confianza

Usar con:

- `01-home-current.png`
- `02-login-current.png`

Pega esto:

```md
## Contexto

* Producto: app web para limpiar y revisar un inbox de Gmail con ayuda guiada, manteniendo control humano sobre las decisiones importantes.
* Usuario objetivo: personas interesadas en reducir ruido en su correo sin sentir que una automatización opaca tomará decisiones por ellas.
* Objetivo de esta pantalla: explicar honestamente qué hace el producto, generar confianza antes del login y preparar a la persona para autenticarse con Google.
* Momento del flujo: etapa pública de descubrimiento y acceso, antes de entrar al producto autenticado.
* Restricciones: esta revisión debe juzgar verdad de producto, framing de confianza y claridad previa a OAuth; no asumas promesas absolutas de privacidad o automatización que no estén sustentadas por el flujo interno.
```

## 4. Settings como realidad actual

Usar con:

- `09-settings-current.png`

Pega esto:

```md
## Contexto

* Producto: app web para ayudar a limpiar y revisar un inbox con foco principal en sugerencias, control manual y trazabilidad.
* Usuario objetivo: personas que quieren una herramienta simple y confiable para manejar su correo sin configuración compleja ni expectativas falsas de administración completa de cuenta.
* Objetivo de esta pantalla: mostrar la configuración actual disponible y dejar claro si esas opciones son realmente parte del alcance del producto.
* Momento del flujo: pantalla secundaria dentro del producto autenticado; no debería competir con el flujo principal ni introducir promesas que el producto no sostiene.
* Restricciones: esta pantalla sigue bajo cuestionamiento de product truth; revísala no sólo como UI, sino como posible desalineación entre alcance real y lo que la interfaz sugiere.
```

## 5. Instrucción extra recomendada para cualquier prompt

Después del contexto, conviene agregar este bloque corto:

```md
Antes de responder, distingue explícitamente entre:

1. problemas de arquitectura de decisión
2. problemas de UI/copy/jerarquía visual
3. problemas de verdad de producto o alcance

No mezcles esos tres niveles en un único juicio superficial.
```

## 6. Dominio recomendado para `ux_prompt_experto_dominio.txt`

Donde dice `[TU DOMINIO]`, usa:

- `productividad personal y gestión de correo electrónico`

Si quieres una lectura más estricta de riesgo operativo, usa:

- `gestión de correo electrónico y toma de decisiones sobre información personal`

## 7. Rol recomendado para cada prompt

- `ux_prompt_product_manager.txt`: `Product Manager`
- `ux_prompt_product_designer.txt`: `Product Designer`
- `ux_prompt_ux_designer.txt`: `UX Designer`
- `ux_prompt_ux_writer.txt`: `UX Writer`
- `ux_prompt_frontend_engineer.txt`: `Frontend Engineer`
- `ux_prompt_qa_producto.txt`: `QA Lead`
- `ux_prompt_accessibility.txt`: no necesita cambio de rol
- `ux_prompt_experto_dominio.txt`: define el dominio y usa `experto/a senior`
- `ux_review_prompt_principal.txt`: usa `Product Designer`, `UX Designer` o `Product Manager`
- `ux_review_prompt_critica_dura.txt`: úsalo sólo después del prompt principal, no como único juicio

## 8. Orden sugerido de envío

1. `ux_review_prompt_principal.txt` o `ux_prompt_product_designer.txt`
2. `ux_prompt_product_manager.txt`
3. `ux_prompt_ux_writer.txt`
4. `ux_prompt_accessibility.txt`
5. `ux_review_prompt_critica_dura.txt`

Deja `ux_prompt_frontend_engineer.txt` y `ux_prompt_qa_producto.txt` para una segunda pasada más técnica.
