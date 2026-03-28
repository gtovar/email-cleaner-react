# SUGGESTION_CARD_LAYOUT_LOGICO.md

## Propósito

Este documento define el layout lógico de la card de sugerencia.

No es implementación.
No es diseño visual final.

Su función es decidir:

- qué información va siempre visible
- qué información se manda a detalle bajo demanda
- en qué orden debe leerse la card
- cómo deben convivir comprensión y velocidad

---

## Objetivo del layout

La card debe poder leerse de arriba hacia abajo con una secuencia clara:

1. reconocer el caso
2. entender la acción sugerida
3. entender por qué se sugiere
4. entender qué pasará si se acepta
5. decidir o pedir más contexto

Si el layout rompe esa secuencia, la card vuelve a depender de intuición o de clics prematuros.

---

## Resumen principal

Esto debe estar visible siempre en la card.

### Bloque A. Identidad

Contenido:

- remitente o agrupación principal
- descriptor corto del correo o patrón
- señal temporal breve

Función:

- responder “qué estoy viendo”

No debe:

- ocupar más espacio que la acción sugerida
- depender de un preview largo para ser entendible

---

### Bloque B. Acción sugerida

Contenido:

- etiqueta explícita de la acción sugerida

Ejemplos:

- `Sugerencia: archivar`
- `Sugerencia: eliminar`
- `Sugerencia: marcar como promoción`

Función:

- responder “qué me está proponiendo el sistema”

Este bloque debe ser visualmente fuerte.
No debe quedar escondido detrás del botón.

---

### Bloque C. Razón breve

Contenido:

- una línea breve explicando por qué existe la sugerencia

Ejemplos:

- `Patrón repetido detectado`
- `Baja interacción reciente`
- `Remitente promocional recurrente`

Función:

- responder “por qué me lo está proponiendo”

Este bloque debe ser legible, pero no competir con la acción sugerida.

---

### Bloque D. Consecuencia resumida

Contenido:

- una línea breve explicando qué pasa si se aprueba

Ejemplos:

- `Si aceptas, este correo se archivará`
- `Si aceptas, se eliminará y quedará registrado`

Función:

- responder “qué pasará si acepto”

Este bloque debe existir siempre, aunque sea corto.

---

### Bloque E. Controles

Contenido:

- acción principal
- acción secundaria
- acceso a más contexto

Ejemplos:

- `Aprobar archivo`
- `No aplicar`
- `Ver contexto`

Función:

- ejecutar o profundizar la decisión

Los controles van al final, no antes de la explicación.

---

## Detalle bajo demanda

Esto no debe mostrarse siempre.
Debe abrirse solo cuando haga falta más apoyo para decidir.

### Contenido recomendado para detalle

- preview breve del correo
- contexto adicional del patrón
- aclaración de por qué esa acción es la sugerida y no otra
- más precisión sobre el impacto de aceptar

### Qué no debe esconderse aquí

No debe ir en detalle algo que sea crítico para tomar una decisión básica.

No debe esconderse aquí:

- la acción sugerida
- la razón básica
- la consecuencia básica

Si eso queda en detalle, la card principal vuelve a estar rota.

---

## Lectura ideal de la card

La lectura correcta debe sentirse así:

### Paso 1

“Estoy viendo este remitente o este tipo de correo.”

### Paso 2

“El sistema me propone esta acción concreta.”

### Paso 3

“Entiendo por qué me la propone.”

### Paso 4

“Entiendo qué ocurrirá si la apruebo.”

### Paso 5

“Puedo aprobar, no aplicar, o abrir más contexto.”

Si el usuario no puede recorrer mentalmente esa secuencia, el layout no está bien resuelto.

---

## Distribución recomendada por niveles

### Nivel 1. Siempre visible

- remitente o patrón
- descriptor corto
- acción sugerida
- razón breve
- consecuencia breve
- controles principales

### Nivel 2. Bajo demanda

- preview breve
- explicación ampliada
- contexto adicional

### Nivel 3. Nunca como peso principal

- confianza algorítmica sin explicación
- etiquetas vacías como `Pending`
- metadata irrelevante que no cambie la decisión

---

## Reglas de densidad

La card no debe intentar resolver todos los casos con el mismo nivel de información.

Reglas:

- el resumen principal debe bastar para decisiones simples
- el detalle debe existir para decisiones dudosas
- el detalle no debe ser obligatorio para entender la acción básica
- la card no debe volverse una mini página

---

## Condición mínima de aprobación del layout

El layout está listo para pasar a UI solo si cumple esto:

1. la acción sugerida se entiende sin abrir detalle
2. la razón se entiende sin interpretar demasiado
3. la consecuencia se entiende sin adivinar
4. los botones aparecen después de la explicación
5. la capa secundaria agrega profundidad, no rescata una card rota

---

## Próximo paso

El siguiente paso correcto es pasar de layout lógico a propuesta concreta para `SuggestionsList.jsx`:

1. qué campos actuales existen ya en datos
2. qué campos faltan o están implícitos
3. cómo se traduce esto a estructura real del componente
