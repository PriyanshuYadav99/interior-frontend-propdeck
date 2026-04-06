// const BACKEND_URL = 'https://interior-backend-production.up.railway.app';

// export const getSessionId = () => {
//   let sessionId = sessionStorage.getItem('sessionId');
//   if (!sessionId) {
//     sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//     sessionStorage.setItem('sessionId', sessionId);
//   }
//   return sessionId;
// };

// export const setTrackingStartTime = () => {
//   if (!sessionStorage.getItem('tracking_start_time')) {
//     sessionStorage.setItem('tracking_start_time', Date.now().toString());
//   }
// };

// export const getTimeSpentSeconds = () => {
//   const startTime = sessionStorage.getItem('tracking_start_time');
//   if (!startTime) return 0;
//   return Math.floor((Date.now() - parseInt(startTime)) / 1000);
// };

// export const getUserId = () => localStorage.getItem('userId') || null;
// export const getClientName = () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   return urlParams.get('client') || 'skyline';
// };

// export const logToolUsage = async (toolName) => {
//   try {
//     const timeSpent = getTimeSpentSeconds();
//     if (timeSpent === 0) return;
    
//     const body = {
//       session_id: getSessionId(),
//       client_name: getClientName(),
//       tool_name: toolName,
//       time_spent_seconds: timeSpent,
//     };
//     const userId = getUserId();
//     if (userId) body.user_id = userId;
//     await fetch(`${BACKEND_URL}/api/activity/log`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//     });
//     console.log(`[Tracker] Logged ${toolName} — ${timeSpent}s`);
//   } catch (err) {
//     console.warn('[Tracker] logToolUsage failed:', err);
//   }
// };

// export const logVirtualTourSelection = async (category, placeName, placeId, photoUrl, distance, rating) => {
//   // ✅ Skip if no real place selected
//   if (!placeId) {
//     console.warn('[Tracker] Skipping VT log — no placeId');
//     return;
//   }

//   try {
//     const body = {
//       session_id: getSessionId(),
//       client_name: getClientName(),
//       tool_name: 'virtual_tour',
//       vt_category: category,
//       vt_place_name: placeName || null,   // ✅ null not ''
//       vt_place_id: placeId || null,
//       vt_photo_url: photoUrl || null,
//       vt_distance: distance || null,
//       vt_rating: rating || null,
//     };
//     const userId = getUserId();
//     if (userId) body.user_id = userId;
//     await fetch(`${BACKEND_URL}/api/activity/selection`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//     });
//     console.log(`[Tracker] VT selection — ${category} → ${placeName}`);
//   } catch (err) {
//     console.warn('[Tracker] logVirtualTourSelection failed:', err);
//   }
// };

// export const logLifeEchoSelection = async ({ isCustom, scenarioId = null, scenarioTitle = '', scenarioIcon = 'clock', customText = '' }) => {
//   try {
//     const body = {
//       session_id: getSessionId(),
//       client_name: getClientName(),
//       tool_name: 'lifeecho',
//       lifeecho_is_custom: isCustom,
//     };
//     if (isCustom) {
//       body.lifeecho_custom_text = customText;
//     } else {
//       body.lifeecho_scenario_id = scenarioId;
//       body.lifeecho_scenario_title = scenarioTitle;
//       body.lifeecho_scenario_icon = scenarioIcon;
//     }
//     const userId = getUserId();
//     if (userId) body.user_id = userId;
//     await fetch(`${BACKEND_URL}/api/activity/selection`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//     });
//     console.log(`[Tracker] LifeEcho — custom=${isCustom} id=${scenarioId}`);
//   } catch (err) {
//     console.warn('[Tracker] logLifeEchoSelection failed:', err);
//   }
// };
const BACKEND_URL = 'https://interior-backend-production.up.railway.app';

// ─── Session ────────────────────────────────────────────────
export const getSessionId = () => {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const getUserId = () => localStorage.getItem('userId') || null;
export const getClientName = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('client') || 'skyline';
};

// ─── Per-tool cursor timer ───────────────────────────────────
// Stores { startTime, totalSeconds } per tool
const toolTimers = {};

export const startToolTimer = (toolName) => {
  if (!toolTimers[toolName]) {
    toolTimers[toolName] = { startTime: null, totalSeconds: 0 };
  }
  // Only start if not already running
  if (!toolTimers[toolName].startTime) {
    toolTimers[toolName].startTime = Date.now();
    console.log(`[Tracker] ▶ Timer started — ${toolName}`);
  }
};

