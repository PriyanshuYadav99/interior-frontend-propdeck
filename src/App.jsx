import React, { useState, useEffect } from 'react';
import { Sparkles, Download, Home, Bed, Briefcase, Loader2, AlertCircle, CheckCircle, Sofa, ChevronDown, Grid3x3, MapPin, Bath, Utensils, X, ChevronLeft, ChevronRight, Clock, VolumeX, Shield, Building, Maximize2, Factory, AlignJustify, Crown, Flower2, TreePine } from 'lucide-react';
import { generateDesign, checkHealth, checkSession, incrementGeneration } from './api';
import RegistrationModal from './RegistrationModal';
import LifeEcho from './LifeEcho';
import VirtualTour from './VirtualTour';
import './App.css';

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
  const [previewPlace, setPreviewPlace] = useState(null);
  const [loadingPlace, setLoadingPlace] = useState(false);

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
  useEffect(() => { loadPreviewPlace(categories[currentCategoryIndex]); }, [currentCategoryIndex]);

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

  const loadPreviewPlace = async (category) => {
    setLoadingPlace(true);
    try {
      const location = `${APARTMENT_COORDS.lat},${APARTMENT_COORDS.lng}`;
      const result = await searchVirtualTour(location, category);
      if (result.success && result.places && result.places.length > 0) setPreviewPlace(result.places[0]);
    } catch (err) {
      console.error('Failed to load preview place:', err);
    } finally {
      setLoadingPlace(false);
    }
  };

  const handleNextCategory = () => setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
  const handlePrevCategory = () => setCurrentCategoryIndex((prev) => (prev - 1 + categories.length) % categories.length);

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

  // ─── Virtual Tour state ───────────────────────────────────────────────────
  const [virtualTourInitialPlace, setVirtualTourInitialPlace] = useState(null);
  const [virtualTourInitialMode, setVirtualTourInitialMode] = useState('map');
  // NEW: tracks which category tab should be active when VirtualTour opens
  const [virtualTourInitialCategory, setVirtualTourInitialCategory] = useState('dining');

  // Opens Virtual Tour on map view, pre-selecting the currently previewed category
  const handleOpenVirtualTourMap = (place) => {
    setVirtualTourInitialPlace(place);
    setVirtualTourInitialMode('map');
    setVirtualTourInitialCategory(categories[currentCategoryIndex]);
    setCurrentView('virtualTour');
  };

  // Opens Virtual Tour on street view, pre-selecting the currently previewed category
  const handleOpenVirtualTourStreetView = (place) => {
    setVirtualTourInitialPlace(place);
    setVirtualTourInitialMode('streetview');
    setVirtualTourInitialCategory(categories[currentCategoryIndex]);
    setCurrentView('virtualTour');
  };

  // Opens Virtual Tour when user clicks the card body (no specific place)
  const handleOpenVirtualTourCard = () => {
    setVirtualTourInitialPlace(null);
    setVirtualTourInitialMode('map');
    setVirtualTourInitialCategory(categories[currentCategoryIndex]);
    setCurrentView('virtualTour');
  };

  const handleBackToDefault = () => {
    setCurrentView('default');
    setSelectedPreviewScenario(null);
    setVirtualTourInitialPlace(null);
    setVirtualTourInitialMode('map');
    setVirtualTourInitialCategory('dining');
  };

  const handlePillClick = (scenario) => {
    setSelectedPreviewScenario(scenario);
    setCurrentView('scenario');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#e5e7eb', display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1rem', boxSizing: 'border-box' }}>

      {/* TOP SECTION — grey container, fixed proportional height */}
      <div style={{ flex: '0 0 58%', background: '#f3f4f6', borderRadius: '20px', padding: '1.25rem', display: 'flex', gap: '1.25rem', boxSizing: 'border-box', overflow: 'hidden' }}>

        {currentView === 'scenario' && (
          <div style={{ flex: 1, background: 'white', borderRadius: '16px', overflow: 'hidden' }}>
            <LifeEcho onBack={handleBackToDefault} initialScenario={selectedPreviewScenario} />
          </div>
        )}
        {currentView === 'virtualTour' && (
          <div style={{ flex: 1, background: 'white', borderRadius: '16px', overflow: 'hidden' }}>
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
            {/* LEFT: white card + button, no stretch */}
            <div style={{ width: '48%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '1rem', boxSizing: 'border-box' }}>
                {/* ROOMS */}
                <div style={{ marginBottom: '0.7rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Home size={20} color="#9ca3af" style={{ marginTop: '0.55rem', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flex: 1 }}>
                    {rooms.map((room) => { const Icon = room.icon; return (
                      <button key={room.id} onClick={() => setSelectedRoom(room.id)} style={{ padding: '0.55rem 0.9rem', borderRadius: '8px', border: selectedRoom === room.id ? '2px solid #9333ea' : '1px solid #e5e7eb', background: selectedRoom === room.id ? '#faf5ff' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: '500', color: selectedRoom === room.id ? '#9333ea' : '#6b7280', whiteSpace: 'nowrap' }}>
                        <Icon size={16} /><span>{room.name}</span>
                      </button>
                    ); })}
                  </div>
                </div>
                {/* STYLES */}
                <div style={{ marginBottom: '0.7rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Sparkles size={20} color="#9ca3af" style={{ marginTop: '0.55rem', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flex: 1 }}>
                    {styles.map((style) => { const StyleIcon = style.icon; return (
                      <button key={style.id} onClick={() => { setSelectedStyle(style.id); setCustomPrompt(''); }} style={{ padding: '0.55rem 0.9rem', borderRadius: '8px', border: selectedStyle === style.id ? '2px solid #9333ea' : '1px solid #e5e7eb', background: selectedStyle === style.id ? '#faf5ff' : 'white', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '500', color: selectedStyle === style.id ? '#9333ea' : '#6b7280', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                        <StyleIcon size={15} />{style.name}
                      </button>
                    ); })}
                  </div>
                </div>
                {/* OR + PROMPT */}
                <div style={{ textAlign: 'center', color: '#9ca3af', fontWeight: '600', margin: '0.3rem 0', fontSize: '0.75rem' }}>OR</div>
                <textarea value={customPrompt} onChange={(e) => { setCustomPrompt(e.target.value); if (e.target.value.trim()) setSelectedStyle(''); }} placeholder="Describe your style (e.g., Space theme kids room...)" style={{ width: '100%', padding: '0.55rem', border: customPrompt.trim() ? '2px solid #9333ea' : '1px solid #e5e7eb', borderRadius: '6px', resize: 'none', height: '2.8rem', fontSize: '0.8rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', color: '#374151' }} />
              </div>

              {/* GENERATE BUTTON */}
              <button onClick={handleGenerate} disabled={isGenerating || apiStatus === 'disconnected'} style={{ width: '100%', background: isGenerating || apiStatus === 'disconnected' ? '#d1d5db' : '#22c55e', color: 'white', padding: '0.75rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', border: 'none', cursor: isGenerating || apiStatus === 'disconnected' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {isGenerating ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />Generating...</> : <><Sparkles size={18} />Generate Design</>}
              </button>

              {/* POWERED BY */}
              <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500', fontStyle: 'italic' }}>powered by</span>
                <img src="/logo.png" alt="PropDeck Logo" style={{ height: '14px', width: 'auto' }} />
              </div>
            </div>

            {/* RIGHT: image panel */}
            <div style={{ flex: 1, background: 'white', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {imageHistory.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Sparkles size={56} color="#d1d5db" style={{ margin: '0 auto 1rem' }} />
                    <p style={{ color: '#9ca3af', fontSize: '1rem', marginBottom: '0.4rem', fontWeight: '500' }}>Your AI-generated designs will appear here</p>
                    <p style={{ color: '#d1d5db', fontSize: '0.8rem' }}>Select a room and style, then click Generate Design</p>
                  </div>
                </div>
              ) : (
                <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                  <img src={imageHistory[selectedImageIndex].url} alt="Design" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                  {imageHistory.length > 1 && (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {imageHistory.slice(0, 6).map((img, idx) => (
                        <button key={idx} onClick={() => setSelectedImageIndex(idx)} style={{ width: '40px', height: '40px', border: selectedImageIndex === idx ? '2px solid #3b82f6' : '2px solid white', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', flexShrink: 0 }}>
                          <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Download button */}
                  <button onClick={() => downloadImage(imageHistory[selectedImageIndex], selectedImageIndex)} style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'white', color: '#1f2937', padding: '0.65rem', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 10 }}>
                    <Download size={20} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* BOTTOM SECTION — fills remaining space */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '1rem' }}>

        {/* LIFEECHO CARD */}
        <div style={{ flex: 1, background: '#eaecef', borderRadius: '16px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', overflow: 'hidden', minWidth: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937', margin: 0, flexShrink: 0 }}>LifeEcho</h3>
          {loadingScenarios ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={28} color="#10b981" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflow: 'hidden', justifyContent: 'center' }}>
              {/* ROW 1 - left */}
              <div style={{ overflow: 'hidden' }}>
                <div className="marquee-left">
                  {[...previewScenarios.slice(0, 2), ...previewScenarios.slice(0, 2)].map((scenario, idx) => {
                    const Icon = iconMap[scenario.icon] || Clock;
                    return (
                      <button key={"r1-" + idx} onClick={() => handlePillClick(scenario)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.9rem 0.4rem 0.45rem', background: 'white', border: '2px solid #10b981', borderRadius: '50px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '500', color: '#374151', whiteSpace: 'nowrap', flexShrink: 0, marginRight: '0.6rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={12} color="white" />
                        </div>
                        <span>{scenario.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* ROW 2 - right */}
              <div style={{ overflow: 'hidden' }}>
                <div className="marquee-right">
                  {[...previewScenarios.slice(2, 4), ...previewScenarios.slice(2, 4)].map((scenario, idx) => {
                    const Icon = iconMap[scenario.icon] || Clock;
                    return (
                      <button key={"r2-" + idx} onClick={() => handlePillClick(scenario)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.9rem 0.4rem 0.45rem', background: 'white', border: '1.5px solid #d1d5db', borderRadius: '50px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '500', color: '#374151', whiteSpace: 'nowrap', flexShrink: 0, marginRight: '0.6rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={12} color="#9ca3af" />
                        </div>
                        <span>{scenario.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* ROW 3 - left */}
              <div style={{ overflow: 'hidden' }}>
                <div className="marquee-left" style={{ animationDuration: '22s' }}>
                  {[...previewScenarios.slice(4, 6), ...previewScenarios.slice(4, 6)].map((scenario, idx) => {
                    const Icon = iconMap[scenario.icon] || Clock;
                    return (
                      <button key={"r3-" + idx} onClick={() => handlePillClick(scenario)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.9rem 0.4rem 0.45rem', background: 'white', border: '2px solid #10b981', borderRadius: '50px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '500', color: '#374151', whiteSpace: 'nowrap', flexShrink: 0, marginRight: '0.6rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={12} color="white" />
                        </div>
                        <span>{scenario.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* VIRTUAL TOUR CARD */}
        <div style={{ flex: 1, background: '#eaecef', borderRadius: '16px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937', margin: 0, flexShrink: 0 }}>Virtual Tour</h3>
          {loadingPlace ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={28} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : previewPlace ? (
            <div
              onClick={handleOpenVirtualTourCard}
              style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', border: '2px solid transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <button onClick={(e) => { e.stopPropagation(); handlePrevCategory(); }} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <ChevronLeft size={18} />
              </button>
              {previewPlace.photo_url && <img src={previewPlace.photo_url} alt={previewPlace.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.35rem 0', color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{previewPlace.name}</h4>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>~{previewPlace.distance}km • {categories[currentCategoryIndex]}</p>
              </div>
              {/* Map pin + walking icons */}
              <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenVirtualTourMap(previewPlace); }}
                  style={{ width: '30px', height: '30px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                  title="View on map"
                >
                  <MapPin size={22} color="#3b82f6" strokeWidth={2} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenVirtualTourStreetView(previewPlace); }}
                  style={{ width: '30px', height: '30px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                  title="Street View"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#f97316" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="5" r="2" fill="#f97316"/>
                    <path d="M12 8c-1.5 0-3 .8-3.5 2L7 13h2l1-2v3l-2 5h2l1-3 1 3h2l-2-5v-3l1 2h2l-1.5-3C14 8.8 13.5 8 12 8z" fill="#f97316"/>
                  </svg>
                </button>
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleNextCategory(); }} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>No places found</div>
          )}
        </div>
      </div>

      <RegistrationModal isOpen={showRegistrationModal} onClose={() => { if (isRegistered) setShowRegistrationModal(false); }} onSuccess={handleRegistrationSuccess} generatedCount={generationCount} sessionId={sessionId} />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .marquee-left { display: inline-flex; animation: marquee-left 18s linear infinite; width: max-content; }
        .marquee-right { display: inline-flex; animation: marquee-right 18s linear infinite; width: max-content; }
        .marquee-left:hover, .marquee-right:hover { animation-play-state: paused; }
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