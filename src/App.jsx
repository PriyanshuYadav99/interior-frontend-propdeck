

import React, { useState } from 'react';
import { Sparkles, Download, Home, Bed, Briefcase, Loader2, AlertCircle, CheckCircle, Sofa, ChevronDown, Grid3x3, MapPin, Clock } from 'lucide-react';
import { generateDesign } from './api';
// ✅ IMPORT YOUR ACTUAL SCENARIO SIMULATOR (make sure path is correct)
import ScenarioSimulator from './ScenarioSimulator';

// ❌ DELETE THIS ENTIRE PLACEHOLDER COMPONENT - IT'S CAUSING THE ISSUE
// const ScenarioSimulator = ({ onBack }) => {
//   return (
//     <div style={{ padding: '2rem' }}>
//       <button 
//         onClick={onBack}
//         style={{
//           padding: '0.5rem 1rem',
//           background: '#10b981',
//           color: 'white',
//           border: 'none',
//           borderRadius: '8px',
//           cursor: 'pointer',
//           marginBottom: '1rem'
//         }}
//       >
//         ← Back to Home
//       </button>
//       <h1>Scenario Simulator Page</h1>
//       <p>Your ScenarioSimulator component will render here</p>
//     </div>
//   );
// };

const FeaturesModal = ({ isOpen, onClose, onFeatureSelect }) => {
  if (!isOpen) return null;
  
  const features = [
    {
      id: 'scenario',
      title: 'Scenario Simulator',
      icon: Grid3x3,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      id: 'virtual-tour',
      title: 'Virtual Tour',
      icon: MapPin,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    },
    {
      id: 'life-in-day',
      title: 'Life in a Day',
      icon: Clock,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    }
  ];

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={onClose}
      />

      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          background: '#10b981',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          zIndex: 1001
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
        }}
      >
        <ChevronDown size={28} color="white" strokeWidth={3} />
      </button>

      <div style={{
        position: 'fixed',
        top: '120px',
        left: 0,
        right: 0,
        bottom: 0,
        background: 'white',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        zIndex: 1000,
        padding: '3rem 2rem',
        paddingBottom: '3rem',
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
        overflowY: 'auto'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          padding: '2rem 1rem',
          minHeight: '100%'
        }}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                style={{
                  width: '180px',
                  height: '200px',
                  border: 'none',
                  borderRadius: '16px',
                  background: feature.gradient,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onClick={() => {
                  console.log(`Clicked: ${feature.title}`);
                  onFeatureSelect(feature.id);
                  onClose();
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.1
                }}>
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id={`pattern-${feature.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="15" fill="white" opacity="0.3"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#pattern-${feature.id})`}/>
                  </svg>
                </div>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  zIndex: 1
                }}>
                  <Icon size={40} color="white" strokeWidth={2} />
                </div>
                <span style={{
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  zIndex: 1,
                  lineHeight: '1.3'
                }}>
                  {feature.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageHistory, setImageHistory] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  const rooms = [
    { id: 'master_bedroom', name: 'Master Bedroom', icon: Bed },
    { id: 'living_room', name: 'Living Room', icon: Sofa },
    { id: 'kitchen', name: 'Kitchen', icon: Briefcase },
  ];

  const styles = [
    { id: 'modern', name: 'Modern' },
    { id: 'scandinavian', name: 'Scandinavian' },
    { id: 'industrial', name: 'Industrial' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'traditional', name: 'Traditional' },
    { id: 'bohemian', name: 'Bohemian' }
  ];

  const handleFeatureSelect = (featureId) => {
    console.log('Feature selected:', featureId);
    setCurrentPage(featureId);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  // ✅ THIS IS WHERE YOUR SCENARIO SIMULATOR RENDERS
  if (currentPage === 'scenario') {
    return <ScenarioSimulator onBack={handleBackToHome} />;
  }

  if (currentPage === 'virtual-tour') {
    return (
      <div style={{ padding: '2rem' }}>
        <button onClick={handleBackToHome} style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '1rem' }}>
          ← Back to Home
        </button>
        <h1>Virtual Tour</h1>
        <p>Virtual Tour component will be here</p>
      </div>
    );
  }

  if (currentPage === 'life-in-day') {
    return (
      <div style={{ padding: '2rem' }}>
        <button onClick={handleBackToHome} style={{ padding: '0.5rem 1rem', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '1rem' }}>
          ← Back to Home
        </button>
        <h1>Life in a Day</h1>
        <p>Life in a Day component will be here</p>
      </div>
    );
  }

  const handleGenerate = async () => {
  if (!selectedRoom) {
    setError('Please select a room type');
    return;
  }

  if (!selectedStyle && !customPrompt.trim()) {
    setError('Please select a style or enter a custom prompt');
    return;
  }

  setIsGenerating(true);
  setError('');
  setSuccess('');

  try {
    // ✅ CALL YOUR REAL API
    const result = await generateDesign(
      selectedRoom,
      selectedStyle,
      customPrompt,
      'skyline', // client_name
      'imagen3'  // model
    );

    if (result.success && result.images && result.images.length > 0) {
      const generatedImage = result.images[0];
      
      // ✅ USE THE ACTUAL GENERATED IMAGE
      const newImage = {
        id: Date.now(),
        url: `data:image/png;base64,${generatedImage.image_base64}`, // ✅ Real image!
        style: selectedStyle || 'custom',
        roomType: selectedRoom,
        timestamp: Date.now()
      };
      
      setImageHistory([newImage, ...imageHistory]);
      setSelectedImageIndex(0);
      setSuccess('✅ Design generated successfully!');
    } else {
      setError('Generation failed. Please try again.');
    }
  } catch (error) {
    console.error('Generation error:', error);
    setError(error.message || 'Failed to generate design');
  } finally {
    setIsGenerating(false);
  }
};

  const downloadImage = (image, index) => {
    console.log('Download image:', image);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 50%, #eff6ff 100%)', padding: '0.5rem' }}>
      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '0.75rem',
          background: 'white',
          borderRadius: '0.75rem',
          padding: '0.75rem',
          position: 'relative'
        }}>
          {/* Left Panel */}
          <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 8px 20px rgba(0,0,0,0.08)', padding: '1rem', display: 'flex', flexDirection: 'column', height: '520px' }}>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.625rem' }}>
                  <Home size={16} color="#374151" />
                  <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111827', margin: 0 }}>Select Room</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {rooms.map((room) => {
                    const Icon = room.icon;
                    return (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room.id)}
                        style={{
                          padding: '0.625rem 0.5rem',
                          borderRadius: '0.4rem',
                          border: selectedRoom === room.id ? '2px solid #9333ea' : '2px solid #e5e7eb',
                          background: selectedRoom === room.id ? '#faf5ff' : 'white',
                          boxShadow: selectedRoom === room.id ? '0 3px 5px rgba(147,51,234,0.1)' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Icon size={14} />
                        <span style={{ fontWeight: '500', fontSize: '0.8rem' }}>{room.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.625rem' }}>
                  <Sparkles size={16} color="#374151" />
                  <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111827', margin: 0 }}>Choose Style</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.45rem', marginBottom: '0.625rem' }}>
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => {
                        setSelectedStyle(style.id);
                        setCustomPrompt('');
                      }}
                      style={{
                        padding: '0.5rem 0.375rem',
                        borderRadius: '0.4rem',
                        border: selectedStyle === style.id ? '2px solid #9333ea' : '2px solid #e5e7eb',
                        background: selectedStyle === style.id ? '#faf5ff' : 'white',
                        boxShadow: selectedStyle === style.id ? '0 3px 5px rgba(147,51,234,0.1)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontWeight: '500', fontSize: '0.75rem' }}>{style.name}</span>
                    </button>
                  ))}
                </div>

                <div style={{ textAlign: 'center', color: '#9ca3af', fontWeight: '500', margin: '0.5rem 0', fontSize: '0.7rem' }}>OR</div>

                <textarea
                  value={customPrompt}
                  onChange={(e) => {
                    setCustomPrompt(e.target.value);
                    if (e.target.value.trim()) setSelectedStyle('');
                  }}
                  placeholder="Describe your style (e.g., Space theme kids room...)"
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.4rem',
                    resize: 'none',
                    height: '2.75rem',
                    fontSize: '0.75rem',
                    outline: 'none',
                    transition: 'border 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                style={{
                  width: '100%',
                  background: isGenerating ? '#d1d5db' : '#256D11',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.4rem',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 8px 12px rgba(37,109,17,0.25)',
                  transition: 'all 0.2s',
                  marginBottom: '0.5rem'
                }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate Design
                  </>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: '0.5rem', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '600', fontStyle: 'italic' }}>
                Powered by
               </span>
               <img 
                src="/logo.png"
                alt="PropDeck Logo" 
                style={{ height: '18px', width: 'auto' }}
              />
            </div>

              {success && (
                <div style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '0.4rem', color: '#047857', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <CheckCircle size={12} />
                  {success}
                </div>
              )}

              {error && (
                <div style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#fef2f2', border: '1px solid #ef4444', borderRadius: '0.4rem', color: '#dc2626', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <AlertCircle size={12} />
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 8px 20px rgba(0,0,0,0.08)', padding: '1rem', display: 'flex', flexDirection: 'column', height: '520px', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              zIndex: 10
            }}>
              <button
                onClick={() => setShowFeaturesModal(true)}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#10b981',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.35)';
                }}
              >
                <Sparkles size={24} color="white" strokeWidth={2} />
              </button>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingBottom: '4rem' }}>
              {imageHistory.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', borderRadius: '0.5rem', border: '2px dashed #d1d5db' }}>
                  <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <Sparkles size={40} color="#d1d5db" style={{ margin: '0 auto 0.75rem' }} />
                    <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '0.375rem', fontWeight: '500' }}>
                      Your AI-generated designs will appear here
                    </p>
                    <p style={{ color: '#d1d5db', fontSize: '0.75rem' }}>
                      Select a room and style, then click Generate Design
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', height: '100%' }}>
                  {imageHistory.length > 0 && (
                    <div style={{ flexShrink: 0 }}>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: '600' }}>
                        Previous Designs ({imageHistory.length})
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.5rem', 
                        overflowX: 'auto', 
                        paddingBottom: '0.375rem'
                      }}>
                        {imageHistory.slice(0, 5).map((img, idx) => (
                          <button
                            key={`thumb-${img.timestamp}-${idx}`}
                            onClick={() => setSelectedImageIndex(idx)}
                            style={{
                              minWidth: '55px',
                              height: '55px',
                              border: selectedImageIndex === idx ? '2.5px solid #9333ea' : '2px solid #e5e7eb',
                              borderRadius: '0.4rem',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              padding: 0,
                              background: 'none',
                              transition: 'all 0.2s',
                              boxShadow: selectedImageIndex === idx ? '0 3px 5px rgba(147,51,234,0.25)' : 'none'
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
                          borderRadius: '0.5rem', 
                          overflow: 'hidden',
                          boxShadow: '0 3px 5px rgba(0,0,0,0.08)',
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
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '600', textTransform: 'capitalize' }}>
                              {image.roomType.replace('_', ' ')}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#9333ea', fontWeight: '500', textTransform: 'capitalize' }}>
                              {image.style}
                            </span>
                          </div>
                          
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
                              boxShadow: '0 2px 3px rgba(0,0,0,0.05)',
                              width: '40px',
                              height: '40px',
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
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <FeaturesModal 
        isOpen={showFeaturesModal} 
        onClose={() => setShowFeaturesModal(false)}
        onFeatureSelect={handleFeatureSelect}
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        * {
          box-sizing: border-box;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background: #9333ea;
          border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #7c3aed;
        }
      `}</style>
    </div>
  );
};

export default App;