# REVISION_CLAIMS_HOME_LOGIN.md

## Propósito

Este documento traduce `VERDAD_MINIMA_PRODUCTO.md` en una revisión operativa de claims visibles para `HomePage` y `LoginPage`.

No es copy final.
No modifica la UI.

Su función es identificar:

- qué claims visibles ya no resisten la realidad del producto
- qué claims siguen siendo defendibles
- qué claims deben reemplazarse por formulaciones más precisas

---

## Criterio de revisión

Un claim visible debe pasar estas pruebas:

1. no contradice el comportamiento real del producto
2. no promete una limitación falsa solo para sonar más seguro
3. no oculta diferencias entre revisión general y flujos especializados
4. sigue siendo entendible para una persona que todavía no conoce el producto

---

## HomePage

### Claims que pueden mantenerse

#### “Email Cleaner helps you find and remove clutter safely and on your terms.”

Diagnóstico:
- defendible con ajustes menores

Por qué:
- la idea de control y seguridad sí coincide con la intención visible del producto
- “on your terms” es coherente con revisión humana y aprobación

Riesgo:
- “remove clutter” puede sonar más amplio que el comportamiento real actual si no queda claro qué acciones sí hace el usuario y cuáles no

Dirección:
- mantener la idea de control
- aterrizar mejor qué significa “safely” y qué significa “on your terms”

---

#### “Nothing happens without your approval. Every action requires confirmation.”

Diagnóstico:
- defendible solo si se revisa la precisión

Por qué:
- la narrativa `human in the loop` sí parece parte central del producto
- pero “every action requires confirmation” es más absoluto que necesario

Riesgo:
- puede ser demasiado rígido si algunas acciones manuales o flujos tienen comportamiento distinto

Dirección:
- mantener el principio
- bajar la absolutización
- hablar de acciones sensibles o decisiones importantes, no de “every action” como fórmula total

---

#### “Nothing is deleted until you confirm. Review history anytime.”

Diagnóstico:
- parcialmente defendible

Por qué:
- la parte de historial es consistente con la existencia de `HistoryPage`
- la parte de eliminación con confirmación encaja con la intención conservadora del producto

Riesgo:
- la frase sigue poniendo demasiado peso narrativo en “delete” cuando el producto visible hace más que eso

Dirección:
- mantener la idea de confirmación humana
- evitar que el valor del producto quede reducido a “delete emails safely”

---

### Claims que deben corregirse

#### “We scan for newsletters, promotions, and old emails.”

Diagnóstico:
- incompleto

Por qué:
- describe solo la parte general del inbox
- no prepara al usuario para entender que existen flujos específicos con mayor detalle, como revisión de recibos

Riesgo:
- deja la sensación de producto más estrecho o más simple de lo que realmente ya es

Dirección:
- explicar que el producto ayuda a revisar y organizar correos
- dejar abierta la existencia de revisión más detallada en ciertos casos sin inflar la promesa principal

---

### Claims que deben retirarse

#### “We only read metadata. Your email content stays private.”

Diagnóstico:
- no defendible

Por qué:
- existe al menos un flujo visible donde el producto carga contenido completo de un correo específico
- el claim es absoluto y contradice la realidad operativa actual

Riesgo:
- erosiona confianza
- vuelve frágil cualquier narrativa de seguridad posterior

Dirección:
- retirar el claim absoluto
- reemplazarlo por una explicación más precisa sobre revisión general vs flujos específicos

---

## LoginPage

### Claims que pueden mantenerse

#### “Nothing is deleted without your confirmation”

Diagnóstico:
- defendible

Por qué:
- mantiene la narrativa correcta de control humano
- no promete una limitación falsa sobre lectura o procesamiento

Riesgo:
- queda algo estrecho si el producto quiere presentarse como algo más que un limpiador de eliminación

Dirección:
- mantener la idea de confirmación
- posiblemente ampliar el framing hacia acciones sensibles, no solo delete

---

#### “You can disconnect at any time”

Diagnóstico:
- defendible solo si la UI realmente ofrece esa salida con claridad

Por qué:
- conceptualmente es coherente con una promesa de control

Riesgo:
- si la experiencia visible no muestra bien cómo desconectar la cuenta, se vuelve claim débil

Dirección:
- mantenerlo solo si luego la experiencia lo soporta con claridad
- si no, moverlo a claim secundario y no principal

---

### Claims que deben corregirse

#### “We only read email metadata to suggest cleanup actions”

Diagnóstico:
- no defendible como claim general

Por qué:
- puede describir una parte del sistema, pero no la app visible completa
- el producto ya tiene rutas donde se accede a contenido completo en revisión especializada

Riesgo:
- crea una promesa demasiado estrecha y luego la rompe internamente

Dirección:
- reemplazar por una formulación que preserve control y revisión sin negar flujos de mayor detalle

---

#### “Scan your inbox for newsletters, promotions, and old emails”

Diagnóstico:
- demasiado estrecho

Por qué:
- deja fuera que el producto ya tiene lógica y superficies más especializadas

Riesgo:
- encuadra el producto como algo más limitado de lo que hoy ya es

Dirección:
- reformular hacia revisión guiada del inbox y acciones con contexto

---

### Claims que deben retirarse

#### “Read the content of your emails - only metadata”

Diagnóstico:
- no defendible

Por qué:
- contradice directamente la existencia del flujo de revisión de recibos
- el problema no es de matiz: el claim niega una capacidad visible

Riesgo:
- este es el claim más peligroso del set actual

Dirección:
- retirarlo por completo
- no intentar salvarlo con copy cosmético

---

## Claims reemplazables por dirección, no por copy final

Estas son direcciones válidas de reemplazo.
No son todavía redacción final.

### Dirección 1. Control humano

Útil para:
- HomePage
- LoginPage

Idea:
- la app ayuda a revisar antes de actuar
- las acciones sensibles no se ejecutan sin intervención del usuario

### Dirección 2. Revisión guiada, no automatización ciega

Útil para:
- HomePage
- LoginPage

Idea:
- el producto organiza, sugiere y da contexto
- el usuario sigue teniendo la decisión final en acciones importantes

### Dirección 3. Revisión general vs flujos específicos

Útil para:
- HomePage
- LoginPage

Idea:
- la experiencia general del inbox no debe describirse con la lógica de un caso especializado
- pero tampoco debe negar que ciertos flujos muestran más detalle cuando hace falta

---

## Resumen operativo

### Retirar

- `HomePage`: “We only read metadata. Your email content stays private.”
- `LoginPage`: “Read the content of your emails - only metadata”

### Corregir

- `LoginPage`: “We only read email metadata to suggest cleanup actions”
- `HomePage`: “We scan for newsletters, promotions, and old emails.”
- `HomePage`: “Nothing happens without your approval. Every action requires confirmation.”

### Mantener con ajuste menor

- `HomePage`: narrativa de control y seguridad
- `LoginPage`: “Nothing is deleted without your confirmation”
- `LoginPage`: “You can disconnect at any time”, solo si luego se sostiene en producto

---

## Próximo paso recomendado

Antes de escribir copy nuevo:

1. cerrar una versión corta de la narrativa base para onboarding
2. decidir si la propuesta principal seguirá siendo “clean inbox” o “revisión guiada de correos importantes”
3. recién después redactar reemplazos visibles para Home y Login
