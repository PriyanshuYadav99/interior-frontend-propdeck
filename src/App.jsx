
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles,Palette, Download, Home, Bed, Briefcase, Loader2, AlertCircle, CheckCircle, Sofa, ChevronDown, Grid3x3, MapPin, Bath, Utensils, X, ChevronLeft, ChevronRight, Clock, VolumeX, Shield, Building, Maximize2, Factory, AlignJustify, Crown, Flower2, TreePine } from 'lucide-react';
import { generateDesign, checkHealth, checkSession, incrementGeneration } from './api';
import RegistrationModal from './RegistrationModal';
import LifeEcho from './LifeEcho';
import VirtualTour from './VirtualTour';
import './App.css';
import { setTrackingStartTime, logToolUsage } from './activityTracker';
const getRandomScenarios = async () => {
  const response = await fetch('https://interior-backend-production.up.railway.app/api/scenario/random', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Failed to fetch scenarios');
  return await response.json();
};

const searchVirtualTour = async (location, category) => {
  const response = await fetch('https://interior-backend-production.up.railway.app/api/virtual-tour/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location, category, radius: 5000 })
  });
  if (!response.ok) throw new Error('Failed to fetch places');
  return await response.json();
};

const iconMap = {
  clock: Clock, time: Clock,
  volume: VolumeX, sound: VolumeX,
  shield: Shield, security: Shield,
  home: Home, house: Home,
  building: Building, office: Building,
  briefcase: Briefcase, work: Briefcase,
  mappin: MapPin, location: MapPin,
};

