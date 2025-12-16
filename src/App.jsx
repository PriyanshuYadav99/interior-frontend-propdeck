

import React, { useState, useEffect } from 'react';
import { Sparkles, Download, Home, Bed, Briefcase, UtensilsCrossed, Loader2, AlertCircle, CheckCircle, Share2, Sofa } from 'lucide-react';
import { generateDesign, checkHealth, checkSession, incrementGeneration } from './api';
import RegistrationModal from './RegistrationModal';
import './App.css';

const App = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const clientName = urlParams.get('client') || 'skyline';
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [imageHistory, setImageHistory] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  
  const [progress, setProgress] = useState(0);
  
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [sessionId, setSessionId] = useState('');

  const rooms = [
    { id: 'master_bedroom', name: 'Master Bedroom', icon: Bed },
    // { id: 'bedroom_1', name: 'Bedroom 1', icon: Bed },
    // { id: 'bedroom_2', name: 'Bedroom 2', icon: Bed },
    { id: 'living_room', name: 'Living Room', icon: Sofa },
    { id: 'kitchen', name: 'Kitchen', icon: Briefcase },
    // { id: 'dining_room', name: 'Dining Room', icon: UtensilsCrossed }
  ];

  const styles = [
    { id: 'modern', name: 'Modern' },
    { id: 'scandinavian', name: 'Scandinavian' },
    { id: 'industrial', name: 'Industrial' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'traditional', name: 'Traditional' },
    { id: 'bohemian', name: 'Bohemian' }
  ];

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const health = await checkHealth();
        setApiStatus(health.status === 'healthy' ? 'connected' : 'disconnected');
      } catch (error) {
        setApiStatus('disconnected');
      }
    };
    checkApiHealth();

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
        console.log('[APP] Restored', parsedHistory.length, 'images from session');
      }
    } catch (error) {
      console.error('[APP] Error restoring image history:', error);
      sessionStorage.removeItem('imageHistory');
    }

    const registeredEmail = localStorage.getItem('userEmail');
    const registeredName = localStorage.getItem('userName');
    const registeredPhone = localStorage.getItem('userPhone');
    
    if (registeredEmail && registeredName && registeredPhone) {
      setIsRegistered(true);
      setUserEmail(registeredEmail);
      setGenerationCount(0);
      console.log('[APP] User is registered:', registeredEmail);
    } else {
      checkServerGenerationCount(currentSessionId);
    }
  }, []);

  const checkServerGenerationCount = async (sessionId) => {
    try {
      const data = await checkSession(sessionId);
      
      if (data.success) {
        const count = data.generation_count || 0;
        setGenerationCount(count);
        console.log('[APP] Current generation count:', count);
        
        if (data.is_registered) {
          setIsRegistered(true);
          setUserEmail(data.email || '');
          localStorage.setItem('userEmail', data.email || '');
        }
      }
    } catch (error) {
      console.error('[APP] Error checking session:', error);
      const localCount = parseInt(localStorage.getItem('generationCount') || '0', 10);
      setGenerationCount(localCount);
    }
  };

  const handleGenerate = async () => {
    if (!selectedRoom) {
      setError('Please select a room type');
      return;
    }

    if (!selectedStyle && !customPrompt.trim()) {
      setError('Please select a style or enter a custom prompt');
      return;
    }

    if (!isRegistered && generationCount >= 2) {
      console.log('[APP] Generation limit reached. Showing registration modal...');
      setShowRegistrationModal(true);
      setError('⚠️ You\'ve used your 2 free generations. Please register to continue.');
      return;
    }

    await executeGeneration();
  };

  const executeGeneration = async () => {
    setIsGenerating(true);
    setError('');
    setSuccess('');
    setProgress(0);

    try {
      console.log('[APP] Starting generation...');
      setProgress(10);
      
      const result = await generateDesign(selectedRoom, selectedStyle, customPrompt, clientName);
      
      setProgress(50);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate');
      }

      console.log('[APP] 🎉 Generation completed!');
      setProgress(80);
      
      // ✅ FIXED: Use Cloudinary URL if available, fallback to base64
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
      
      // ✅ FIXED: Save only URLs to sessionStorage (lightweight)
      try {
        const lightweightHistory = newHistory.slice(0, 20).map(img => ({
          id: img.id,
          url: img.cloudinaryUrl || (img.url.startsWith('http') ? img.url : null),
          style: img.style,
          roomType: img.roomType,
          timestamp: img.timestamp
        })).filter(img => img.url && img.url.startsWith('http'));
        
        sessionStorage.setItem('imageHistory', JSON.stringify(lightweightHistory));
        console.log('[APP] Saved', lightweightHistory.length, 'image URLs to session');
      } catch (error) {
        console.error('[APP] Error saving to sessionStorage:', error);
        sessionStorage.clear();
      }
      
      setSelectedImageIndex(0);
      setSuccess('✅ Design generated successfully!');
      setProgress(100);

      if (!isRegistered) {
        const newCount = generationCount + 1;
        setGenerationCount(newCount);
        localStorage.setItem('generationCount', newCount.toString());
        
        try {
          await incrementGeneration(sessionId, selectedRoom, selectedStyle, customPrompt, clientName);
        } catch (err) {
          console.error('[APP] Error updating server count:', err);
        }

        console.log('[APP] Generation count updated:', newCount);
      }

    } catch (err) {
      console.error('[APP] Generation error:', err);
      setError(err.message || 'Failed to generate design. Please try again.');
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegistrationSuccess = async (data) => {
    console.log('[APP] Registration successful:', data);
    
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
    
    console.log('[APP] User registered and modal closed');
  };

  // ✅ FIXED: Download function to handle both URLs and base64
  const downloadImage = async (image, index) => {
    try {
      if (image.url.startsWith('http')) {
        // Download from URL
        const response = await fetch(image.url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `design-${image.roomType}-${image.style}-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } else {
        // Download base64 directly
        const link = document.createElement('a');
        link.href = image.url;
        link.download = `design-${image.roomType}-${image.style}-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('[APP] Download error:', error);
      setError('Failed to download image');
    }
  };

  // const shareImage = async (imageUrl) => {
  //   try {
  //     if (navigator.share) {
  //       const response = await fetch(imageUrl);
  //       const blob = await response.blob();
  //       const file = new File([blob], 'design.png', { type: 'image/png' });
        
  //       await navigator.share({
  //         title: 'AI Interior Design',
  //         text: 'Check out this amazing interior design!',
  //         files: [file]
  //       });
  //       setSuccess('✓ Shared successfully!');
  //     } else {
  //       await navigator.clipboard.writeText(window.location.href);
  //       setSuccess('✓ Link copied to clipboard!');
  //     }
  //   } catch (error) {
  //     if (error.name !== 'AbortError') {
  //       console.error('Share error:', error);
  //       setError('Failed to share. Please try again.');
  //     }
  //   }
  // };

  return (
    <div style={{ height: '100vh', background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 50%, #eff6ff 100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* <div style={{ textAlign: 'center', padding: '1rem 2rem 0.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem', margin: 0 }}>
          Reimagine Your Property with AI
        </h1>
      </div> */}

      <div style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '0.5rem 2rem 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', overflow: 'hidden' }}>
        {/* Left Panel */}
        <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '1.5rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Home size={18} color="#374151" />
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>Select Room</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {rooms.map((room) => {
                  const Icon = room.icon;
                  return (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      style={{
                        padding: '0.625rem',
                        borderRadius: '0.5rem',
                        border: selectedRoom === room.id ? '2px solid #9333ea' : '2px solid #e5e7eb',
                        background: selectedRoom === room.id ? '#faf5ff' : 'white',
                        boxShadow: selectedRoom === room.id ? '0 4px 6px rgba(147,51,234,0.1)' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Icon size={16} />
                      <span style={{ fontWeight: '500', fontSize: '0.8rem' }}>{room.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Sparkles size={18} color="#374151" />
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>Choose Style</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setSelectedStyle(style.id);
                      setCustomPrompt('');
                    }}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: selectedStyle === style.id ? '2px solid #9333ea' : '2px solid #e5e7eb',
                      background: selectedStyle === style.id ? '#faf5ff' : 'white',
                      boxShadow: selectedStyle === style.id ? '0 4px 6px rgba(147,51,234,0.1)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontWeight: '500', fontSize: '0.8rem' }}>{style.name}</span>
                  </button>
                ))}
              </div>

              <div style={{ textAlign: 'center', color: '#9ca3af', fontWeight: '500', margin: '0.5rem 0', fontSize: '0.75rem' }}>OR</div>

              <textarea
                value={customPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value);
                  if (e.target.value.trim()) setSelectedStyle('');
                }}
                placeholder="Describe your style (e.g., Space theme kids room, Tropical paradise...)"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  resize: 'none',
                  height: '4rem',
                  fontSize: '0.8rem',
                  outline: 'none',
                  transition: 'border 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || apiStatus === 'disconnected'}
              style={{
                width: '100%',
                background: isGenerating || apiStatus === 'disconnected' ? '#d1d5db' : '#256D11',
                color: 'white',
                padding: '0.875rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                border: 'none',
                cursor: isGenerating || apiStatus === 'disconnected' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 10px 15px rgba(37,109,17,0.3)',
                transition: 'all 0.2s',
                marginBottom: '1rem'
              }}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Design
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem', color: '#6b7280', fontWeight: '600', fontStyle: 'italic' }}>
                Powered by
              </span>
              <img 
                src="/logo.png"
                alt="PropDeck Logo" 
                style={{ height: '24px', width: 'auto' }}
              />
            </div>

            {success && (
              <div style={{ marginBottom: '0.75rem', padding: '0.625rem', background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '0.5rem', color: '#047857', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={14} />
                {success}
              </div>
            )}

            {error && (
              <div style={{ marginBottom: '0.75rem', padding: '0.625rem', background: '#fef2f2', border: '1px solid #ef4444', borderRadius: '0.5rem', color: '#dc2626', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={14} />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Generated Designs</h2>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {imageHistory.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', borderRadius: '0.75rem', border: '2px dashed #d1d5db' }}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <Sparkles size={48} color="#d1d5db" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ color: '#9ca3af', fontSize: '1rem', marginBottom: '0.5rem' }}>
                    Your AI-generated designs will appear here
                  </p>
                  <p style={{ color: '#d1d5db', fontSize: '0.8rem' }}>
                    Select a room and style, then click Generate Design
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                {imageHistory.length > 0 && (
                  <div style={{ flexShrink: 0 }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Previous Designs ({imageHistory.length})
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      overflowX: 'auto', 
                      paddingBottom: '0.5rem'
                    }}>
                      {imageHistory.slice(0, 5).map((img, idx) => (
                        <button
                          key={`thumb-${img.timestamp}-${idx}`}
                          onClick={() => {
                            setSelectedImageIndex(idx);
                          }}
                          style={{
                            minWidth: '60px',
                            height: '60px',
                            border: selectedImageIndex === idx
                              ? '3px solid #9333ea' 
                              : '2px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            padding: 0,
                            background: 'none',
                            transition: 'all 0.2s',
                            boxShadow: selectedImageIndex === idx
                              ? '0 4px 6px rgba(147,51,234,0.3)'
                              : 'none'
                          }}
                        >
                          <img
                            src={img.url}
                            alt={`Thumbnail ${idx + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {imageHistory.map((image, index) => {
                  if (index !== selectedImageIndex) return null;
                  
                  return (
                  <div key={`main-${image.timestamp}-${index}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 0 }}>
                    <div style={{ 
                      position: 'relative', 
                      width: '100%',
                      flex: 1,
                      borderRadius: '0.75rem', 
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      background: '#f9fafb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={image.url}
                        alt={`Design ${index + 1}`}
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '100%',
                          objectFit: 'contain',
                          display: 'block'
                        }}
                      />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '600', textTransform: 'capitalize' }}>
                          {image.roomType.replace('_', ' ')}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#9333ea', fontWeight: '500', textTransform: 'capitalize' }}>
                          {image.style}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => downloadImage(image, index)}
                          style={{
                            background: 'white',
                            color: '#111827',
                            padding: '0.625rem',
                            borderRadius: '50%',
                            fontWeight: '600',
                            border: '2px solid #e5e7eb',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            width: '45px',
                            height: '45px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#9333ea';
                            e.currentTarget.style.background = '#faf5ff';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => {
          if (isRegistered) {
            setShowRegistrationModal(false);
          }
        }}
        onSuccess={handleRegistrationSuccess}
        generatedCount={generationCount}
        sessionId={sessionId}
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        * {
          box-sizing: border-box;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: #9333ea;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #7c3aed;
        }
      `}</style>
    </div>
  );
};

export default App;
// import React, { useState, useEffect } from 'react';
// import { Sparkles, Download, Home, Bed, Briefcase, UtensilsCrossed, Loader2, AlertCircle, CheckCircle, Share2, Sofa } from 'lucide-react';
// import { generateDesign, checkHealth, checkSession, incrementGeneration } from './api';
// import RegistrationModal from './RegistrationModal';
// import './App.css';

// const App = () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const clientName = urlParams.get('client') || 'skyline';
//   const [selectedRoom, setSelectedRoom] = useState('');
//   const [selectedStyle, setSelectedStyle] = useState('');
//   const [customPrompt, setCustomPrompt] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [generatedImages, setGeneratedImages] = useState([]);
//   const [imageHistory, setImageHistory] = useState([]);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [apiStatus, setApiStatus] = useState('checking');
  
//   const [progress, setProgress] = useState(0);
  
//   const [showRegistrationModal, setShowRegistrationModal] = useState(false);
//   const [generationCount, setGenerationCount] = useState(0);
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [userEmail, setUserEmail] = useState('');
//   const [sessionId, setSessionId] = useState('');

//   const rooms = [
//     { id: 'master_bedroom', name: 'Master Bedroom', icon: Bed },
//     { id: 'living_room', name: 'Living Room', icon: Sofa },
//     { id: 'kitchen', name: 'Kitchen', icon: Briefcase },
//   ];

//   const styles = [
//     { id: 'modern', name: 'Modern' },
//     { id: 'scandinavian', name: 'Scandinavian' },
//     { id: 'industrial', name: 'Industrial' },
//     { id: 'minimalist', name: 'Minimalist' },
//     { id: 'traditional', name: 'Traditional' },
//     { id: 'bohemian', name: 'Bohemian' }
//   ];

//   useEffect(() => {
//     const checkApiHealth = async () => {
//       try {
//         const health = await checkHealth();
//         setApiStatus(health.status === 'healthy' ? 'connected' : 'disconnected');
//       } catch (error) {
//         setApiStatus('disconnected');
//       }
//     };
//     checkApiHealth();

//     let currentSessionId = sessionStorage.getItem('sessionId');
//     if (!currentSessionId) {
//       currentSessionId = 'web-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
//       sessionStorage.setItem('sessionId', currentSessionId);
//     }
//     setSessionId(currentSessionId);

//     try {
//       const savedHistory = sessionStorage.getItem('imageHistory');
//       if (savedHistory) {
//         const parsedHistory = JSON.parse(savedHistory);
//         setImageHistory(parsedHistory);
//         setSelectedImageIndex(0);
//         console.log('[APP] Restored', parsedHistory.length, 'images from session');
//       }
//     } catch (error) {
//       console.error('[APP] Error restoring image history:', error);
//       sessionStorage.removeItem('imageHistory');
//     }

//     const registeredEmail = localStorage.getItem('userEmail');
//     const registeredName = localStorage.getItem('userName');
//     const registeredPhone = localStorage.getItem('userPhone');
    
//     if (registeredEmail && registeredName && registeredPhone) {
//       setIsRegistered(true);
//       setUserEmail(registeredEmail);
//       setGenerationCount(0);
//       console.log('[APP] User is registered:', registeredEmail);
//     } else {
//       checkServerGenerationCount(currentSessionId);
//     }
//   }, []);

//   const checkServerGenerationCount = async (sessionId) => {
//     try {
//       const data = await checkSession(sessionId);
      
//       if (data.success) {
//         const count = data.generation_count || 0;
//         setGenerationCount(count);
//         console.log('[APP] Current generation count:', count);
        
//         if (data.is_registered) {
//           setIsRegistered(true);
//           setUserEmail(data.email || '');
//           localStorage.setItem('userEmail', data.email || '');
//         }
//       }
//     } catch (error) {
//       console.error('[APP] Error checking session:', error);
//       const localCount = parseInt(localStorage.getItem('generationCount') || '0', 10);
//       setGenerationCount(localCount);
//     }
//   };

//   const handleGenerate = async () => {
//     if (!selectedRoom) {
//       setError('Please select a room type');
//       return;
//     }

//     if (!selectedStyle && !customPrompt.trim()) {
//       setError('Please select a style or enter a custom prompt');
//       return;
//     }

//     if (!isRegistered && generationCount >= 2) {
//       console.log('[APP] Generation limit reached. Showing registration modal...');
//       setShowRegistrationModal(true);
//       setError('⚠️ You\'ve used your 2 free generations. Please register to continue.');
//       return;
//     }

//     await executeGeneration();
//   };

//   const executeGeneration = async () => {
//     setIsGenerating(true);
//     setError('');
//     setSuccess('');
//     setProgress(0);

//     try {
//       console.log('[APP] Starting generation...');
//       setProgress(10);
      
//       const result = await generateDesign(selectedRoom, selectedStyle, customPrompt, clientName);
      
//       setProgress(50);
      
//       if (!result.success) {
//         throw new Error(result.error || 'Failed to generate');
//       }

//       console.log('[APP] 🎉 Generation completed!');
//       setProgress(80);
      
//       const processedImages = [{
//         id: result.images[0].id || Date.now(),
//         url: result.images[0].image_url || result.images[0].cloudinary_url || `data:image/png;base64,${result.images[0].image_base64}`,
//         cloudinaryUrl: result.images[0].image_url || result.images[0].cloudinary_url,
//         style: result.images[0].style || selectedStyle || 'custom',
//         roomType: result.images[0].room_type || selectedRoom,
//         timestamp: Date.now()
//       }];
      
//       const newHistory = [...processedImages, ...imageHistory];
//       setImageHistory(newHistory);
      
//       try {
//         const lightweightHistory = newHistory.slice(0, 20).map(img => ({
//           id: img.id,
//           url: img.cloudinaryUrl || (img.url.startsWith('http') ? img.url : null),
//           style: img.style,
//           roomType: img.roomType,
//           timestamp: img.timestamp
//         })).filter(img => img.url && img.url.startsWith('http'));
        
//         sessionStorage.setItem('imageHistory', JSON.stringify(lightweightHistory));
//         console.log('[APP] Saved', lightweightHistory.length, 'image URLs to session');
//       } catch (error) {
//         console.error('[APP] Error saving to sessionStorage:', error);
//         sessionStorage.clear();
//       }
      
//       setSelectedImageIndex(0);
//       setSuccess('✅ Design generated successfully!');
//       setProgress(100);

//       if (!isRegistered) {
//         const newCount = generationCount + 1;
//         setGenerationCount(newCount);
//         localStorage.setItem('generationCount', newCount.toString());
        
//         try {
//           await incrementGeneration(sessionId, selectedRoom, selectedStyle, customPrompt, clientName);
//         } catch (err) {
//           console.error('[APP] Error updating server count:', err);
//         }

//         console.log('[APP] Generation count updated:', newCount);
//       }

//     } catch (err) {
//       console.error('[APP] Generation error:', err);
//       setError(err.message || 'Failed to generate design. Please try again.');
//       setProgress(0);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleRegistrationSuccess = async (email, name, phone) => {
//     console.log('[APP] Registration successful:', { email, name, phone });
    
//     localStorage.setItem('userEmail', email);
//     localStorage.setItem('userName', name);
//     localStorage.setItem('userPhone', phone);
    
//     setIsRegistered(true);
//     setUserEmail(email);
//     setGenerationCount(0);
    
//     setShowRegistrationModal(false);
    
//     setSuccess('🎉 Registration successful! You can now generate unlimited designs.');
    
//     if (selectedRoom && (selectedStyle || customPrompt.trim())) {
//       setTimeout(() => {
//         executeGeneration();
//       }, 1000);
//     }
//   };

//   const downloadImage = async (image, index) => {
//     try {
//       if (image.url.startsWith('http')) {
//         const response = await fetch(image.url);
//         const blob = await response.blob();
//         const blobUrl = URL.createObjectURL(blob);
        
//         const link = document.createElement('a');
//         link.href = blobUrl;
//         link.download = `design-${image.roomType}-${image.style}-${index + 1}.png`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(blobUrl);
//       } else {
//         const link = document.createElement('a');
//         link.href = image.url;
//         link.download = `design-${image.roomType}-${image.style}-${index + 1}.png`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       }
//     } catch (error) {
//       console.error('[APP] Download error:', error);
//       setError('Failed to download image');
//     }
//   };

//   return (
//     <div className="app-container">
//       <div className="main-content">
//         {/* Left Panel */}
//         <div className="left-panel">
//           <div className="panel-scroll">
//             <div className="section">
//               <div className="section-header">
//                 <Home size={18} color="#374151" />
//                 <h2>Select Room</h2>
//               </div>
//               <div className="room-grid">
//                 {rooms.map((room) => {
//                   const Icon = room.icon;
//                   return (
//                     <button
//                       key={room.id}
//                       onClick={() => setSelectedRoom(room.id)}
//                       className={`room-btn ${selectedRoom === room.id ? 'active' : ''}`}
//                     >
//                       <Icon size={16} />
//                       <span>{room.name}</span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="section">
//               <div className="section-header">
//                 <Sparkles size={18} color="#374151" />
//                 <h2>Choose Style</h2>
//               </div>
//               <div className="style-grid">
//                 {styles.map((style) => (
//                   <button
//                     key={style.id}
//                     onClick={() => {
//                       setSelectedStyle(style.id);
//                       setCustomPrompt('');
//                     }}
//                     className={`style-btn ${selectedStyle === style.id ? 'active' : ''}`}
//                   >
//                     <span>{style.name}</span>
//                   </button>
//                 ))}
//               </div>

//               <div className="divider">OR</div>

//               <textarea
//                 value={customPrompt}
//                 onChange={(e) => {
//                   setCustomPrompt(e.target.value);
//                   if (e.target.value.trim()) setSelectedStyle('');
//                 }}
//                 placeholder="Describe your style (e.g., Space theme kids room, Tropical paradise...)"
//                 className="custom-prompt"
//               />
//             </div>

//             <button
//               onClick={handleGenerate}
//               disabled={isGenerating || apiStatus === 'disconnected'}
//               className={`generate-btn ${isGenerating || apiStatus === 'disconnected' ? 'disabled' : ''}`}
//             >
//               {isGenerating ? (
//                 <>
//                   <Loader2 size={18} className="spin" />
//                   Generating...
//                 </>
//               ) : (
//                 <>
//                   <Sparkles size={18} />
//                   Generate Design
//                 </>
//               )}
//             </button>

//             <div className="powered-by">
//               <span>Powered by</span>
//               <img 
//                 src="/logo.png"
//                 alt="PropDeck Logo" 
//                 onError={(e) => { e.target.style.display = 'none'; }}
//               />
//             </div>

//             {success && (
//               <div className="alert success">
//                 <CheckCircle size={14} />
//                 {success}
//               </div>
//             )}

//             {error && (
//               <div className="alert error">
//                 <AlertCircle size={14} />
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Panel */}
//         <div className="right-panel">
//           <h2>Generated Designs</h2>
          
//           <div className="designs-container">
//             {imageHistory.length === 0 ? (
//               <div className="empty-state">
//                 <div>
//                   <Sparkles size={48} color="#d1d5db" />
//                   <p className="empty-title">Your AI-generated designs will appear here</p>
//                   <p className="empty-subtitle">Select a room and style, then click Generate Design</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="designs-content">
//                 {imageHistory.length > 0 && (
//                   <div className="thumbnails-section">
//                     <p className="thumbnails-label">Previous Designs ({imageHistory.length})</p>
//                     <div className="thumbnails-scroll">
//                       {imageHistory.slice(0, 5).map((img, idx) => (
//                         <button
//                           key={`thumb-${img.timestamp}-${idx}`}
//                           onClick={() => setSelectedImageIndex(idx)}
//                           className={`thumbnail ${selectedImageIndex === idx ? 'active' : ''}`}
//                         >
//                           <img src={img.url} alt={`Thumbnail ${idx + 1}`} />
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {imageHistory.map((image, index) => {
//                   if (index !== selectedImageIndex) return null;
                  
//                   return (
//                     <div key={`main-${image.timestamp}-${index}`} className="main-image-container">
//                       <div className="image-wrapper">
//                         <img src={image.url} alt={`Design ${index + 1}`} />
//                       </div>
                      
//                       <div className="image-info">
//                         <div className="image-details">
//                           <span className="room-name">{image.roomType.replace('_', ' ')}</span>
//                           <span className="style-name">{image.style}</span>
//                         </div>
                        
//                         <div className="image-actions">
//                           <button onClick={() => downloadImage(image, index)} className="action-btn" title="Download">
//                             <Download size={18} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <RegistrationModal
//         isOpen={showRegistrationModal}
//         onClose={() => {
//           if (isRegistered) {
//             setShowRegistrationModal(false);
//           }
//         }}
//         onSuccess={handleRegistrationSuccess}
//         generatedCount={generationCount}
//         sessionId={sessionId}
//       />

//       <style>{`
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }

//         html, body {
//           width: 100%;
//           height: 100%;
//           overflow: hidden;
//         }

//         .app-container {
//           width: 100%;
//           height: 100vh;
//           background: linear-gradient(135deg, #f5f3ff 0%, #ffffff 50%, #eff6ff 100%);
//           display: flex;
//           flex-direction: column;
//           overflow: hidden;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//         }

//         .main-content {
//           flex: 1;
//           width: 100%;
//           height: 100%;
//           padding: 1.5rem;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 1.5rem;
//           overflow: hidden;
//           box-sizing: border-box;
//         }

//         .left-panel, .right-panel {
//           background: white;
//           border-radius: 1rem;
//           box-shadow: 0 10px 25px rgba(0,0,0,0.1);
//           padding: 1.5rem;
//           display: flex;
//           flex-direction: column;
//           overflow: hidden;
//           min-width: 0;
//         }

//         .panel-scroll {
//           flex: 1;
//           overflow-y: auto;
//           overflow-x: hidden;
//           padding-right: 0.5rem;
//         }

//         .section {
//           margin-bottom: 1.5rem;
//         }

//         .section-header {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           margin-bottom: 1rem;
//         }

//         .section-header h2 {
//           font-size: 1.125rem;
//           font-weight: 600;
//           color: #111827;
//         }

//         .room-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 0.75rem;
//         }

//         .room-btn, .style-btn {
//           padding: 0.875rem;
//           border-radius: 0.5rem;
//           border: 2px solid #e5e7eb;
//           background: white;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.5rem;
//           transition: all 0.2s;
//           font-size: 0.875rem;
//           font-weight: 500;
//           color: #374151;
//         }

//         .room-btn:hover, .style-btn:hover {
//           border-color: #9333ea;
//           background: #faf5ff;
//         }

//         .room-btn.active, .style-btn.active {
//           border-color: #9333ea;
//           background: #faf5ff;
//           box-shadow: 0 4px 6px rgba(147,51,234,0.1);
//         }

//         .style-grid {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 0.75rem;
//           margin-bottom: 1rem;
//         }

//         .divider {
//           text-align: center;
//           color: #9ca3af;
//           font-weight: 500;
//           margin: 1rem 0;
//           font-size: 0.875rem;
//         }

//         .custom-prompt {
//           width: 100%;
//           padding: 0.875rem;
//           border: 2px solid #e5e7eb;
//           border-radius: 0.5rem;
//           resize: none;
//           height: 5rem;
//           font-size: 0.875rem;
//           font-family: inherit;
//           outline: none;
//           transition: border 0.2s;
//           color: #374151;
//         }

//         .custom-prompt:focus {
//           border-color: #9333ea;
//         }

//         .generate-btn {
//           width: 100%;
//           background: #256D11;
//           color: white;
//           padding: 1rem;
//           border-radius: 0.5rem;
//           font-weight: 600;
//           font-size: 1rem;
//           border: none;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.5rem;
//           box-shadow: 0 10px 15px rgba(37,109,17,0.3);
//           transition: all 0.2s;
//           margin-bottom: 1.5rem;
//         }

//         .generate-btn:hover:not(.disabled) {
//           background: #1e5a0d;
//           transform: translateY(-2px);
//         }

//         .generate-btn.disabled {
//           background: #d1d5db;
//           cursor: not-allowed;
//         }

//         .powered-by {
//           text-align: center;
//           margin: 1.5rem 0 1rem;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.5rem;
//           font-size: 1.125rem;
//           color: #6b7280;
//           font-weight: 600;
//           font-style: italic;
//         }

//         .powered-by img {
//           height: 24px;
//           width: auto;
//         }

//         .alert {
//           margin-bottom: 0.75rem;
//           padding: 0.75rem;
//           border-radius: 0.5rem;
//           font-size: 0.875rem;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//         }

//         .alert.success {
//           background: #ecfdf5;
//           border: 1px solid #10b981;
//           color: #047857;
//         }

//         .alert.error {
//           background: #fef2f2;
//           border: 1px solid #ef4444;
//           color: #dc2626;
//         }

//         .right-panel h2 {
//           font-size: 1.25rem;
//           font-weight: 600;
//           color: #111827;
//           margin-bottom: 1rem;
//         }

//         .designs-container {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           overflow: hidden;
//           min-height: 0;
//         }

//         .empty-state {
//           height: 100%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: #f9fafb;
//           border-radius: 0.75rem;
//           border: 2px dashed #d1d5db;
//           text-align: center;
//           padding: 2rem;
//         }

//         .empty-title {
//           color: #9ca3af;
//           font-size: 1rem;
//           margin: 1rem 0 0.5rem;
//         }

//         .empty-subtitle {
//           color: #d1d5db;
//           font-size: 0.875rem;
//         }

//         .designs-content {
//           display: flex;
//           flex-direction: column;
//           gap: 1rem;
//           height: 100%;
//           overflow: hidden;
//           min-height: 0;
//         }

//         .thumbnails-section {
//           flex-shrink: 0;
//         }

//         .thumbnails-label {
//           font-size: 0.75rem;
//           color: #6b7280;
//           margin-bottom: 0.5rem;
//           font-weight: 500;
//         }

//         .thumbnails-scroll {
//           display: flex;
//           gap: 0.5rem;
//           overflow-x: auto;
//           padding-bottom: 0.5rem;
//         }

//         .thumbnail {
//           min-width: 60px;
//           height: 60px;
//           border: 2px solid #e5e7eb;
//           border-radius: 0.5rem;
//           overflow: hidden;
//           cursor: pointer;
//           padding: 0;
//           background: none;
//           transition: all 0.2s;
//           flex-shrink: 0;
//         }

//         .thumbnail.active {
//           border: 3px solid #9333ea;
//           box-shadow: 0 4px 6px rgba(147,51,234,0.3);
//         }

//         .thumbnail img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .main-image-container {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           gap: 0.75rem;
//           min-height: 0;
//           overflow: hidden;
//         }

//         .image-wrapper {
//           position: relative;
//           width: 100%;
//           flex: 1;
//           border-radius: 0.75rem;
//           overflow: hidden;
//           box-shadow: 0 4px 6px rgba(0,0,0,0.1);
//           background: #f9fafb;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           min-height: 0;
//         }

//         .image-wrapper img {
//           max-width: 100%;
//           max-height: 100%;
//           width: auto;
//           height: auto;
//           object-fit: contain;
//           display: block;
//         }

//         .image-info {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           flex-shrink: 0;
//         }

//         .image-details {
//           display: flex;
//           flex-direction: column;
//           gap: 0.25rem;
//         }

//         .room-name {
//           font-size: 0.875rem;
//           color: #111827;
//           font-weight: 600;
//           text-transform: capitalize;
//         }

//         .style-name {
//           font-size: 0.75rem;
//           color: #9333ea;
//           font-weight: 500;
//           text-transform: capitalize;
//         }

//         .image-actions {
//           display: flex;
//           gap: 0.5rem;
//         }

//         .action-btn {
//           background: white;
//           color: #111827;
//           padding: 0.625rem;
//           border-radius: 50%;
//           font-weight: 600;
//           border: 2px solid #e5e7eb;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.05);
//           width: 45px;
//           height: 45px;
//           transition: all 0.2s;
//         }

//         .action-btn:hover {
//           border-color: #9333ea;
//           background: #faf5ff;
//           transform: scale(1.05);
//         }

//         .spin {
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }

//         ::-webkit-scrollbar {
//           width: 6px;
//           height: 6px;
//         }

//         ::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }

//         ::-webkit-scrollbar-thumb {
//           background: #9333ea;
//           border-radius: 10px;
//         }

//         ::-webkit-scrollbar-thumb:hover {
//           background: #7c3aed;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default App;