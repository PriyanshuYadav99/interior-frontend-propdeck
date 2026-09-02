# PropDeck — Property AI Frontend

React + Vite frontend for the interior design / property exploration app
(room design generation, "Living insight" scenarios, and "Explore nearby"
virtual tour), backed by the Railway API.

## Getting started

```bash
npm install
npm run dev      # local dev server, http://localhost:5173
npm run build    # production build -> dist/
npm run lint     # eslint over src/
```

## Environment variables

Copy `.env` and adjust as needed:

```
VITE_API_URL=https://interior-backend-production.up.railway.app
VITE_GOOGLE_MAPS_API_KEY=your_key_here   # optional, see src/config/env.js
```

Both fall back to safe production defaults in `src/config/env.js` if unset.

## Project structure

```
src/
  main.jsx                 Entry point — router setup only
  index.css                Global styles + Tailwind directives

  pages/                   Route-level components
    HomePage.jsx              "/" — the main app (room design, nav tabs)
    HomePage.css
    VerifyPage.jsx            "/verify" — email verification landing page

  components/
    modals/                  Reusable modal dialogs
      RegistrationModal.jsx     Free-attempt-limit registration gate
      FeaturesModal.jsx         (currently unused — not imported anywhere)

  features/                 Larger, self-contained feature panels
    life-echo/
      LifeEcho.jsx             "Living insight" scenario explorer
    virtual-tour/
      VirtualTour.jsx          "Explore nearby" map / street view panel

  services/
    api.js                   All backend HTTP calls (design gen, session, etc.)

  utils/
    activityTracker.js       Session id, per-tool usage timers, event logging

  constants/
    designOptions.js         Static room / style / flat-type / nav-tab data

  config/
    env.js                   Centralized API base URL + Maps API key
```

### Why this shape

- **`pages/`** holds only what's routed to directly in `main.jsx`.
- **`features/`** holds the two big interactive panels that used to be flat
  files at the project root — each is self-contained and only reachable
  from `HomePage`.
- **`components/modals/`** is for small reusable UI, separate from full-page
  or full-feature components.
- **`services/api.js`** is the only place that should know backend endpoint
  shapes; UI components call functions from here rather than `fetch`-ing
  directly (a few feature files still fetch directly for endpoints not yet
  wrapped in `api.js` — worth migrating over time, left as-is for now to
  avoid changing behavior in this pass).
- **`config/env.js`** is the single source of truth for the backend URL and
  Maps key — previously hardcoded independently in 6 different files.

## Known pre-existing issues (not touched in the restructure)

Flagging these so they're not mistaken for something the reorg broke —
they were present in the original code and have been left exactly as-is to
avoid changing any behavior:

- `VerifyPage.jsx` calls `http://localhost:5000/api/verify-email`, not the
  production Railway URL used everywhere else — email verification likely
  doesn't work in production as a result.
- `FeaturesModal.jsx` is not imported or rendered anywhere in the app.
- A handful of unused state variables / destructured props and a few
  `useEffect` missing-dependency warnings show up under `npm run lint` —
  none are new, all pre-date this reorg.
