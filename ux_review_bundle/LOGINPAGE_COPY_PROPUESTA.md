<!-- markdownlint-disable MD036 -->

# LOGINPAGE_COPY_PROPUESTA.md

## Propósito

Este documento propone un reemplazo completo de copy para `LoginPage`.

No modifica todavía el código.
No es copy legal final.

Su función es traducir la narrativa general de onboarding a una pantalla más precisa y operativa, sin claims absolutos ni promesas que el producto visible no sostiene.

---

## Objetivo de LoginPage

`LoginPage` debe lograr estas tres cosas:

1. bajar ansiedad antes de conectar la cuenta
2. explicar de forma simple qué tipo de ayuda ofrece la app
3. dejar claro que las decisiones sensibles siguen bajo control del usuario

No debe:

- repetir toda la narrativa de `HomePage`
- prometer “solo metadata”
- negar lectura de contenido si existen flujos específicos que sí muestran más detalle
- sugerir capacidades de cuenta que luego no se sostienen en el producto

---

## Dirección de tono

El tono recomendado para `LoginPage` es:

- preciso
- sobrio
- confiable
- menos aspiracional que `HomePage`

`LoginPage` no debe vender demasiado.
Debe explicar lo suficiente para que conectar la cuenta se sienta entendible y defendible.

---

## Qué debe comunicar esta pantalla

La pantalla debe transmitir estas ideas:

- la app te ayuda a revisar correos antes de actuar
- las acciones sensibles no se ejecutan sin tu intervención
- algunos flujos muestran más detalle cuando hace falta
- sigues teniendo control sobre tu cuenta y tu sesión

---

## Propuesta de copy por bloque

### 1. Encabezado

#### Título

**Connect your inbox with more clarity and control**

#### Subtítulo

**Email Cleaner helps you review emails, understand what needs attention, and stay in control of sensitive actions.**

---

### 2. Bloque principal de confianza

#### Punto 1

**Review before acting**  
The app helps you inspect suggestions and email context before you make a decision.

#### Punto 2

**You stay in control**  
Sensitive actions are not executed without your intervention or confirmation.

#### Punto 3

**More detail only when needed**  
Some flows show additional detail when you open a specific case for review.

---

## Por qué este bloque mejora el actual

- elimina la promesa falsa de “only metadata”
- mantiene la idea correcta de control humano
- no esconde que existen flujos con más detalle
- suena más preciso y menos frágil

---

### 3. CTA principal

**Continue with Google**

#### Estado de carga

**Securing your connection...**

---

### 4. Bloque desplegable “How it works”

#### Título del trigger

**How it works**

#### Subbloque 1

**What the app helps you do**

- Review your inbox inside a guided workspace
- See suggestions and email context before acting
- Keep track of important decisions and outcomes

#### Subbloque 2

**What stays under your control**

- Sensitive actions are not executed without your intervention
- You can review before deciding
- You can end your session or disconnect your account

---

## Por qué este bloque mejora el actual

- reemplaza “What we never do” como lista demasiado absoluta
- evita convertir la seguridad en una promesa falsa
- explica mejor el producto como revisión guiada con control humano

---

## Versión corrida de LoginPage

### Encabezado

**Connect your inbox with more clarity and control**  
Email Cleaner helps you review emails, understand what needs attention, and stay in control of sensitive actions.

### Bloque de confianza

**Review before acting**  
The app helps you inspect suggestions and email context before you make a decision.

**You stay in control**  
Sensitive actions are not executed without your intervention or confirmation.

**More detail only when needed**  
Some flows show additional detail when you open a specific case for review.

### CTA

**Continue with Google**

### Collapsible

**How it works**

**What the app helps you do**

- Review your inbox inside a guided workspace
- See suggestions and email context before acting
- Keep track of important decisions and outcomes

**What stays under your control**

- Sensitive actions are not executed without your intervention
- You can review before deciding
- You can end your session or disconnect your account

---

## Claims eliminados explícitamente

Este reemplazo elimina de `LoginPage`:

- “We only read email metadata to suggest cleanup actions”
- “Read the content of your emails - only metadata”
- el framing demasiado estrecho de newsletters/promotions/old emails como definición del producto

No porque la app deba sonar menos segura, sino porque esos claims:

- ya no describen bien el producto visible
- son demasiado absolutos
- vuelven frágil la confianza cuando aparece un flujo con más detalle

---

## Claims que se conservan en forma corregida

Se conserva la dirección de estos claims:

- control humano
- intervención del usuario antes de acciones sensibles
- posibilidad de desconectar la cuenta

Pero se corrigen para:

- sonar menos absolutos
- ser más compatibles con el producto real
- no reducir todo el valor a “delete emails”

---

## Diferencia recomendada entre Home y Login

### Home

Debe vender:

- propuesta de valor
- confianza general
- dirección del producto

### Login

Debe explicar:

- qué tipo de revisión ofrece la app
- qué control conserva el usuario
- por qué conectar la cuenta no implica perder control

`LoginPage` debe ser más concreta que `HomePage`, no una repetición con otras palabras.

---

## Criterio para validar esta propuesta

La propuesta es válida si cumple esto:

1. reduce ansiedad sin usar claims falsos
2. mantiene claridad en menos de 10 segundos
3. alinea mejor el login con el producto visible
4. no vuelve a caer en “only metadata” como atajo narrativo

---

## Próximo paso

Si esta dirección se aprueba, el siguiente paso correcto es comparar:

- `HomePage` propuesta
- `LoginPage` propuesta

Y decidir si ambas superficies siguen teniendo roles distintos o si todavía duplican fricción en onboarding.
