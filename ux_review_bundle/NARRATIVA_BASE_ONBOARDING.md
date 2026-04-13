# NARRATIVA_BASE_ONBOARDING.md

## Propósito

Este documento fija una narrativa base corta para onboarding.

No es copy final.
No reemplaza decisiones de producto futuras.

Sirve para que `HomePage` y `LoginPage` compartan una misma verdad simple, consistente y defendible.

---

## Problema que debe resolver la narrativa

Hoy el onboarding mezcla tres problemas:

- promete demasiado sobre privacidad con frases absolutas
- reduce el producto a una versión más estrecha de lo que ya hace
- repite ideas parecidas en Home y Login sin una tesis clara

La narrativa base debe corregir eso sin inflar el alcance del producto.

---

## Tesis corta del producto

La app ayuda a revisar y organizar el correo con control humano.

No vende automatización ciega.
No debe vender “solo metadata” como claim absoluto.
Debe transmitir revisión guiada, control y trazabilidad.

---

## Mensaje principal recomendado

La promesa principal del onboarding debe apoyarse en esta idea:

- la app te ayuda a revisar correos y decidir mejor antes de actuar

No debe apoyarse en:

- “borramos por ti”
- “solo metadata”
- “nunca tocamos contenido” si existen flujos específicos que sí cargan más detalle

---

## Pilares de mensaje

### 1. Control humano

Idea:
- el usuario sigue tomando o aprobando decisiones sensibles

Qué aporta:
- baja ansiedad
- sostiene confianza
- diferencia al producto de una automatización agresiva

### 2. Revisión guiada

Idea:
- la app organiza, sugiere y da contexto para actuar

Qué aporta:
- posiciona mejor el valor real actual del producto
- encaja con sugerencias, inbox e historial

### 3. Trazabilidad

Idea:
- el usuario puede revisar lo que hizo o aprobó

Qué aporta:
- refuerza confianza operativa
- conecta bien con `HistoryPage`

### 4. Detalle solo cuando hace falta

Idea:
- hay flujos puntuales donde se muestra más detalle para resolver un caso específico

Qué aporta:
- permite explicar casos como recibos sin convertirlos en la narrativa principal

---

## Lo que Home debe comunicar

Home debe responder:

1. qué problema resuelve la app
2. por qué es segura de usar
3. qué tipo de control conserva el usuario

Home no debe explicar toda la complejidad interna.
Debe vender la dirección correcta:

- revisión guiada
- control humano
- inbox más manejable

---

## Lo que Login debe comunicar

Login debe responder:

1. qué pasa cuando entro con Google
2. qué tipo de control sigo teniendo
3. qué no hará la app sin mi intervención

Login no debe usar claims absolutos que luego choquen con el producto real.
Debe ser más precisa y menos grandilocuente que Home.

---

## Frases guía defendibles

Estas frases son dirección, no redacción final obligatoria.

### Dirección A

- “Revisa y organiza tu correo con control humano.”

### Dirección B

- “Recibe sugerencias, revisa contexto y decide antes de actuar.”

### Dirección C

- “Las acciones sensibles no se ejecutan sin tu intervención.”

### Dirección D

- “Algunos casos muestran más detalle cuando necesitas revisarlos.”

---

## Frases que no deben volver

- “We only read metadata.”
- “We never read the content of your emails.”
- “Nothing happens without your approval” si luego la frase se interpreta como regla técnica absoluta para toda interacción
- cualquier claim que simplifique la seguridad prometiendo algo que el producto visible no sostiene

---

## Reparto recomendado entre Home y Login

### Home

Rol:
- captar interés
- transmitir propuesta de valor
- instalar confianza general

Enfoque:
- revisión guiada
- control humano
- claridad

### Login

Rol:
- reducir ansiedad antes de conectar la cuenta
- explicar de forma simple qué puede esperar el usuario

Enfoque:
- precisión
- límites defendibles
- control sobre acciones sensibles

---

## Versión mínima de narrativa compartida

Si hubiera que resumir la narrativa base en muy pocas líneas, la dirección correcta sería esta:

- la app ayuda a revisar y organizar correos
- da contexto para decidir
- mantiene al usuario dentro de las decisiones sensibles
- ofrece más detalle solo en flujos puntuales donde hace falta

---

## Próximo uso de este documento

Este documento debe usarse para:

1. redactar reemplazos de copy en `HomePage`
2. redactar reemplazos de copy en `LoginPage`
3. revisar si ambos screens siguen cumpliendo roles distintos o si todavía duplican fricción