const App = () => {
  const [currentView, setCurrentView] = useState('default');
  const [selectedPreviewScenario, setSelectedPreviewScenario] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const clientName = urlParams.get('client') || 'skyline';

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const [progress, setProgress] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageHistory, setImageHistory] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewScenarios, setPreviewScenarios] = useState([]);
  const [loadingScenarios, setLoadingScenarios] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isHoveringTourCard, setIsHoveringTourCard] = useState(false);
  const [highlightedPillIds, setHighlightedPillIds] = useState([]);
  const autoScrollTimerRef = useRef(null);

  const [slideDirection, setSlideDirection] = useState('left');
  const [isSliding, setIsSliding] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);

  const [placesCache, setPlacesCache] = useState({});
  const [loadingPlaces, setLoadingPlaces] = useState(true);

  const [roomPreviewImage, setRoomPreviewImage] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [showBeforePreview, setShowBeforePreview] = useState(false);
  const [selectedFlatType, setSelectedFlatType] = useState('');

  // ✅ NEW: cache for room preview images
  const [roomPreviewCache, setRoomPreviewCache] = useState({});

  const categories = ['dining', 'education', 'nature', 'health', 'transport', 'shop', 'gym'];
  const APARTMENT_COORDS = { lat: 25.0694755, lng: 55.1468862 };

  const rooms = [
    { id: 'master_bedroom', name: 'Master Bedroom', icon: Bed },
    { id: 'living_room',    name: 'Living Room',    icon: Sofa },
    { id: 'kitchen',        name: 'Kitchen',        icon: Utensils },
  ];

  const styles = [
    { id: 'modern',       name: 'Modern',       icon: Maximize2    },
    { id: 'scandinavian', name: 'Scandinavian',  icon: TreePine     },
    { id: 'industrial',   name: 'Industrial',    icon: Factory      },
    { id: 'minimalist',   name: 'Minimalist',    icon: AlignJustify },
    { id: 'traditional',  name: 'Traditional',   icon: Crown        },
    { id: 'bohemian',     name: 'Bohemian',      icon: Flower2      },
  ];

  const flatTypes = [
  { id: '1bhk', name: '1BHK' },
  { id: '2bhk', name: '2BHK' },
  { id: '3bhk', name: '3BHK' },
  { id: 'villa', name: 'Villa' },
  { id: 'bungalow', name: 'Bungalow' },
  { id: 'rowhouse', name: 'Row House' },
];

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const health = await checkHealth();
        setApiStatus(health.status === 'healthy' ? 'connected' : 'disconnected');
      } catch (error) {
        setApiStatus('disconnected');
      }

      let currentSessionId = sessionStorage.getItem('sessionId');
      if (!currentSessionId) {
        currentSessionId = 'web-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('sessionId', currentSessionId);
      }
      setSessionId(currentSessionId);

      try {
        const savedHistory = sessionStorage.getItem('imageHistory');
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          setImageHistory(parsedHistory);
          setSelectedImageIndex(0);
        }
      } catch (error) {
        console.error('[APP] Error restoring image history:', error);
        sessionStorage.removeItem('imageHistory');
      }

      const registeredEmail = localStorage.getItem('userEmail');
      const registeredName  = localStorage.getItem('userName');
      const registeredPhone = localStorage.getItem('userPhone');

      if (registeredEmail && registeredName && registeredPhone) {
        setIsRegistered(true);
        setUserEmail(registeredEmail);
        setGenerationCount(0);
      } else {
        await checkServerGenerationCount(currentSessionId);
      }
    };
    initializeApp();
  }, []);

  useEffect(() => { loadPreviewScenarios(); }, []);
  useEffect(() => { loadAllPlaces(); }, []);

  // ✅ NEW: preload all 3 room images silently on mount
  useEffect(() => {
    const preloadAllRooms = async () => {
      const cache = {};
      await Promise.all(
        rooms.map(async (room) => {
          try {
            const res = await fetch(`https://interior-backend-production.up.railway.app/api/room-preview/${clientName}/${room.id}`);
            const data = await res.json();
            if (data.success) {
              cache[room.id] = `data:image/png;base64,${data.image_base64}`;
            }
          } catch (err) {
            console.error(`[APP] Failed to preload ${room.id}:`, err);
          }
        })
      );
      setRoomPreviewCache(cache);
    };
    preloadAllRooms();
  }, [clientName]);

  useEffect(() => {
    if (previewScenarios.length > 0) {
      const shuffled = [...previewScenarios].sort(() => Math.random() - 0.5);
      setHighlightedPillIds(shuffled.slice(0, 2).map(s => s.id));
    }
  }, [previewScenarios]);

  const slideTo = (newIndex, direction) => {
    if (isSliding) return;
    setSlideDirection(direction);
    setIsSliding(true);
    setCurrentCategoryIndex(newIndex);
    setTimeout(() => {
      setDisplayIndex(newIndex);
      setIsSliding(false);
    }, 350);
  };

  useEffect(() => {
    if (currentView !== 'default' || isHoveringTourCard) {
      clearInterval(autoScrollTimerRef.current);
      return;
    }
    autoScrollTimerRef.current = setInterval(() => {
      const next = (currentCategoryIndex + 1) % categories.length;
      slideTo(next, 'left');
    }, 7000);
    return () => clearInterval(autoScrollTimerRef.current);
  }, [currentView, isHoveringTourCard, currentCategoryIndex, isSliding]);

  const loadPreviewScenarios = async () => {
    setLoadingScenarios(true);
    try {
      const result = await getRandomScenarios();
      if (result.success && result.scenarios) setPreviewScenarios(result.scenarios.slice(0, 6));
    } catch (err) {
      console.error('Failed to load preview scenarios:', err);
    } finally {
      setLoadingScenarios(false);
    }
  };

  const loadAllPlaces = async () => {
    setLoadingPlaces(true);
    const location = `${APARTMENT_COORDS.lat},${APARTMENT_COORDS.lng}`;
    const cache = {};
    await Promise.all(
      categories.map(async (category) => {
        try {
          const result = await searchVirtualTour(location, category);
          if (result.success && result.places && result.places.length > 0) {
            cache[category] = result.places[0];
          }
        } catch (err) {
          console.error(`[APP] Failed to load places for ${category}:`, err);
        }
      })
    );
    setPlacesCache(cache);
    setLoadingPlaces(false);
  };

  const handleNextCategory = () => {
    clearInterval(autoScrollTimerRef.current);
    const next = (currentCategoryIndex + 1) % categories.length;
    slideTo(next, 'left');
  };

  const handlePrevCategory = () => {
    clearInterval(autoScrollTimerRef.current);
    const prev = (currentCategoryIndex - 1 + categories.length) % categories.length;
    slideTo(prev, 'right');
  };

  useEffect(() => {
    if (currentView === 'default' && sessionId && !isRegistered) checkServerGenerationCount(sessionId);
  }, [currentView]);

  const checkServerGenerationCount = async (sessionId) => {
    try {
      const data = await checkSession(sessionId);
      if (data.success) {
        setGenerationCount(data.generation_count || 0);
        if (data.is_registered) {
          setIsRegistered(true);
          setUserEmail(data.email || '');
          localStorage.setItem('userEmail', data.email || '');
        }
      }
    } catch (error) {
      setGenerationCount(parseInt(localStorage.getItem('generationCount') || '0', 10));
    }
  };

  // ✅ UPDATED: loadRoomPreview now checks cache first — instant if cached
  const loadRoomPreview = async (roomId) => {
    setShowBeforePreview(true);

    // If already cached → show instantly, no spinner, no fetch
    if (roomPreviewCache[roomId]) {
      setRoomPreviewImage(roomPreviewCache[roomId]);
      return;
    }

    // Not cached yet → fetch and save to cache
    setLoadingPreview(true);
    setRoomPreviewImage(null);
    try {
      const res = await fetch(`https://interior-backend-production.up.railway.app/api/room-preview/${clientName}/${roomId}`);
      const data = await res.json();
      if (data.success) {
        const img = `data:image/png;base64,${data.image_base64}`;
        setRoomPreviewCache(prev => ({ ...prev, [roomId]: img }));
        setRoomPreviewImage(img);
      }
    } catch (err) {
      console.error('[APP] Failed to load room preview:', err);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleRegistrationSuccess = async (data) => {
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userName', data.name);
    localStorage.setItem('userPhone', data.phone);
    localStorage.setItem('userId', data.user_id);
    localStorage.removeItem('generationCount');
    setIsRegistered(true);
    setGenerationCount(0);
    setUserEmail(data.email);
    setShowRegistrationModal(false);
    setError('');
    setSuccess('🎉 Registration complete! You now have unlimited access.');
  };

  const handleGenerate = async () => {
    if (!selectedRoom) { setError('Please select a room type'); return; }
    if (!selectedStyle && !customPrompt.trim()) { setError('Please select a style or enter a custom prompt'); return; }
    const actualCount = Math.max(generationCount, parseInt(localStorage.getItem('generationCount') || '0', 10));
    if (!isRegistered && actualCount >= 2) {
      setShowRegistrationModal(true);
      setError('⚠️ You\'ve used your 2 free generations. Please register to continue.');
      return;
    }
    await executeGeneration();
  };

  const executeGeneration = async () => {
    setIsGenerating(true); setError(''); setSuccess(''); setProgress(0);
    try {
      setProgress(10);
      const result = await generateDesign(selectedRoom, selectedStyle, customPrompt, clientName);
      setProgress(50);
      if (!result.success) throw new Error(result.error || 'Failed to generate');
      setProgress(80);
      // ✅ START TRACKING on first image generation
      setTrackingStartTime();
      const processedImages = [{
        id: result.images[0].id || Date.now(),
        url: result.images[0].image_url || result.images[0].cloudinary_url || `data:image/png;base64,${result.images[0].image_base64}`,
        cloudinaryUrl: result.images[0].image_url || result.images[0].cloudinary_url,
        style: result.images[0].style || selectedStyle || 'custom',
        roomType: result.images[0].room_type || selectedRoom,
        timestamp: Date.now()
      }];
      const newHistory = [...processedImages, ...imageHistory];
      setImageHistory(newHistory);
      setShowBeforePreview(false);
      try {
        const lightweightHistory = newHistory.slice(0, 20).map(img => ({
          id: img.id,
          url: img.cloudinaryUrl || (img.url.startsWith('http') ? img.url : null),
          style: img.style, roomType: img.roomType, timestamp: img.timestamp
        })).filter(img => img.url && img.url.startsWith('http'));
        sessionStorage.setItem('imageHistory', JSON.stringify(lightweightHistory));
      } catch (error) { sessionStorage.clear(); }
      setSelectedImageIndex(0);
      setProgress(100);
      if (!isRegistered) {
        const newCount = generationCount + 1;
        setGenerationCount(newCount);
        localStorage.setItem('generationCount', newCount.toString());
        try { await incrementGeneration(sessionId, selectedRoom, selectedStyle, customPrompt, clientName); } catch (err) { console.error('[APP] Error updating server count:', err); }
      }
    } catch (err) {
      console.error('[APP] Generation error:', err);
      setError(err.message || 'Failed to generate design. Please try again.');
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (image, index) => {
    try {
      if (image.url.startsWith('http')) {
        const response = await fetch(image.url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `design-${image.roomType}-${image.style}-${index + 1}.png`;
        document.body.appendChild(link); link.click();
        document.body.removeChild(link); URL.revokeObjectURL(blobUrl);
        setSuccess('✅ Image downloaded successfully!');
      } else {
        const link = document.createElement('a');
        link.href = image.url;
        link.download = `design-${image.roomType}-${image.style}-${index + 1}.png`;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
        setSuccess('✅ Image downloaded successfully!');
      }
    } catch (error) {
      console.error('[APP] Download error:', error);
      setError('❌ Failed to download image. Please try again.');
    }
  };

  const [virtualTourInitialPlace, setVirtualTourInitialPlace] = useState(null);
  const [virtualTourInitialMode, setVirtualTourInitialMode] = useState('map');
  const [virtualTourInitialCategory, setVirtualTourInitialCategory] = useState('dining');

const handleOpenVirtualTourMap = (place) => {
    // ✅ TRACKING: user leaving Room Design to go to Virtual Tour
    logToolUsage('room_design');
    setVirtualTourInitialPlace(place);
    setVirtualTourInitialMode('map');
    setVirtualTourInitialCategory(categories[currentCategoryIndex]);
    setCurrentView('virtualTour');
  };

  const handleOpenVirtualTourStreetView = (place) => {
    // ✅ TRACKING: user leaving Room Design to go to Virtual Tour
    logToolUsage('room_design');
    setVirtualTourInitialPlace(place);
    setVirtualTourInitialMode('streetview');
    setVirtualTourInitialCategory(categories[currentCategoryIndex]);
    setCurrentView('virtualTour');
  };

  const handleOpenVirtualTourCard = () => {
    // ✅ TRACKING: user leaving Room Design to go to Virtual Tour
    logToolUsage('room_design');
    setVirtualTourInitialPlace(null);
    setVirtualTourInitialMode('map');
    setVirtualTourInitialCategory(categories[currentCategoryIndex]);
    setCurrentView('virtualTour');
  };

  const handleBackToDefault = () => {
    // ✅ TRACKING: user coming back to Room Design
    // log whichever tool they were just using
    if (currentView === 'virtualTour') logToolUsage('virtual_tour');
    if (currentView === 'scenario') logToolUsage('lifeecho');
    setCurrentView('default');
    setSelectedPreviewScenario(null);
    setVirtualTourInitialPlace(null);
    setVirtualTourInitialMode('map');
    setVirtualTourInitialCategory('dining');
  };

  const handlePillClick = (scenario) => {
    // ✅ TRACKING: user leaving Room Design to go to LifeEcho
    logToolUsage('room_design');
    setSelectedPreviewScenario(scenario);
    setCurrentView('scenario');
  };

  const shouldShowBefore = showBeforePreview || imageHistory.length === 0;
  const currentPlace = placesCache[categories[displayIndex]];

  // Reusable pill renderer
  const renderPill = (scenario, idx, keyPrefix) => {
    const Icon = iconMap[scenario.icon] || Clock;
    const isHighlighted = highlightedPillIds.includes(scenario.id);
    return (
      <button key={keyPrefix + idx} onClick={() => handlePillClick(scenario)} style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.5rem 1rem 0.5rem 0.5rem',
        background: 'white',
        border: isHighlighted ? '2px solid transparent' : '1.5px solid #d1d5db',
        backgroundImage: isHighlighted
          ? 'linear-gradient(white, white), linear-gradient(to right, #4CAF50, #256D11)'
          : 'none',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        borderRadius: '50px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500',
        color: '#374151', whiteSpace: 'nowrap', flexShrink: 0, marginRight: '0.6rem',
        boxShadow: isHighlighted ? '0 1px 6px rgba(37,109,17,0.15)' : '0 1px 3px rgba(0,0,0,0.06)'
      }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: isHighlighted ? 'linear-gradient(to right, #4CAF50, #256D11)' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={13} color={isHighlighted ? 'white' : '#6b7280'} />
        </div>
        <span>{scenario.title}</span>
      </button>
    );
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'white', display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1rem', boxSizing: 'border-box' }}>

      {/* TOP SECTION */}
      <div style={{ flex: '0 0 58%', background: '#f5f5f5', borderRadius: '20px', padding: '1.25rem', display: 'flex', gap: '1.25rem', boxSizing: 'border-box', overflow: 'hidden' }}>

        {currentView === 'scenario' && (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <LifeEcho onBack={handleBackToDefault} initialScenario={selectedPreviewScenario} />
          </div>
        )}
        {currentView === 'virtualTour' && (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <VirtualTour
              onBack={handleBackToDefault}
              isEmbedded={true}
              initialPlace={virtualTourInitialPlace}
              initialMode={virtualTourInitialMode}
              initialCategory={virtualTourInitialCategory}
            />
          </div>
        )}

        {currentView === 'default' && (
          <>
            {/* LEFT */}
            <div style={{ width: '48%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '1rem', boxSizing: 'border-box', overflow: 'hidden' }}>

                {/* FLAT TYPE */}
                <div style={{ marginBottom: '0.7rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Building size={20} color="#1f2937" style={{ marginTop: '0.55rem', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                    {flatTypes.map((flat) => (
                      <button key={flat.id} onClick={() => setSelectedFlatType(flat.id)}
                        style={{
                          padding: '0.55rem 0.9rem', borderRadius: '8px',
                          border: selectedFlatType === flat.id ? '2px solid #9333ea' : '1px solid #e5e7eb',
                          background: selectedFlatType === flat.id ? '#faf5ff' : 'white',
                          cursor: 'pointer', fontSize: '0.88rem', fontWeight: '500',
                          color: selectedFlatType === flat.id ? '#9333ea' : '#6b7280',
                          whiteSpace: 'nowrap'
                        }}>
                        {flat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ROOMS */}
                <div style={{ marginBottom: '0.7rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Home size={20} color="#1f2937" style={{ marginTop: '0.55rem', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                    {rooms.map((room) => {
                      const Icon = room.icon;
                      return (
                        <button key={room.id} onClick={() => { setSelectedRoom(room.id); loadRoomPreview(room.id); }}
                          style={{ padding: '0.55rem 0.9rem', borderRadius: '8px', border: selectedRoom === room.id ? '2px solid #9333ea' : '1px solid #e5e7eb', background: selectedRoom === room.id ? '#faf5ff' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: '500', color: selectedRoom === room.id ? '#9333ea' : '#6b7280', whiteSpace: 'nowrap' }}>
                          <Icon size={16} /><span>{room.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STYLES + OR + textarea */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Palette size={20} color="#1f2937" style={{ marginTop: '0.55rem', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                    {styles.map((style) => {
                      const StyleIcon = style.icon;
                      return (
                        <button key={style.id} onClick={() => { setSelectedStyle(style.id); setCustomPrompt(''); }}
                          style={{ padding: '0.55rem 0.9rem', borderRadius: '8px', border: selectedStyle === style.id ? '2px solid #9333ea' : '1px solid #e5e7eb', background: selectedStyle === style.id ? '#faf5ff' : 'white', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '500', color: selectedStyle === style.id ? '#9333ea' : '#6b7280', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                          <StyleIcon size={15} />{style.name}
                        </button>
                      );
                    })}
                    <div style={{ width: '100%' }}>
                      <div style={{ textAlign: 'center', color: '#9ca3af', fontWeight: '600', margin: '0.3rem 0', fontSize: '0.75rem' }}>OR</div>
                      <textarea
                        value={customPrompt}
                        onChange={(e) => { setCustomPrompt(e.target.value); if (e.target.value.trim()) setSelectedStyle(''); }}
                        placeholder="Describe your style (e.g., Space theme kids room...)"
                        style={{
                          width: '100%',
                          padding: '0.55rem',
                          border: customPrompt.trim() ? '2px solid #9333ea' : '1px solid #e5e7eb',
                          borderRadius: '6px',
                          resize: 'none',
                          height: '2.8rem',
                          fontSize: '0.8rem',
                          outline: 'none',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          color: '#374151'
                        }}
                      />
                    </div>
                  </div>
                </div>

              </div>

              <button onClick={handleGenerate} disabled={isGenerating || apiStatus === 'disconnected'}
                style={{ width: '100%', background: isGenerating || apiStatus === 'disconnected' ? '#d1d5db' : '#256D11', color: 'white', padding: '0.75rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', border: 'none', cursor: isGenerating || apiStatus === 'disconnected' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {isGenerating ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />Generating...</> : <><Sparkles size={18} />Generate Design</>}
              </button>

              <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500', fontStyle: 'italic' }}>powered by</span>
                <img src="/logo.png" alt="PropDeck Logo" style={{ height: '14px', width: 'auto' }} />
              </div>
            </div>

            {/* RIGHT: image panel */}
            <div style={{ flex: 1, background: 'white', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {shouldShowBefore ? (
                loadingPreview ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <Loader2 size={36} color="#9333ea" style={{ animation: 'spin 1s linear infinite' }} />
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Loading room preview...</p>
                  </div>
                ) : roomPreviewImage ? (
                  <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                    <img src={roomPreviewImage} alt="Room reference" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', filter: 'brightness(0.93)' }} />
                    {isGenerating && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.72)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backdropFilter: 'blur(3px)', zIndex: 10 }}>
                        <Loader2 size={42} color="#9333ea" style={{ animation: 'spin 1s linear infinite' }} />
                        <p style={{ color: '#9333ea', fontWeight: '600', fontSize: '0.95rem', margin: 0 }}>Generating your design...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" style={{ margin: '0 auto 1rem', display: 'block' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '0.4rem', fontWeight: '500', textAlign: 'center' }}>The generated image will be displayed</p>
                      <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '0.4rem', fontWeight: '500', textAlign: 'center' }}>in this section after processing.</p>
                    </div>
                  </div>
                )
              ) : (
                <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                  <img src={imageHistory[selectedImageIndex].url} alt="Design" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', zIndex: 5 }}>
                    {imageHistory.slice(0, 6).map((img, idx) => (
                      <button key={idx} onClick={() => setSelectedImageIndex(idx)} style={{ width: '40px', height: '40px', border: selectedImageIndex === idx ? '2px solid #3b82f6' : '2px solid white', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', flexShrink: 0 }}>
                        <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                  {isGenerating && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.72)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backdropFilter: 'blur(3px)', zIndex: 10 }}>
                      <Loader2 size={42} color="#9333ea" style={{ animation: 'spin 1s linear infinite' }} />
                      <p style={{ color: '#9333ea', fontWeight: '600', fontSize: '0.95rem', margin: 0 }}>Generating your design...</p>
                    </div>
                  )}
                  <button onClick={() => downloadImage(imageHistory[selectedImageIndex], selectedImageIndex)} style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'white', color: '#1f2937', padding: '0.65rem', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 10 }}>
                    <Download size={20} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* BOTTOM SECTION */}
      <div style={{ height: '180px', display: 'flex', gap: '1rem' }}>

        {/* LIFEECHO CARD */}
        <div style={{ flex: 1, background: '#f5f5f5', borderRadius: '16px', padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflow: 'hidden', minWidth: 0 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937', margin: '0 0 0.25rem 0', flexShrink: 0 }}>LifeEcho</h3>
          {loadingScenarios ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={28} color="#256D11" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1, overflow: 'hidden', justifyContent: 'space-evenly' }}>
              <div style={{ overflow: 'hidden' }}>
                <div className="marquee-left">
                  {[...previewScenarios.slice(0, 3), ...previewScenarios.slice(0, 3)].map((scenario, idx) =>
                    renderPill(scenario, idx, 'r1-')
                  )}
                </div>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div className="marquee-right">
                  {[...previewScenarios.slice(3, 6), ...previewScenarios.slice(3, 6)].map((scenario, idx) =>
                    renderPill(scenario, idx, 'r2-')
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* VIRTUAL TOUR CARD */}
        <div style={{ flex: 1, background: '#f5f5f5', borderRadius: '16px', padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937', margin: '0 0 0.25rem 0', flexShrink: 0 }}>Virtual Tour</h3>

          {loadingPlaces ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={28} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : currentPlace ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onMouseEnter={() => setIsHoveringTourCard(true)}
              onMouseLeave={() => setIsHoveringTourCard(false)}
            >
              <button onClick={handlePrevCategory} style={{ background: 'none', border: 'none', width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0 }}>
                <ChevronLeft size={22} color="#374151" />
              </button>

              <div
                key={displayIndex}
                style={{
                  flex: 1, background: 'white', borderRadius: '12px', padding: '1.25rem 0.85rem',
                  display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer', overflow: 'hidden',
                  animation: `slideIn${slideDirection === 'left' ? 'Left' : 'Right'} 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
                onClick={handleOpenVirtualTourCard}
              >
                {currentPlace.photo_url && (
                  <img src={currentPlace.photo_url} alt={currentPlace.name} style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: '0 0 0.4rem 0', color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentPlace.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.6rem', border: '1.5px solid #d1d5db', borderRadius: '50px', fontSize: '0.75rem', color: '#374151', fontWeight: '600', background: 'white' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                      ~{currentPlace.distance}km
                    </span>
                    {currentPlace.rating && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.6rem', background: '#FBBF24', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '600', color: 'white' }}>
                        ★ {currentPlace.rating}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
                  <button onClick={(e) => { e.stopPropagation(); handleOpenVirtualTourMap(currentPlace); }} style={{ width: '30px', height: '30px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }} title="View on map">
                    <MapPin size={22} color="#3b82f6" strokeWidth={2} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleOpenVirtualTourStreetView(currentPlace); }} style={{ width: '30px', height: '30px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }} title="Street View">
                    <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="5" r="2" fill="#f97316"/>
                      <path d="M12 8c-1.5 0-3 .8-3.5 2L7 13h2l1-2v3l-2 5h2l1-3 1 3h2l-2-5v-3l1 2h2l-1.5-3C14 8.8 13.5 8 12 8z" fill="#f97316"/>
                    </svg>
                  </button>
                </div>
              </div>

              <button onClick={handleNextCategory} style={{ background: 'none', border: 'none', width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0 }}>
                <ChevronRight size={22} color="#374151" />
              </button>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>No places found</div>
          )}
        </div>
      </div>

      <RegistrationModal
  isOpen={showRegistrationModal}
  onClose={() => { if (isRegistered) setShowRegistrationModal(false); }}
  onSuccess={handleRegistrationSuccess}
  generatedCount={generationCount}
  sessionId={sessionId}
  selectedFlatType={selectedFlatType}  
/>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .marquee-left { display: inline-flex; animation: marquee-left 50s linear infinite; width: max-content; }
        .marquee-right { display: inline-flex; animation: marquee-right 50s linear infinite; width: max-content; }
        .marquee-left:hover, .marquee-right:hover { animation-play-state: paused; }

        @keyframes slideInLeft {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }

        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default App;