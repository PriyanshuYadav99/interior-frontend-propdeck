
// import axios from 'axios';

// // ✅ Railway URL
// const API_BASE_URL = 'http://127.0.0.1:5000';

// console.log('[API] Base URL:', API_BASE_URL);

// // Create axios instance with default config
// const api = axios.create({
//   baseURL: `${API_BASE_URL}/api`,
//   timeout: 180000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // ============================================
// // MAIN GENERATION FUNCTION (✅ UPDATED WITH 1024x1024)
// // ============================================
// export const generateDesign = async (roomType, style, customPrompt, clientName = 'skyline', model = 'imagen3') => {
//   console.log('[API] generateDesign called with:', { roomType, style, customPrompt, clientName, model });
//   console.log('[API] Fetching from:', `${API_BASE_URL}/api/generate-design`);
  
//   const response = await fetch(`${API_BASE_URL}/api/generate-design`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       room_type: roomType,
//       style: style,
//       custom_prompt: customPrompt,
//       client_name: clientName,
//       model: model,
//       width: 1024,   // ✅ CHANGE 3: Force 1024x1024 resolution
//       height: 1024   // ✅ CHANGE 3: Force 1024x1024 resolution
//     }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     console.error('[API] Generation failed:', errorData);
//     throw new Error(errorData.error || 'Generation failed');
//   }

//   const result = await response.json();
//   console.log('[API] Generation response:', result);
//   return result;
// };

// // ============================================
// // ✅ ASYNC GENERATION FUNCTIONS (For faster response)
// // ============================================

// // Start async generation - returns job_id immediately
// export const generateDesignAsync = async (roomType, style, customPrompt, clientName = 'skyline', model = 'imagen3') => {
//   console.log('[API] generateDesignAsync called with:', { roomType, style, customPrompt, clientName, model });
//   console.log('[API] Fetching from:', `${API_BASE_URL}/api/generate-design`);
  
//   const response = await fetch(`${API_BASE_URL}/api/generate-design`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       room_type: roomType,
//       style: style,
//       custom_prompt: customPrompt,
//       client_name: clientName,
//       model: model,
//       width: 1024,   // ✅ CHANGE 3: Force 1024x1024 resolution
//       height: 1024   // ✅ CHANGE 3: Force 1024x1024 resolution
//     }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     console.error('[API] Async generation failed:', errorData);
//     throw new Error(errorData.error || 'Failed to start generation');
//   }

//   const result = await response.json();
//   console.log('[API] Async generation started:', result);
//   return result;
// };

// // Check job status - poll this to get progress
// export const checkJobStatus = async (jobId) => {
//   console.log('[API] checkJobStatus called with jobId:', jobId);
//   console.log('[API] Fetching from:', `${API_BASE_URL}/api/check-job/${jobId}`);
  
//   const response = await fetch(`${API_BASE_URL}/api/check-job/${jobId}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     console.error('[API] Check job failed:', errorData);
//     throw new Error(errorData.error || 'Failed to check job status');
//   }

//   const result = await response.json();
//   console.log('[API] Job status:', result);
//   return result;
// };

// // ============================================
// // SESSION & REGISTRATION FUNCTIONS
// // ============================================

// export const checkSession = async (sessionId) => {
//   console.log('[API] checkSession called with:', sessionId);
//   console.log('[API] Fetching from:', `${API_BASE_URL}/api/check-session`);
  
//   const response = await fetch(`${API_BASE_URL}/api/check-session`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ session_id: sessionId }),
//   });

//   if (!response.ok) {
//     console.error('[API] Check session failed:', response.status);
//     throw new Error('Failed to check session');
//   }

//   const result = await response.json();
//   console.log('[API] Check session response:', result);
//   return result;
// };

// export const incrementGeneration = async (sessionId, roomType, style, customPrompt, clientName = 'skyline') => {
//   console.log('[API] incrementGeneration called');
//   console.log('[API] Fetching from:', `${API_BASE_URL}/api/increment-generation`);
  
//   const response = await fetch(`${API_BASE_URL}/api/increment-generation`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       session_id: sessionId,
//       room_type: roomType,
//       style: style,
//       custom_prompt: customPrompt,
//       client_name: clientName
//     }),
//   });