export const pauseToolTimer = (toolName) => {
  if (!toolTimers[toolName] || !toolTimers[toolName].startTime) return;
  const elapsed = Math.floor((Date.now() - toolTimers[toolName].startTime) / 1000);
  toolTimers[toolName].totalSeconds += elapsed;
  toolTimers[toolName].startTime = null;
  console.log(`[Tracker] ⏸ Timer paused — ${toolName} (+${elapsed}s, total=${toolTimers[toolName].totalSeconds}s)`);
};

export const getToolTimeSeconds = (toolName) => {
  if (!toolTimers[toolName]) return 0;
  let total = toolTimers[toolName].totalSeconds;
  // Add current running session if timer is active
  if (toolTimers[toolName].startTime) {
    total += Math.floor((Date.now() - toolTimers[toolName].startTime) / 1000);
  }
  return total;
};

export const resetToolTimer = (toolName) => {
  toolTimers[toolName] = { startTime: null, totalSeconds: 0 };
};

// ─── Log tool usage ──────────────────────────────────────────
export const logToolUsage = async (toolName) => {
  try {
    // Pause timer first to capture final time
    pauseToolTimer(toolName);
    const timeSpent = getToolTimeSeconds(toolName);

    if (timeSpent === 0) {
      console.warn(`[Tracker] Skipping log — 0 seconds for ${toolName}`);
      return;
    }

    const body = {
      session_id: getSessionId(),
      client_name: getClientName(),
      tool_name: toolName,
      time_spent_seconds: timeSpent,
    };
    const userId = getUserId();
    if (userId) body.user_id = userId;

    await fetch(`${BACKEND_URL}/api/activity/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log(`[Tracker] ✅ Logged ${toolName} — ${timeSpent}s`);

    // Reset after logging
    resetToolTimer(toolName);

  } catch (err) {
    console.warn('[Tracker] logToolUsage failed:', err);
  }
};

// ─── Virtual Tour selection ──────────────────────────────────
export const logVirtualTourSelection = async (category, placeName, placeId, photoUrl, distance, rating) => {
  if (!placeId) {
    console.warn('[Tracker] Skipping VT log — no placeId');
    return;
  }
  try {
    const body = {
      session_id: getSessionId(),
      client_name: getClientName(),
      tool_name: 'virtual_tour',
      vt_category: category,
      vt_place_name: placeName || null,
      vt_place_id: placeId || null,
      vt_photo_url: photoUrl || null,
      vt_distance: distance || null,
      vt_rating: rating || null,
    };
    const userId = getUserId();
    if (userId) body.user_id = userId;
    await fetch(`${BACKEND_URL}/api/activity/selection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    console.log(`[Tracker] VT selection — ${category} → ${placeName}`);
  } catch (err) {
    console.warn('[Tracker] logVirtualTourSelection failed:', err);
  }
};

// ─── LifeEcho selection ──────────────────────────────────────
export const logLifeEchoSelection = async ({ isCustom, scenarioId = null, scenarioTitle = '', scenarioIcon = 'clock', customText = '' }) => {
  try {
    const body = {
      session_id: getSessionId(),
      client_name: getClientName(),
      tool_name: 'lifeecho',
      lifeecho_is_custom: isCustom,
    };
    if (isCustom) {
      body.lifeecho_custom_text = customText;
    } else {
      body.lifeecho_scenario_id = scenarioId;
      body.lifeecho_scenario_title = scenarioTitle;
      body.lifeecho_scenario_icon = scenarioIcon;
    }
    const userId = getUserId();
    if (userId) body.user_id = userId;
    await fetch(`${BACKEND_URL}/api/activity/selection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    console.log(`[Tracker] LifeEcho — custom=${isCustom} id=${scenarioId}`);
  } catch (err) {
    console.warn('[Tracker] logLifeEchoSelection failed:', err);
  }
};

// ─── Visibility Tracker (Intersection Observer) ──────────────
export const createVisibilityTracker = (toolName, elementRef) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startToolTimer(toolName);
          console.log(`[Tracker] 👁 Visible — ${toolName}`);
        } else {
          pauseToolTimer(toolName);
          console.log(`[Tracker] 🙈 Hidden — ${toolName}`);
        }
      });
    },
    { threshold: 0.3 }
  );
  if (elementRef.current) {
    observer.observe(elementRef.current);
  }
  return observer;
};