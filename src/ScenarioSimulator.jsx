import React, { useState, useEffect } from 'react';
import { ChevronLeft, Sparkles, X, Loader2, AlertCircle, Clock, VolumeX, Shield, Home, Building } from 'lucide-react';

// Mock API functions (replace with your actual API)
const generateScenario = async (text) => {
  const response = await fetch('https://interior-backend-production.up.railway.app/api/scenario/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      scenario_text: text
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate scenario');
  }
  
  return await response.json();
};

const getRandomScenarios = async () => {
  const response = await fetch('https://interior-backend-production.up.railway.app/api/scenario/random', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch scenarios');
  }
  
  return await response.json();
};

const iconMap = {
  clock: Clock,
  volume: VolumeX,
  shield: Shield,
  home: Home,
  building: Building
};

const ScenarioSimulator = ({ onBack }) => {
  const [scenarioText, setScenarioText] = useState('');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [highlightedIds, setHighlightedIds] = useState([]);
  const [loadedBatches, setLoadedBatches] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [error, setError] = useState('');

  // Load first batch on mount
  useEffect(() => {
    loadInitialScenarios();
  }, []);

  const loadInitialScenarios = async () => {
    try {
      const result = await getRandomScenarios();
      if (result.success && result.scenarios) {
        setScenarios(result.scenarios);
        setLoadedBatches(1);
        // Highlight 2 random scenarios
        highlightRandomScenarios(result.scenarios);
      }
    } catch (err) {
      console.error('Failed to load scenarios:', err);
      setError('Failed to load example scenarios');
    }
  };

  const highlightRandomScenarios = (newScenarios) => {
  if (newScenarios.length < 2) return;
  
  // Always pick 2 random from the NEW batch only
  const shuffled = [...newScenarios].sort(() => Math.random() - 0.5);
  const highlighted = shuffled.slice(0, 2).map(s => s.id);
  
  // REPLACE old highlights, don't add to them
  setHighlightedIds(highlighted);
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
      e.preventDefault();
      handleGenerateCustomScenario();
    }
  };

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
      const result = await generateScenario(scenarioText);
      
      if (result.success) {
        const newScenario = {
          id: Date.now(),
          title: result.title,
          story: result.story,
          tagline: result.tagline,
          icon: 'building',
          category: 'custom'
        };
        
        setScenarios([newScenario, ...scenarios]);
        setScenarioText('');
        setSelectedScenario(newScenario);
      } else {
        setError(result.error || 'Generation failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate scenario. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMoreScenarios = async () => {
    if (loadedBatches >= 7) {
      setLoadedBatches(0);
      setScenarios([]);
      loadInitialScenarios();
      return;
    }

    setIsGeneratingMore(true);
    setError('');

    try {
      const result = await getRandomScenarios();
      
      if (result.success && result.scenarios) {
        const newScenarios = [...scenarios, ...result.scenarios];
        setScenarios(newScenarios);
        setLoadedBatches(prev => prev + 1);
        
        // Highlight 2 random from NEW batch only
        highlightRandomScenarios(result.scenarios);
      } else {
        setError('Failed to load scenarios. Please try again.');
      }
    } catch (err) {
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

  const renderFormattedText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const getDescriptionWithoutTagline = (text) => {
    if (!text) return text;
    return text.replace(/\*\*Tagline:\*\*\s*.+?(?:\n|$)/gi, '').trim();
  };

  const extractTagline = (scenario) => {
    if (scenario.tagline && !scenario.tagline.includes('**Tagline:**')) {
      return scenario.tagline.trim();
    }
    
    const textToSearch = scenario.description || (scenario.story ? scenario.story.join('\n') : '');
    const taglineMatch = textToSearch.match(/\*\*Tagline:\*\*\s*(.+?)(?:\n|$)/i);
    
    if (taglineMatch) {
      return taglineMatch[1].trim();
    }
    
    if (scenario.tagline) {
      return scenario.tagline.replace(/\*\*Tagline:\*\*/i, '').replace(/\*\*/g, '').trim();
    }
    
    return null;
  };

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
          zIndex: 998,
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={onBack}
      />

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
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
        }}
      >
        <ChevronLeft size={24} color="#10b981" strokeWidth={2.5} style={{ transform: 'rotate(90deg)' }} />
      </button>

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

        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          background: '#f5f1e8'
        }}>
          {!selectedScenario && (
            <>
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
                    opacity: isGenerating ? 0.6 : 1,
                    background: 'white',
                    color: '#6b7280'
                  }}
                  onFocus={(e) => {
                    if (!error) e.target.style.borderColor = '#10b981';
                  }}
                  onBlur={(e) => {
                    if (!error) e.target.style.borderColor = '#e5e7eb';
                  }}
                />
              </div>

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

              {scenarios.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '2rem',
                  padding: '0 3rem',
                  justifyContent: 'flex-start'
                }}>
                  {scenarios.map((scenario) => {
                    const Icon = iconMap[scenario.icon] || Building;
                    const isHighlighted = highlightedIds.includes(scenario.id);
                    
                    return (
                      <button
                        key={scenario.id}
                        onClick={() => !isGenerating && !isGeneratingMore && handleScenarioClick(scenario)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1.25rem',
                          background: 'white',
                          border: isHighlighted 
                            ? '2px solid transparent'
                            : '2px solid #e5e7eb',
                          backgroundImage: isHighlighted
                            ? 'linear-gradient(white, white), linear-gradient(135deg, #10b981, #059669)'
                            : 'none',
                          backgroundOrigin: 'border-box',
                          backgroundClip: 'padding-box, border-box',
                          borderRadius: '50px',
                          cursor: (isGenerating || isGeneratingMore) ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s ease',
                          opacity: (isGenerating || isGeneratingMore) ? 0.6 : 1,
                          textAlign: 'left',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                          color: '#374151',
                          boxShadow: isHighlighted 
                            ? '0 4px 12px rgba(16, 185, 129, 0.2)'
                            : '0 1px 3px rgba(0, 0, 0, 0.1)',
                          minWidth: '180px',
                          maxWidth: 'fit-content',
                          width: 'auto',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          if (!isGenerating && !isGeneratingMore) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = isHighlighted
                              ? '0 6px 16px rgba(16, 185, 129, 0.3)'
                              : '0 4px 8px rgba(0, 0, 0, 0.15)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = isHighlighted
                            ? '0 4px 12px rgba(16, 185, 129, 0.2)'
                            : '0 1px 3px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: isHighlighted 
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Icon size={18} color={isHighlighted ? 'white' : '#6b7280'} />
                        </div>
                        <span>{scenario.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}

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
                      Loading batch {loadedBatches + 1}/7...
                    </>
                  ) : loadedBatches >= 7 ? (
                    <>
                      <Sparkles size={20} />
                      Start Over (Batch 1/7)
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate More 
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {selectedScenario && (
            <div style={{
              padding: '2rem 3rem',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <div style={{
                position: 'relative',
                background: 'white',
                borderRadius: '20px',
                padding: '2.5rem',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                margin: '0 auto',
                margin: '0 auto'
              }}>
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
                    transition: 'all 0.2s'
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

                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  marginBottom: '1.75rem',
                  color: '#111827',
                  lineHeight: '1.3',
                  paddingRight: '3rem'
                }}>
                  {selectedScenario.title}
                </h2>

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
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
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