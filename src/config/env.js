// Centralized environment configuration.
//
// Every value here falls back to the exact same production value that was
// previously hardcoded in 6 different files (api.jsx, App.jsx, VirtualTour.jsx,
// RegistrationModal.jsx, LifeEcho.jsx, activityTracker.js), so behavior is
// unchanged even if the corresponding VITE_* variable isn't set in .env.
// Once these are set in .env, they take priority automatically.

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://interior-backend-production.up.railway.app";

export const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  "AIzaSyAfDoI98BjfukXxFsnXB8qQJPK_0Bi7ntI";
