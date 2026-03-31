const BACKEND_URL = 'https://interior-backend-production.up.railway.app';

export const getSessionId = () => {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const setTrackingStartTime = () => {
  if (!sessionStorage.getItem('tracking_start_time')) {
    sessionStorage.setItem('tracking_start_time', Date.now().toString());
  }
};

export const getTimeSpentSeconds = () => {
  const startTime = sessionStorage.getItem('tracking_start_time');
  if (!startTime) return 0;
  return Math.floor((Date.now() - parseInt(startTime)) / 1000);
};

export const getUserId = () => localStorage.getItem('userId') || null;
export const getClientName = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('client') || 'skyline';
};

export const logToolUsage = async (toolName) => {
  try {
    const timeSpent = getTimeSpentSeconds();
    if (timeSpent === 0) return;
    
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
    console.log(`[Tracker] Logged ${toolName} — ${timeSpent}s`);
  } catch (err) {
    console.warn('[Tracker] logToolUsage failed:', err);
  }
};

export const logVirtualTourSelection = async (category, placeName, placeId) => {
  try {
    const body = {
      session_id: getSessionId(),
      client_name: getClientName(),
      tool_name: 'virtual_tour',
      vt_category: category,
      vt_place_name: placeName || '',
      vt_place_id: placeId || '',
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

export const logLifeEchoSelection = async ({ isCustom, scenarioId = null, scenarioTitle = '', customText = '' }) => {
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