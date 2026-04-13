# PLAN_RESOLUCION_UX.md

## Objetivo del plan

Consolidar el feedback repetido del bundle de UX review en un plan operativo de resolución.

Este documento no es una review nueva.
Es una memoria de trabajo para no perder contexto entre sesiones y atacar los problemas en un orden que evite retrabajo.

El objetivo no es “hacer la UI más bonita”.
El objetivo es corregir problemas de:

- confianza
- claridad de decisión
- jerarquía operativa
- consistencia de producto

---

## Estado actual

Ya existe evidencia suficiente en:

- capturas reales del front web
- archivos `.txt` por surface
- prompts usados para crítica
- feedback textual consolidado
- imágenes anotadas dentro de `ux_review_bundle/feedback/`

Los hallazgos ya no son opiniones aisladas.
Hay patrones repetidos.

---

## Frentes de trabajo

### Frente 1. Verdad del producto y confianza

Problema consolidado:
- la promesa visible de privacidad y control puede no coincidir con lo que el producto realmente hace en flujos como recibos

Pantallas afectadas:
- `HomePage`
- `LoginPage`
- `SettingsPage`
- `ReceiptReviewDialog`

Qué debe resolverse aquí:
- qué hace el sistema automáticamente
- qué requiere confirmación humana
- qué datos se leen siempre
- qué datos se leen solo en flujos específicos
- cómo debe explicarse eso sin promesas ambiguas

Por qué va primero:
- si esta capa queda mal, cualquier mejora visual posterior queda débil

---

### Frente 2. Arquitectura de decisión del producto

Problema consolidado:
- el usuario no siempre tiene suficiente contexto para decidir bien

Pantallas afectadas:
- `SuggestionsPage`
- `InboxPage`
- `HistoryPage`
- `ReceiptReviewDialog`

Qué debe resolverse aquí:
- qué decide el usuario en cada surface
- con qué evidencia decide
- qué resultado espera ver después
- cómo se diferencia una decisión guiada, una acción manual y una trazabilidad posterior

Por qué va segundo:
- varias pantallas están rotas por la misma falta de arquitectura de decisión

---

### Frente 3. Jerarquía operativa de Inbox

Problema consolidado:
- `InboxPage` mezcla lectura, acciones por fila, selección múltiple y flujo especializado sin prioridad clara

Pantallas afectadas:
- `InboxPage`

Qué debe resolverse aquí:
- qué acción domina la fila
- qué acciones deben ir a overflow
- cuándo aparece `Revisar recibo`
- para qué sirve realmente el panel derecho
- cómo se presentan acciones destructivas y bulk actions

Por qué va tercero:
- depende de haber aclarado antes la arquitectura de decisión

---

### Frente 4. Flujo especializado de recibos

Problema consolidado:
- `ReceiptReviewDialog` concentra demasiadas tareas en una misma surface sin secuencia fuerte

Pantallas afectadas:
- `ReceiptReviewDialog`

Qué debe resolverse aquí:
- orden de tareas
- estado actual vs acciones disponibles
- prioridad entre revisar, marcar estado y enviar WhatsApp
- reglas de habilitación y feedback

Por qué va cuarto:
- antes de rediseñarlo conviene saber qué rol real cumple este flujo dentro del producto

---

### Frente 5. Consistencia de contenido y superficies secundarias

Problema consolidado:
- mezcla de idiomas, labels ambiguos, screens con apariencia de placeholder y superficies híbridas

Pantallas afectadas:
- `HomePage`
- `LoginPage`
- `SettingsPage`
- `ActivityPanel`
- partes de `HistoryPage`

Qué debe resolverse aquí:
- idioma por defecto
- tono y naming de acciones/estados
- realidad funcional de `SettingsPage`
- función dominante de `ActivityPanel`

Por qué va quinto:
- varias de estas correcciones dependen de decisiones previas de producto y flujo

---

## Problemas consolidados por prioridad

### Prioridad alta

- alinear promesa de privacidad con comportamiento real del producto
- dar más contexto antes de aceptar/rechazar en `SuggestionsPage`
- corregir contradicciones y densidad de acciones en `InboxPage`
- reestructurar `ReceiptReviewDialog` como flujo secuencial
- aclarar el significado y riesgo de `Repetir acción` en `HistoryPage`
- eliminar o rediseñar elementos de `SettingsPage` que no reflejen capacidades reales

### Prioridad media

- decidir si `HomePage` y `LoginPage` duplican fricción o cumplen funciones distintas
- limpiar `ActivityPanel` para que tenga una función dominante
- revisar formatos, idioma y consistencia general de copy

### Prioridad baja

- refinar indicadores de progreso como “0 of 3 reviewed”
- mejorar lectura de métricas del panel lateral
- pulir superficies secundarias una vez que la jerarquía principal esté resuelta

---

## Orden recomendado de ataque

1. Verdad del producto y confianza
2. Arquitectura de decisión del producto
3. Inbox
4. Receipt review
5. History
6. Settings
7. Activity panel
8. Unificación de contenido y detalles de consistencia

Este orden prioriza dependencias.
No conviene rediseñar pantallas antes de cerrar las decisiones marco.

---

## Decisiones previas que hay que cerrar antes de tocar UI

### D1. Promesa exacta del producto

Definir:
- qué se analiza automáticamente
- qué se abre solo cuando el usuario entra a un flujo específico
- cómo se comunica eso sin sobreprometer

### D2. Qué decide el usuario en cada pantalla

Definir:
- qué aprueba exactamente en `SuggestionsPage`
- qué opera manualmente en `InboxPage`
- qué registra `HistoryPage`
- qué objetivo concreto cumple `ReceiptReviewDialog`

### D3. Rol del flujo de recibos dentro del producto

Definir:
- si es flujo central
- si es flujo especializado
- si debe influir en la narrativa principal del producto o no

### D4. Alcance real de Settings

Definir:
- qué configuraciones existen realmente
- qué no debe mostrarse todavía

---

## Siguiente paso exacto

Próxima sesión:

1. Consolidar los hallazgos repetidos en una matriz única de problemas.
2. Cerrar primero `D1` y `D2`.
3. Solo después pasar a propuestas concretas por pantalla.

Si se pierde el hilo, retomar desde:
- este archivo
- `ux_review_bundle/feedback/`
- los `.txt` por surface ya creados

---

## Regla operativa para siguientes iteraciones

No rediseñar una pantalla solo porque “se ve rara”.

Antes de tocar UI, preguntar:

1. ¿este problema es de verdad de producto, de flujo o solo visual?
2. ¿depende de una decisión marco aún no resuelta?
3. ¿resolverlo ahora evitará retrabajo o lo aumentará?

Si la respuesta a la segunda pregunta es “sí”, cerrar primero la decisión marco.
