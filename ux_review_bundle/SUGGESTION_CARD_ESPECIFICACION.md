# SUGGESTION_CARD_ESPECIFICACION.md

## Propósito

Este documento define la arquitectura mínima de decisión para `SuggestionsPage`.

No es diseño visual final.
No es implementación.

Su función es fijar qué información debe recibir el usuario para poder aceptar o rechazar una sugerencia con suficiente claridad, sin convertir la pantalla en una superficie pesada.

---

## Problema que resuelve

Hoy `SuggestionsPage` pide decisiones con contexto insuficiente.

El problema principal no es que falten más palabras.
El problema principal es que la card no deja suficientemente claro:

- qué propone el sistema
- por qué lo propone
- qué pasará si el usuario acepta

Si eso no se corrige, la pantalla central del producto sigue funcionando como una aprobación con baja confianza, no como revisión guiada.

---

## Tesis operativa

Cada card de sugerencia debe comportarse como una **unidad mínima de decisión guiada**.

La card no debe limitarse a mostrar un correo y dos botones.
Debe permitir responder rápidamente estas cuatro preguntas:

1. ¿qué estoy viendo?
2. ¿qué me sugiere hacer el sistema?
3. ¿por qué me lo sugiere?
4. ¿qué pasa si acepto?

Si una card no responde eso, la decisión queda subsoportada.

---

## Arquitectura mínima obligatoria de la card

Cada sugerencia debe incluir como mínimo estas cuatro capas:

### 1. Objeto

Qué correo, remitente o patrón está siendo evaluado.

Debe permitir reconocer:

- remitente o agrupación relevante
- asunto o descriptor principal
- señal temporal útil
- contexto mínimo para identificar de qué se trata

No debe depender de que el usuario adivine qué tipo de correo está viendo.

---

### 2. Acción sugerida

La card debe decir de forma explícita qué acción propone el sistema.

No basta con `Accept`.
El usuario debe entender si está aprobando algo como:

- archivar
- eliminar
- marcar como promoción
- ignorar futuros similares
- revisar con más detalle

La acción sugerida debe ser visible antes del clic principal.

---

### 3. Razón

La card debe mostrar por qué existe esa sugerencia.

La razón no necesita ser larga, pero sí comprensible.

Debe responder algo como:

- se detectó un patrón repetido
- este remitente suele caer en una categoría concreta
- el usuario no interactúa con este tipo de correo
- el sistema encontró una señal consistente para sugerir esta acción

No conviene mostrar una “confianza” desnuda sin una razón entendible.

La razón debe ser interpretable por una persona, no solo por el modelo.

---

### 4. Consecuencia

La card debe anticipar qué ocurrirá si el usuario acepta.

Debe dejar claro:

- qué acción se ejecutará
- sobre qué unidad aplicará
- si el resultado es reversible, sensible o requiere revisión posterior

La consecuencia no tiene que verse como advertencia dramática.
Tiene que verse como claridad operativa.

---

## Lo que no debe cargar siempre la card

La card no debe intentar mostrar siempre:

- todo el contenido del correo
- toda la lógica del sistema
- todo el historial asociado
- todo el detalle del patrón

Eso vuelve la pantalla densa y lenta.

La arquitectura correcta es:

- mínimo suficiente visible
- más detalle bajo demanda

---

## Capa secundaria recomendada

Cuando la decisión no quede suficientemente clara con el resumen principal, la surface debe ofrecer una capa secundaria.

Esa capa puede tomar la forma de:

- expansión ligera
- preview
- detalle contextual
- acción de “ver más”

La capa secundaria debe servir para profundizar.
No debe ser un escondite para información crítica que la card principal debería mostrar siempre.

---

## Jerarquía de información dentro de la card

La prioridad recomendada es esta:

1. objeto
2. acción sugerida
3. razón
4. consecuencia
5. detalle opcional
6. controles de decisión

Los botones no deben ser lo primero que domine si la acción todavía no está bien entendida.

---

## Reglas de copy para la card

La card debe usar lenguaje:

- específico
- operativo
- corto
- no algorítmicamente opaco

Evitar:

- labels ambiguos como `Pending` sin contexto
- verbos genéricos como `Accept` si la acción real no está nombrada
- frases que suenen inteligentes pero no expliquen nada
- puntuaciones de confianza sin razón entendible

Preferir:

- acción explícita
- razón breve
- consecuencia clara

---

## Qué decisiones toma el usuario en esta pantalla

`SuggestionsPage` no debe presentar una decisión abstracta.

El usuario debe estar tomando una decisión concreta de este tipo:

- aprobar una acción sugerida
- rechazar una acción sugerida
- pedir más contexto antes de decidir

Si la pantalla no deja clara cuál de esas tres cosas está ocurriendo, el flujo pierde coherencia.

---

## Qué feedback debe devolver el sistema después

Después de aceptar o rechazar, la experiencia debe dejar claro:

- qué se registró
- qué se ejecutó o no se ejecutó
- qué cambió en la interfaz
- si la sugerencia desapareció, cambió de estado o quedó trazada

Sin ese feedback, la decisión se siente opaca.

---

## Riesgos que esta especificación busca prevenir

- aceptación por inercia
- rechazo defensivo por falta de claridad
- contradicción entre la promesa de revisión guiada y la experiencia real
- sobrecarga por exceso de detalle
- falsa sensación de confianza apoyada en labels vacíos

---

## Versión mínima de la card en lenguaje operativo

Cada sugerencia debe mostrar, antes de pedir decisión:

- qué correo o patrón es
- qué acción concreta propone el sistema
- por qué la propone
- qué ocurrirá si el usuario la aprueba

Y debe permitir, cuando haga falta:

- ver más contexto antes de decidir

Esta es la condición mínima para que `SuggestionsPage` funcione como revisión guiada y no como feed de aprobación rápida.

---

## Próximo paso

Antes de rediseñar layout o estilos, el siguiente paso correcto es traducir esta especificación a:

1. campos concretos de una card de sugerencia
2. prioridad visual entre esos campos
3. propuesta de copy y microcopy para estados y acciones