//   if (!response.ok) {
//     console.error('[API] Increment generation failed:', response.status);
//     throw new Error('Failed to increment generation count');
//   }

//   const result = await response.json();
//   console.log('[API] Increment generation response:', result);
//   return result;
// };

// // ============================================
// // OTHER FUNCTIONS
// // ============================================

// export const getRooms = async () => {
//   try {
//     console.log('[API] getRooms called');
//     const response = await api.get('/rooms');
//     return response.data;
//   } catch (error) {
//     console.error('[API] getRooms error:', error);
//     throw error;
//   }
// };

// export const getStyles = async () => {
//   try {
//     console.log('[API] getStyles called');
//     const response = await api.get('/styles');
//     return response.data;
//   } catch (error) {
//     console.error('[API] getStyles error:', error);
//     throw error;
//   }
// };

// export const checkHealth = async () => {
//   try {
//     console.log('[API] checkHealth called');
//     console.log('[API] Calling:', `${API_BASE_URL}/api/health`);
//     const response = await api.get('/health');
//     console.log('[API] Health response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('[API] Health check failed:', error);
//     return { status: 'unhealthy' };
//   }
// };
// export const generateScenario = async (scenarioText, clientName = 'skyline') => {
//   console.log('[API] generateScenario called with:', { scenarioText, clientName });
//   console.log('[API] Fetching from:', `${API_BASE_URL}/api/scenario/generate`);
  
//   const response = await fetch(`${API_BASE_URL}/api/scenario/generate`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       scenario_text: scenarioText,
//       client_name: clientName
//     }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     console.error('[API] Scenario generation failed:', errorData);
//     throw new Error(errorData.error || 'Scenario generation failed');
//   }

//   const result = await response.json();
//   console.log('[API] Scenario generation response:', result);
//   return result;
// };
// // Add this to your api.jsx file

// export const getRandomScenarios = async () => {
//   console.log('[API] getRandomScenarios called');
//   console.log('[API] Fetching from:', `${API_BASE_URL}/api/scenario/random`);
  
//   const response = await fetch(`${API_BASE_URL}/api/scenario/random`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     console.error('[API] Failed to fetch random scenarios:', response.status);
//     throw new Error('Failed to fetch random scenarios');
//   }

//   const result = await response.json();
//   console.log('[API] Random scenarios response:', result);
//   return result;
// };

// export const getPreGeneratedScenarios = async () => {
//   console.log('[API] getPreGeneratedScenarios called');
//   console.log('[API] Fetching from:', `${API_BASE_URL}/api/scenario/pre-generated`);
  
//   const response = await fetch(`${API_BASE_URL}/api/scenario/pre-generated`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     console.error('[API] Failed to fetch scenarios:', response.status);
//     throw new Error('Failed to fetch pre-generated scenarios');
//   }

//   const result = await response.json();
//   console.log('[API] Pre-generated scenarios response:', result);
//   return result;
// };

// export default api;
import axios from 'axios';

