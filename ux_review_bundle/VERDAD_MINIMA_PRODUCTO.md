# VERDAD_MINIMA_PRODUCTO.md

## Propósito

Este documento fija la verdad operativa mínima del producto para el trabajo de UX del bundle.

No es copy final.
No es documento legal.
No redefine la arquitectura completa.

Sirve para evitar que Home, Login, Settings y los flujos internos vuelvan a apoyarse en promesas absolutas o ambiguas.

---

## Decisión base

La aplicación no nació para borrar correos de forma automática ni para ejecutar limpieza agresiva sin intervención humana.

El alcance inicial fue:

- conectar una cuenta de correo
- leer/listar correos
- mostrar sugerencias o superficies de revisión
- mantener control humano antes de acciones sensibles

El problema actual no es esa decisión.
El problema actual es que parte del copy rellenó huecos con afirmaciones demasiado absolutas y ya no describe bien el comportamiento visible del producto.

---

## Qué hace realmente el producto hoy

El producto hoy opera en tres niveles distintos:

### 1. Acceso y sesión

- autentica al usuario con Google
- mantiene una sesión autenticada para operar dentro de la app

### 2. Revisión general del inbox

- lista y muestra correos en superficies de revisión
- presenta sugerencias de limpieza para revisión humana
- permite acciones manuales sobre correos desde el inbox
- mantiene historial visible de decisiones y acciones realizadas

### 3. Flujo especializado de recibos

- permite abrir un flujo puntual de revisión de recibo desde el inbox
- en ese flujo puede cargar contenido completo de un correo específico
- extrae datos visibles del recibo para revisión
- permite registrar estado manual del recibo
- prepara un envío manual por WhatsApp dentro de ese flujo

En términos operativos, la app hoy no es solo una landing con sugerencias.
Ya es un producto con:

- revisión guiada
- operación manual sobre correos
- trazabilidad visible
- un caso especializado de revisión de recibos

---

## Qué NO hace por defecto

Estas cosas no deben presentarse como comportamiento base del producto:

- no borra correos automáticamente sin intervención humana
- no debe venderse como automatización ciega del inbox
- no debe describirse como un sistema que ejecuta acciones destructivas silenciosas
- no debe prometer que todo el producto funciona solo con metadata si existen rutas que cargan contenido completo
- no debe comunicarse como un gestor integral de cuenta o credenciales propias si el acceso real depende de Google OAuth

La diferencia importante es esta:

- una cosa es el alcance original de “no borrar por defecto”
- otra cosa es prometer una restricción absoluta que ya no describe bien el producto visible

El producto puede seguir siendo conservador y con control humano sin apoyarse en frases falsas o demasiado rígidas.

---

## Qué ocurre solo en flujos específicos

Estas capacidades no deben comunicarse como comportamiento general de toda la app:

- cargar contenido completo de un email
- extraer datos específicos de un recibo
- revisar estado de un recibo
- preparar un mensaje manual por WhatsApp

Estas capacidades pertenecen a un flujo puntual de revisión, no al comportamiento general del producto.

La separación correcta es esta:

- revisión general del inbox:
  - listar correos
  - mostrar sugerencias
  - permitir revisión humana y acciones manuales

- revisión especializada:
  - abrir un caso específico
  - cargar más detalle
  - extraer información útil
  - ejecutar una acción puntual dentro de ese caso

Esto importa porque la promesa pública no debe describir toda la app desde la lógica de un solo claim simplificador.
Tampoco debe describir el flujo especializado como si fuera el modo normal de operación de todo el sistema.

---

## Verdad mínima defendible

La verdad mínima que sí puede sostener el producto es esta:

- la app ayuda a revisar y organizar correos con control humano
- las decisiones sensibles no deben ejecutarse sin intervención o aprobación del usuario
- la app puede analizar distintos niveles de información según el flujo
- el análisis general del inbox y la revisión puntual de un caso específico no son la misma cosa

Desarrollado en lenguaje operativo:

- el producto ayuda a revisar correos antes de decidir
- el producto no debe venderse como motor de eliminación automática
- el usuario sigue siendo parte explícita de las decisiones sensibles
- algunos flujos muestran más detalle porque la tarea lo requiere
- esos flujos específicos no autorizan a prometer menos de lo que el producto realmente hace

---

## Claims permitidos

Estos claims son defendibles como dirección base:

- “La app te ayuda a revisar y organizar tu correo con control humano.”
- “Las acciones sensibles no se ejecutan sin tu intervención o confirmación.”
- “Puedes revisar sugerencias antes de decidir.”
- “Algunos flujos especializados muestran más detalle cuando tú entras a revisarlos.”
- “El producto prioriza revisión guiada y trazabilidad, no automatización ciega.”

Claims equivalentes que también serían defendibles:

- “La app te ayuda a revisar tu inbox antes de tomar acciones sensibles.”
- “No automatizamos decisiones delicadas a espaldas del usuario.”
- “La experiencia combina revisión general y flujos puntuales de más detalle cuando hace falta.”
- “El producto está diseñado para dar contexto y control, no para borrar por defecto.”

Todos estos claims comparten la misma regla:

- prometen control
- no prometen invisibilidad total del contenido
- no prometen una automatización que la app no sostiene
- no prometen una limitación falsa solo para sonar más segura

---

## Claims prohibidos por ahora

Estos claims no deben reutilizarse mientras el producto visible siga comportándose como hoy:

- “Solo leemos metadata.”
- “Nunca leemos el contenido de tus correos.”
- “Tu contenido siempre permanece fuera del producto.”
- cualquier variante absoluta que niegue lectura de contenido si existe un flujo puntual que sí lo carga

Tampoco debe prometerse:

- gestión de credenciales propias si el acceso real depende de Google OAuth
- configuraciones que la UI muestra pero el producto todavía no sostiene con claridad

---

## Consecuencia para UX

Antes de rediseñar pantallas, el trabajo de UX debe respetar esta separación:

1. comportamiento general del producto
2. revisión guiada con aprobación humana
3. flujos especializados que muestran más detalle o ejecutan acciones puntuales

Si esa separación no se refleja en la experiencia, volverán a aparecer:

- promesas ambiguas
- confusión sobre qué hace el sistema
- expectativas incorrectas en permisos, settings y revisión de correos

---

## Próximo uso de este documento

Este documento debe usarse como base para:

- revisar claims de `HomePage`
- revisar claims de `LoginPage`
- replantear el alcance real de `SettingsPage`
- decidir cómo se explica `ReceiptReviewDialog` sin contaminar la narrativa general del producto

No debe usarse todavía para redactar copy final sin antes validar la siguiente decisión:

- qué parte de esta verdad mínima será central en la propuesta de valor
- y qué parte debe quedar como comportamiento específico de ciertos flujos
