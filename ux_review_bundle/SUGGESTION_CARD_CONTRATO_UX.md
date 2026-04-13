# SUGGESTION_CARD_CONTRATO_UX.md

## Propósito

Este documento traduce `SUGGESTION_CARD_ESPECIFICACION.md` a un contrato UX concreto para la card de `SuggestionsPage`.

No es implementación.
No es diseño visual final.

Su función es fijar:

- campos obligatorios
- campos opcionales
- prioridad visual
- acciones principales y secundarias
- microcopy base

---

## Objetivo de la card

La card debe permitir una decisión rápida, pero informada.

No debe funcionar como una aprobación ciega.
No debe obligar al usuario a abrir detalle en todos los casos.

La card debe permitir que la mayoría de decisiones simples se resuelvan desde el resumen principal, y que las decisiones dudosas tengan una capa de contexto adicional.

---

## Campos obligatorios

Estos campos deben estar visibles siempre.

### 1. Identidad del objeto

Debe mostrar:

- remitente principal o agrupación equivalente
- descriptor breve del correo o patrón
- referencia temporal útil

Función:
- permitir reconocer qué se está evaluando

Ejemplos de contenido:

- nombre del remitente
- asunto o resumen breve
- fecha o frecuencia reciente

---

### 2. Acción sugerida

Debe mostrar de forma explícita:

- qué propone hacer el sistema

Función:
- evitar que el clic principal sea una caja negra

Ejemplos de formulación:

- `Sugerencia: archivar`
- `Sugerencia: eliminar`
- `Sugerencia: marcar como promoción`
- `Sugerencia: revisar antes de decidir`

La acción sugerida no debe quedar escondida detrás del botón.

---

### 3. Razón breve

Debe mostrar:

- por qué existe la sugerencia

Función:
- sostener la decisión con una lógica legible

Ejemplos de formulación:

- `Patrón repetido detectado`
- `No hubo interacción reciente`
- `Remitente recurrente de tipo promocional`
- `Este caso necesita revisión manual`

La razón debe ser breve, pero humana.
No debe sonar a etiqueta vacía de modelo.

---

### 4. Consecuencia resumida

Debe mostrar:

- qué pasará si el usuario acepta

Función:
- convertir la acción en una decisión entendible

Ejemplos de formulación:

- `Si aceptas, este correo se archivará`
- `Si aceptas, se eliminará de tu inbox`
- `Si aceptas, se registrará esta decisión y se aplicará la acción`

No hace falta dramatizar la consecuencia.
Hace falta hacerla explícita.

---

## Campos opcionales

Estos campos no deben mostrarse siempre, pero deben existir como capacidad de segundo nivel.

### 1. Preview breve

Útil cuando:

- el asunto no basta
- el caso es ambiguo
- el patrón no es obvio

### 2. Detalle ampliado

Útil cuando:

- la razón necesita más contexto
- el usuario duda antes de decidir

### 3. Señal secundaria de confianza

Solo útil si:

- acompaña una razón entendible

No debe mostrarse sola como:

- `85% confidence`

si no está acompañada de explicación humana suficiente.

---

## Prioridad visual obligatoria

La card debe ordenar visualmente la información así:

1. identidad del objeto
2. acción sugerida
3. razón breve
4. consecuencia resumida
5. acción de ver más o detalle opcional
6. controles de decisión

Regla:
- los botones no deben ser lo primero que domina la card
- primero debe entenderse la sugerencia
- luego debe ejecutarse la decisión

---

## Acciones de la card

### Acción principal

La acción principal no debe decir solo `Aceptar`.

Debe nombrar la acción real.

Ejemplos:

- `Aprobar archivo`
- `Aprobar eliminación`
- `Aprobar revisión`

Si eso resulta demasiado largo para el layout final, debe mantenerse al menos una etiqueta contextual visible que haga explícita la acción antes del botón.

---

### Acción secundaria

La acción secundaria no debe ser solo `Rechazar` sin contexto.

Puede mantenerse como rechazo, pero debe quedar claro que:

- se está rechazando una sugerencia específica
- no se está ejecutando otra acción oculta

Ejemplos:

- `Descartar sugerencia`
- `No aplicar`

---

### Acción terciaria

Debe existir una acción de profundidad:

- `Ver más`
- `Ver contexto`
- `Revisar detalle`

Esta acción debe ser visible cuando la decisión necesite más apoyo, pero no debe dominar toda la card.

---

## Microcopy recomendado

### Estructura mínima

La card debería poder leerse con algo parecido a esto:

- `Remitente / patrón`
- `Sugerencia: [acción]`
- `Motivo: [razón breve]`
- `Si aceptas: [consecuencia]`

### Ejemplo abstracto

- `Acme Newsletter`
- `Sugerencia: archivar`
- `Motivo: remitente recurrente con bajo nivel de interacción`
- `Si aceptas: este correo se archivará y quedará registrado en tu historial`

---

## Qué no debe volver a aparecer

- `Pending` como badge principal sin explicar nada
- `Accept / Reject` como única semántica visible de decisión
- razón implícita o ausente
- consecuencia implícita o ausente
- confianza algorítmica sin traducción humana

---

## Casos en que la card necesita escalamiento

La card no debe resolver todo desde el resumen principal.

Debe escalar a detalle cuando:

- la acción sugerida sea sensible
- el patrón no sea obvio
- la razón sea insuficiente en una sola línea
- el usuario necesite revisar antes de aceptar

En esos casos, la arquitectura correcta no es meter más ruido en la card.
La arquitectura correcta es:

- card clara
- detalle bajo demanda

---

## Condición mínima para considerar bien resuelta la card

Una card de sugerencia está bien resuelta solo si una persona puede responder, sin ambigüedad:

1. qué está viendo
2. qué le propone el sistema
3. por qué se lo propone
4. qué pasará si acepta

Si cualquiera de esas cuatro respuestas sigue borrosa, la card todavía no está lista.

---

## Próximo paso

El siguiente paso correcto después de este contrato UX es:

1. proponer el layout lógico de la card
2. definir qué va en resumen y qué va en detalle
3. recién después tocar `SuggestionsList.jsx`
