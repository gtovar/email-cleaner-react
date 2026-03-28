# Checklist de corrida para enviar a ChatGPT

Usa esta guía para ejecutar la ronda completa sin mezclar contextos.

## Antes de empezar

Verifica que existan estas screenshots en `ux_review_bundle/evidence_pack_v2/`:

- `01-home-current.png`
- `02-login-current.png`
- `03-suggestions-overview.png`
- `05-inbox-overview.png`
- `06-receipt-review-dialog.png`
- `07-history-current.png`
- `08-activity-panel-current.png`
- `09-settings-current.png`

## Regla principal

No metas pantallas de grupos distintos en el mismo prompt.

Lo que se quiere evitar:

- mezclar flujo principal con `ReceiptReviewDialog`
- mezclar trust/onboarding con pantallas internas
- mezclar `Settings` con flujo principal como si fuera parte madura del core

## Corrida recomendada

### 1. Flujo principal

Prompt:

- `01_general_flow_main_review.md`

Adjunta:

- `03-suggestions-overview.png`
- `05-inbox-overview.png`
- `07-history-current.png`
- `08-activity-panel-current.png`

Objetivo:

- obtener juicio principal sobre arquitectura de decisión y madurez general del core flow

---

### 2. Trust y onboarding

Prompt:

- `02_public_trust_review.md`

Adjunta:

- `01-home-current.png`
- `02-login-current.png`

Objetivo:

- validar si la promesa pública es honesta, clara y confiable

---

### 3. Flujo especializado

Prompt:

- `03_receipt_specialized_review.md`

Adjunta:

- `06-receipt-review-dialog.png`

Objetivo:

- juzgar el modal como herramienta especializada y no como tesis del producto entero

---

### 4. Settings

Prompt:

- `04_settings_scope_review.md`

Adjunta:

- `09-settings-current.png`

Objetivo:

- detectar si `Settings` sigue fuera del alcance real o comunica promesas falsas

---

### 5. Segunda pasada dura sobre flujo principal

Prompt:

- `05_general_flow_hard_critique.md`

Adjunta:

- `03-suggestions-overview.png`
- `05-inbox-overview.png`
- `07-history-current.png`
- `08-activity-panel-current.png`

Objetivo:

- presionar al reviewer para separar mejoras reales de maquillaje visual

## Cómo mandar cada uno

1. Abre un chat nuevo.
2. Pega el archivo completo del prompt.
3. Adjunta sólo las screenshots indicadas.
4. Envía.
5. Guarda la respuesta antes de pasar al siguiente.

## Qué guardar de cada respuesta

Copia o exporta:

- resumen ejecutivo
- problemas de severidad alta
- 3 cambios prioritarios
- cualquier mención a:
  - arquitectura de decisión
  - verdad de producto
  - confianza
  - estados faltantes

## Nombre sugerido para guardar respuestas

Si las vas a guardar en archivos, usa algo así:

- `respuesta_01_general_flow_main_review.md`
- `respuesta_02_public_trust_review.md`
- `respuesta_03_receipt_specialized_review.md`
- `respuesta_04_settings_scope_review.md`
- `respuesta_05_general_flow_hard_critique.md`

## Cómo interpretar la ronda

Si varias respuestas repiten lo mismo, no lo trates como ruido.
Probablemente ya es patrón.

Presta atención especial a estos cruces:

- si `Suggestions` mejora visualmente pero sigue viéndose débil para decidir
- si `Home/Login` todavía prometen más de lo que el producto realmente sostiene
- si `ReceiptReviewDialog` se percibe como herramienta útil o como interrupción torpe
- si `Settings` sigue pareciendo un scope falso

## Siguiente paso después de recibir respuestas

Haz una síntesis corta con cuatro columnas:

- problema repetido
- pantalla afectada
- tipo de problema
- prioridad

Tipos de problema sugeridos:

- arquitectura de decisión
- UI/jerarquía/copy
- verdad de producto
- estado faltante

Cuando tengas esas respuestas, el siguiente paso útil es cruzarlas otra vez contra código, screenshots y diff actual.
