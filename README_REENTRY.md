# 📄 README_REENTRY.md — Frontend React

*(Email Cleaner & Smart Notifications — React App)*

**Last updated:** 2025-11-20
**Branch:** `main`
**Scope:** Solo frontend React (Vite + Tailwind).
**Backend:** vive en repositorio separado.

---

# 1. Current Position (Where you left off)

* La app React **compila y corre** con `npm run dev`.

* Existen **dos vistas funcionales**:

  * `SuggestionsList` (carga /summary → muestra sugerencias → permite aceptar/rechazar)
  * `HistoryList` (carga /history → muestra registros → permite repetir acciones)

* La navegación está controlada desde `App.jsx` con `activeView` (`suggestions | history`).

* `Navigation.jsx` **existe**, pero **no está cableado** a `App.jsx`.

* `API_BASE` sigue **hard-coded** en `src/services/api.js`.

* **No hay tests** en este repositorio.

---

# 2. Active View / Active HU

**HU7 — Externalizar API_BASE a variables de entorno de Vite**
(Esta HU fue creada para continuar el flujo y es la siguiente en ejecución.)

---

# 3. How to Resume Work (First command + first place to look)

### 3.1 Levantar backend y frontend

Backend Fastify (en su repo):

```
npm run dev
```

Frontend React:

```
npm install
npm run dev
```

Asegúrate que el backend está en **[http://localhost:3000](http://localhost:3000)** o ajusta API_BASE al nuevo puerto.

---

# 4. What to Do Next (Single Next Action)

➡️ **Reemplazar API_BASE hard-coded en `src/services/api.js` por `import.meta.env.VITE_API_BASE` y crear `.env` con Vite.**

Este paso habilita:

* Deploys futuros
* Configuración por ambiente
* Evitar drift entre frontend y backend

---

# 5. Files you must open right now

Abrir estos archivos EXACTAMENTE en este orden:

1. `src/services/api.js`
   Para reemplazar el hard-coded API_BASE.

2. `.env.example` (crear si no existe)
   Para definir `VITE_API_BASE=http://localhost:3000/api/v1`.

3. `vite.config.js`
   Verificar si se necesita exponer variables (por ahora no).

4. `src/App.jsx`
   Para confirmar que navigation y vistas funcionan tras el cambio.

---

# 6. Known Risks (Frontend only)

* API_BASE hard-coded (corregido al ejecutar HU7).
* Navigation.jsx está sin wiring.
* No existe paginación real en HistoryList (usa siempre page=1).
* No existe retry/backoff ni manejo global de errores.
* No hay tests unitarios o de integración.

---

# 7. Environment requirements

* Node.js 20+
* npm 10+
* Vite (incluido como dev dependency)
* Backend Fastify corriendo en el host local

---

# 8. Useful commands

### Development

```
npm run dev
```

### Build

```
npm run build
```

### Preview build

```
npm run preview
```

---

# 9. Notes

* Este archivo no describe User Stories ni el estado técnico; eso está en `PROJECT_STATE.md`.
* No contiene backlog, roadmap ni sprint details.
* Solo sirve para reingresar al proyecto sin confusión.