// ✅ Base URL - Use environment variable or fallback
const API_BASE_URL = 'https://interior-backend-production.up.railway.app';
console.log('[API] Base URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 180000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// DESIGN GENERATION FUNCTIONS
// ============================================

export const generateDesign = async (roomType, style, customPrompt, clientName = 'skyline', model = 'imagen3') => {
  console.log('[API] generateDesign called with:', { roomType, style, customPrompt, clientName, model });
  
  const response = await fetch(`${API_BASE_URL}/api/generate-design`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      room_type: roomType,
      style: style,
      custom_prompt: customPrompt,
      client_name: clientName,
      model: model,
      width: 1024,
      height: 1024
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[API] Generation failed:', errorData);
    throw new Error(errorData.error || 'Generation failed');
  }

  return await response.json();
};

export const generateDesignAsync = async (roomType, style, customPrompt, clientName = 'skyline', model = 'imagen3') => {
  const response = await fetch(`${API_BASE_URL}/api/generate-design`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      room_type: roomType,
      style: style,
      custom_prompt: customPrompt,
      client_name: clientName,
      model: model,
      width: 1024,
      height: 1024
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to start generation');
  }

  return await response.json();
};

export const checkJobStatus = async (jobId) => {
  const response = await fetch(`${API_BASE_URL}/api/check-job/${jobId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to check job status');
  }

  return await response.json();
};

// ============================================
// SESSION & REGISTRATION FUNCTIONS
// ============================================

export const checkSession = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/api/check-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ session_id: sessionId }),
  });

  if (!response.ok) {
    throw new Error('Failed to check session');
  }

  return await response.json();
};

export const incrementGeneration = async (sessionId, roomType, style, customPrompt, clientName = 'skyline') => {
  const response = await fetch(`${API_BASE_URL}/api/increment-generation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      room_type: roomType,
      style: style,
      custom_prompt: customPrompt,
      client_name: clientName
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to increment generation count');
  }

  return await response.json();
};

// ============================================
// SCENARIO GENERATION FUNCTIONS
// ============================================

export const generateScenario = async (scenarioText, clientName = 'skyline') => {
  console.log('[API] generateScenario called');
  
  const response = await fetch(`${API_BASE_URL}/api/scenario/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      scenario_text: scenarioText,
      client_name: clientName
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Scenario generation failed');
  }

  return await response.json();
};

export const getRandomScenarios = async () => {
  const response = await fetch(`${API_BASE_URL}/api/scenario/random`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch random scenarios');
  }

  return await response.json();
};

export const getPreGeneratedScenarios = async () => {
  const response = await fetch(`${API_BASE_URL}/api/scenario/pre-generated`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pre-generated scenarios');
  }

  return await response.json();
};

// ============================================
// ✅ VIRTUAL TOUR FUNCTIONS (NEW)
// ============================================

/**
 * Search for nearby places based on location and category
 * @param {string} location - Address or "lat,lng"
 * @param {string} category - Category type (dining, education, etc.)
 * @param {number} radius - Search radius in meters (default: 10000)
 * @returns {Promise<Object>} - Search results with places array
 */
export const searchVirtualTour = async (location, category = 'dining', radius = 10000) => {
  console.log('[API] searchVirtualTour called with:', { location, category, radius });
  
  const response = await fetch(`${API_BASE_URL}/api/virtual-tour/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      location,
      category,
      radius
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[API] Virtual tour search failed:', errorData);
    throw new Error(errorData.error || 'Failed to search places');
  }

  const result = await response.json();
  console.log('[API] Virtual tour search result:', result);
  return result;
};

/**
 * Get directions between two points
 * @param {string} origin - Origin coordinates "lat,lng"
 * @param {string} destination - Destination coordinates "lat,lng"
 * @param {string} mode - Travel mode (driving, walking, transit, bicycling)
 * @returns {Promise<Object>} - Directions data
 */
export const getVirtualTourDirections = async (origin, destination, mode = 'driving') => {
  console.log('[API] getVirtualTourDirections called with:', { origin, destination, mode });
  
  const response = await fetch(`${API_BASE_URL}/api/virtual-tour/directions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      origin,
      destination,
      mode
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[API] Directions request failed:', errorData);
    throw new Error(errorData.error || 'Failed to get directions');
  }

  const result = await response.json();
  console.log('[API] Directions result:', result);
  return result;
};

/**
 * Get detailed information about a specific place
 * @param {string} placeId - Google Places ID
 * @returns {Promise<Object>} - Place details
 */
export const getPlaceDetails = async (placeId) => {
  console.log('[API] getPlaceDetails called with:', placeId);
  
  const response = await fetch(`${API_BASE_URL}/api/virtual-tour/place-details/${placeId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[API] Place details request failed:', errorData);
    throw new Error(errorData.error || 'Failed to get place details');
  }

  const result = await response.json();
  console.log('[API] Place details result:', result);
  return result;
};

// ============================================
// OTHER UTILITY FUNCTIONS
// ============================================

export const getRooms = async () => {
  try {
    const response = await api.get('/rooms');
    return response.data;
  } catch (error) {
    console.error('[API] getRooms error:', error);
    throw error;
  }
};

export const getStyles = async () => {
  try {
    const response = await api.get('/styles');
    return response.data;
  } catch (error) {
    console.error('[API] getStyles error:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    console.log('[API] checkHealth called');
    const response = await api.get('/health');
    console.log('[API] Health response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] Health check failed:', error);
    return { status: 'unhealthy' };
  }
};

export default api;