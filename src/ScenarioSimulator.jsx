import React, { useState, useEffect } from 'react';
import { ChevronLeft, Sparkles, X, Loader2, AlertCircle } from 'lucide-react';
import { generateScenario, getPreGeneratedScenarios, getRandomScenarios } from './api';

const ScenarioSimulator = ({ onBack }) => {
  const [scenarioText, setScenarioText] = useState('');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [loadedBatches, setLoadedBatches] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [error, setError] = useState('');

  // Load first batch of scenarios on mount
  useEffect(() => {
    loadPreGeneratedScenarios();
  }, []);

  const loadPreGeneratedScenarios = async () => {
    try {
      const result = await getRandomScenarios();
      if (result.success && result.scenarios) {
        setScenarios(result.scenarios);
        setLoadedBatches(1);
      }
    } catch (err) {
      console.error('Failed to load scenarios:', err);
      setError('Failed to load example scenarios');
    }
  };

  // Handle Enter key - Generate CUSTOM scenario from text input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
      e.preventDefault();
      handleGenerateCustomScenario();
    }
  };

  // Generate custom scenario from user input
  const handleGenerateCustomScenario = async () => {
    if (!scenarioText.trim()) {
      setError('Please describe your scenario');
      return;
    }

    if (scenarioText.length < 10) {
      setError('Please provide more details (minimum 10 characters)');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      console.log('🚀 [CUSTOM] Generating scenario for:', scenarioText);
      const result = await generateScenario(scenarioText);
      
      if (result.success) {
        const newScenario = {
          id: Date.now(),
          image_url: `data:image/svg+xml;base64,${result.image_base64}`,
          title: result.title,
          description: result.story.join('\n\n'),
          tagline: result.tagline,
          story: result.story
        };
        
        // Add to TOP of list
        setScenarios([newScenario, ...scenarios]);
        
        // Clear input
        setScenarioText('');
        
        // Auto-open the generated scenario
        setSelectedScenario(newScenario);
        
        console.log('✅ [CUSTOM] Scenario generated successfully!');
      } else {
        setError(result.error || 'Generation failed');
      }
    } catch (err) {
      console.error('❌ [CUSTOM] Generation error:', err);
      setError(err.message || 'Failed to generate scenario. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function with retry logic for rate limits
  const generateScenarioWithRetry = async (scenarioText, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await generateScenario(scenarioText);
        return result;
      } catch (error) {
        console.warn(`[RETRY] Attempt ${attempt}/${maxRetries} failed:`, error.message);
        
        if (attempt < maxRetries) {
          const delay = attempt * 2000;
          console.log(`[RETRY] Waiting ${delay/1000}s before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
  };

  // Get next 5 SEQUENTIAL scenarios from pool
  const handleGenerateMoreScenarios = async () => {
    if (loadedBatches >= 8) {
      console.log('🔄 [RESET] All 8 batches shown, starting over...');
      setLoadedBatches(0);
      setScenarios([]);
    }

    setIsGeneratingMore(true);
    setError('');

    try {
      console.log(`🔄 [SEQUENTIAL] Loading batch ${loadedBatches + 1}/8...`);
      
      const result = await getRandomScenarios();
      
      if (result.success && result.scenarios) {
        console.log(`✅ [SEQUENTIAL] Got batch ${result.batch_number}/8 with ${result.scenarios.length} scenarios!`);
        
        setScenarios([...result.scenarios, ...scenarios]);
        setLoadedBatches(prev => prev + 1);
      } else {
        setError('Failed to load scenarios. Please try again.');
      }
    } catch (err) {
      console.error('❌ [SEQUENTIAL] Error fetching scenarios:', err);
      setError('Failed to load new scenarios. Please try again.');
    } finally {
      setIsGeneratingMore(false);
    }
  };

  const handleScenarioClick = (scenario) => {
    setSelectedScenario(scenario);
  };

  const handleCloseDetail = () => {
    setSelectedScenario(null);
  };

  // Helper function to render formatted text with line breaks
  const renderFormattedText = (text) => {
    if (!text) return null;
    
    return text.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Helper function to extract and clean tagline
  const extractTagline = (scenario) => {
    // First check if tagline exists as a separate field
    if (scenario.tagline && !scenario.tagline.includes('**Tagline:**')) {
      return scenario.tagline.trim();
    }
    
    // Check if tagline is embedded in description or story
    const textToSearch = scenario.description || (scenario.story ? scenario.story.join('\n') : '');
    
    // Look for **Tagline:** pattern
    const taglineMatch = textToSearch.match(/\*\*Tagline:\*\*\s*(.+?)(?:\n|$)/i);
    if (taglineMatch) {
      return taglineMatch[1].trim();
    }
    
    // If tagline field exists but has markdown, clean it
    if (scenario.tagline) {
      return scenario.tagline
        .replace(/\*\*Tagline:\*\*/i, '')
        .replace(/\*\*/g, '')
        .trim();
    }
    
    return null;
  };

  // Helper function to remove tagline from description
  const getDescriptionWithoutTagline = (text) => {
    if (!text) return text;
    return text.replace(/\*\*Tagline:\*\*\s*.+?(?:\n|$)/gi, '').trim();
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 998,
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={onBack}
      />

      {/* Close Button - White with Green Icon */}
      <button
        onClick={onBack}
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: 'none',
          background: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          zIndex: 1001
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Main Modal Container */}
      <div style={{
        position: 'fixed',
        top: '90px',
        left: 0,
        right: 0,
        bottom: 0,
        background: 'white',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        zIndex: 999,
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'hidden'
      }}>
        {/* Header - Always Visible */}
        <div style={{
          padding: '1.5rem 3rem 0 3rem',
          flexShrink: 0,
          background: 'white',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem',
            paddingBottom: '0.75rem'
          }}>
            <ChevronLeft size={28} color="#1f2937" strokeWidth={2.5} />
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              margin: 0,
              color: '#1f2937'
            }}>
              Scenario Simulator
            </h1>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          background: '#f5f1e8'
        }}>
          {/* Horizontal Layout for Label and Input - Hide when scenario is selected */}
          {!selectedScenario && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              marginBottom: '2rem',
              width: '100%',
              padding: '1.5rem 3rem 0 3rem',
              background: '#f5f1e8'
            }}>
              <label style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1f2937',
                whiteSpace: 'nowrap',
                minWidth: 'fit-content'
              }}>
                Describe you scenario:
              </label>
              
              <input
                type="text"
                placeholder="Explain your unique scenario"
                value={scenarioText}
                onChange={(e) => {
                  setScenarioText(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                disabled={isGenerating}
                style={{
                  flex: 1,
                  padding: '0.875rem 1.25rem',
                  fontSize: '0.95rem',
                  border: error ? '1.5px solid #ef4444' : '1.5px solid #e5e7eb',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  opacity: isGenerating ? 0.6 : 1,
                  background: 'white',
                  color: '#6b7280'
                }}
                onFocus={(e) => {
                  if (!error) {
                    e.target.style.borderColor = '#10b981';
                  }
                }}
                onBlur={(e) => {
                  if (!error) {
                    e.target.style.borderColor = '#e5e7eb';
                  }
                }}
              />
            </div>
          )}
          
          {error && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '0.875rem 1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              color: '#dc2626',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 3rem 1.5rem 3rem'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {isGenerating && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '0.875rem 1rem',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '10px',
              color: '#1e40af',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 3rem 1.5rem 3rem'
            }}>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Generating your custom scenario...
            </div>
          )}

          {/* Scenario Cards Grid */}
          {!selectedScenario && scenarios.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem',
              padding: '0 3rem'
            }}>
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  onClick={() => !isGenerating && !isGeneratingMore && handleScenarioClick(scenario)}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: (isGenerating || isGeneratingMore) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                    opacity: (isGenerating || isGeneratingMore) ? 0.6 : 1,
                    border: '1px solid #e5e7eb'
                  }}
                  onMouseEnter={(e) => {
                    if (!isGenerating && !isGeneratingMore) {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {/* Image Container with Inner Frame */}
                  <div style={{
                    padding: '0.75rem',
                    background: 'white'
                  }}>
                    <div style={{
                      position: 'relative',
                      paddingBottom: '60%',
                      background: '#f9fafb',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #e5e7eb'
                    }}>
                      <img
                        src={scenario.image_url}
                        alt={scenario.title}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Text Container */}
                  <div style={{
                    padding: '0.75rem 1rem 1.25rem 1rem'
                  }}>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#1f2937',
                      lineHeight: '1.5',
                      margin: 0,
                      fontWeight: '500',
                      textAlign: 'center'
                    }}>
                      {scenario.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Generate More Button */}
          {!selectedScenario && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: '2rem',
              padding: '0 3rem 2rem 3rem'
            }}>
              <button
                onClick={handleGenerateMoreScenarios}
                disabled={isGeneratingMore || isGenerating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '1rem 2.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: (isGeneratingMore || isGenerating) ? '#9ca3af' : '#1f2937',
                  background: 'white',
                  border: (isGeneratingMore || isGenerating) 
                    ? '2px solid #e5e7eb' 
                    : '2px solid #10b981',
                  borderRadius: '50px',
                  cursor: (isGeneratingMore || isGenerating) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: (isGeneratingMore || isGenerating) 
                    ? 'none' 
                    : '0 2px 8px rgba(16, 185, 129, 0.2)',
                  opacity: (isGeneratingMore || isGenerating) ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isGeneratingMore && !isGenerating) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isGeneratingMore && !isGenerating) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
                  }
                }}
              >
                {isGeneratingMore ? (
                  <>
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    Loading batch {loadedBatches + 1}/8...
                  </>
                ) : loadedBatches >= 8 ? (
                  <>
                    <Sparkles size={20} />
                    Start Over (Batch 1/8)
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate More 
                  </>
                )}
              </button>
            </div>
          )}

          {/* Detail View - White Card Container with Padding */}
          {selectedScenario && (
            <div style={{
              padding: '2rem 3rem',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              {/* White Card Container */}
              <div style={{
                position: 'relative',
                background: 'white',
                borderRadius: '20px',
                padding: '2.5rem',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                maxWidth: '1400px',
                margin: '0 auto'
              }}>
                {/* Close Button - Inside Card Padding */}
                <button
                  onClick={handleCloseDetail}
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: '#f3f4f6',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.625rem',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '50%',
                    color: '#6b7280',
                    transition: 'all 0.2s',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e5e7eb';
                    e.currentTarget.style.color = '#111827';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  <X size={24} />
                </button>

                {/* Content Layout */}
                <div style={{
                  display: 'flex',
                  gap: '2.5rem',
                  flexWrap: 'wrap'
                }}>
                  {/* Left Side - Image */}
                  <div style={{
                    flex: '0 0 340px',
                    minWidth: '300px'
                  }}>
                    <img
                      src={selectedScenario.image_url}
                      alt={selectedScenario.title}
                      style={{
                        width: '100%',
                        borderRadius: '20px',
                        marginBottom: '1.25rem',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                      }}
                    />
                    <p style={{
                      fontSize: '1rem',
                      color: '#374151',
                      textAlign: 'center',
                      margin: 0,
                      fontWeight: '600',
                      lineHeight: '1.5'
                    }}>
                      {selectedScenario.title}
                    </p>
                  </div>

                  {/* Right Side - Content */}
                  <div style={{
                    flex: '1',
                    minWidth: '320px'
                  }}>
                    <h2 style={{
                      fontSize: '1.875rem',
                      fontWeight: '700',
                      marginBottom: '1.75rem',
                      color: '#111827',
                      lineHeight: '1.3'
                    }}>
                      {selectedScenario.title}
                    </h2>

                    {/* FIXED SECTION - Properly formatted description without tagline */}
                    <div style={{
                      fontSize: '1.05rem',
                      lineHeight: '1.8',
                      color: '#374151',
                      marginBottom: '1.75rem'
                    }}>
                      {selectedScenario.story ? (
                        selectedScenario.story.map((paragraph, idx) => {
                          const cleanedParagraph = getDescriptionWithoutTagline(paragraph);
                          if (!cleanedParagraph) return null;
                          return (
                            <p key={idx} style={{ marginBottom: '1.25rem' }}>
                              {renderFormattedText(cleanedParagraph)}
                            </p>
                          );
                        })
                      ) : (
                        <p style={{ whiteSpace: 'pre-wrap' }}>
                          {renderFormattedText(getDescriptionWithoutTagline(selectedScenario.description))}
                        </p>
                      )}
                    </div>

                    {/* FIXED TAGLINE - Extract and display in orange box */}
                    {extractTagline(selectedScenario) && (
                      <div style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white',
                        padding: '1.5rem',
                        borderRadius: '14px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        textAlign: 'center',
                        boxShadow: '0 4px 16px rgba(245, 158, 11, 0.25)'
                      }}>
                        {extractTagline(selectedScenario)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default ScenarioSimulator;