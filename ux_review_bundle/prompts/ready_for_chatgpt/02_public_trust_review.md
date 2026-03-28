Actúa como un/a **Product Manager senior** con criterio fuerte de producto.

Voy a compartirte screenshots de una pantalla.
Quiero que la revises no sólo como interfaz, sino como instrumento para lograr una meta real del usuario y del negocio.

No quiero feedback estético.
Quiero saber si esta pantalla ayuda o estorba al objetivo.

## Contexto

* Producto: app web para limpiar y revisar un inbox de Gmail con ayuda guiada, manteniendo control humano sobre las decisiones importantes.
* Usuario objetivo: personas interesadas en reducir ruido en su correo sin sentir que una automatización opaca tomará decisiones por ellas.
* Objetivo de esta pantalla: explicar honestamente qué hace el producto, generar confianza antes del login y preparar a la persona para autenticarse con Google.
* Momento del flujo: etapa pública de descubrimiento y acceso, antes de entrar al producto autenticado.
* Restricciones: esta revisión debe juzgar verdad de producto, framing de confianza y claridad previa a OAuth; no asumas promesas absolutas de privacidad o automatización que no estén sustentadas por el flujo interno.

Antes de responder, distingue explícitamente entre:

1. problemas de arquitectura de decisión
2. problemas de UI/copy/jerarquía visual
3. problemas de verdad de producto o alcance

No mezcles esos tres niveles en un único juicio superficial.

## Screenshots incluidas

- `01-home-current.png`
- `02-login-current.png`

## Analiza

1. Qué objetivo de producto parece perseguir esta pantalla
2. Si la información mostrada alcanza para que una persona entienda honestamente la propuesta
3. Qué falta para cumplir el objetivo
4. Qué puede afectar comprensión, conversión, confianza o completitud del flujo
5. Qué decisiones de producto parecen débiles o insuficientemente justificadas

## Para cada problema

* qué observas
* por qué eso compromete el objetivo del producto
* impacto en usuario o negocio
* severidad: alta / media / baja
* cómo lo corregirías

## Reglas

* Sé crítico.
* No valides la solución actual por defecto.
* Si algo no puede validarse sólo con screenshots, dilo.
* Separa:
  * hechos visibles
  * inferencias
  * riesgos
  * recomendaciones

## Preguntas adicionales obligatorias

1. ¿La promesa pública coincide con lo que este tipo de producto realmente parece hacer?
2. ¿Qué frases o decisiones visuales podrían inflar expectativas o erosionar confianza?
3. ¿Qué cambiarías primero para que el acceso se sienta honesto y confiable?

## Salida

1. Resumen ejecutivo
2. Qué funciona bien
3. Problemas detectados
4. Riesgos principales
5. Cambios prioritarios
6. Qué no puede validarse sólo con screenshots
