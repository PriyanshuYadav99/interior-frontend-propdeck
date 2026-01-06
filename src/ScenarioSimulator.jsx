// import React, { useState } from 'react';
// import { ChevronLeft, Sparkles, X } from 'lucide-react';

// const ScenarioSimulator = () => {
//   const [scenarioText, setScenarioText] = useState('');
//   const [selectedScenario, setSelectedScenario] = useState(null);
//   const [scenarios, setScenarios] = useState([
//     {
//       id: 1,
//       image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop',
//       title: 'School-going children, daily travel during peak hours.',
//       description: 'Family with kids needing safe school commute'
//     },
//     {
//       id: 2,
//       image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
//       title: 'Family with kids, sensitive to noise and calm surroundings.',
//       description: 'Peaceful environment for growing family'
//     },
//     {
//       id: 3,
//       image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
//       title: 'Parents cautious about monsoon safety and access roads.',
//       description: 'Weather-resistant infrastructure priority'
//     },
//     {
//       id: 4,
//       image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
//       title: 'Family leisure focused on nearby lake and temple.',
//       description: 'Proximity to recreational and spiritual spaces'
//     },
//     {
//       id: 5,
//       image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
//       title: 'Long-term family living amid future area development.',
//       description: 'Investment in growing neighborhood'
//     }
//   ]);

//   const handleGenerateMore = () => {
//     // This will be connected to backend later
//     console.log('Generate more scenarios for:', scenarioText);
//   };

//   const handleScenarioClick = (scenario) => {
//     setSelectedScenario(scenario);
//   };

//   const handleCloseDetail = () => {
//     setSelectedScenario(null);
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: '#f5f5f5',
//       padding: '2rem'
//     }}>
//       {/* Header */}
//       <div style={{
//         display: 'flex',
//         alignItems: 'center',
//         gap: '1rem',
//         marginBottom: '2rem'
//       }}>
//         <button style={{
//           background: 'none',
//           border: 'none',
//           cursor: 'pointer',
//           padding: '0.5rem',
//           display: 'flex',
//           alignItems: 'center'
//         }}>
//           <ChevronLeft size={24} />
//         </button>
//         <h1 style={{
//           fontSize: '1.75rem',
//           fontWeight: '600',
//           margin: 0
//         }}>Scenario Simulator</h1>
//       </div>

//       {/* Input Section */}
//       <div style={{
//         background: 'white',
//         borderRadius: '12px',
//         padding: '2rem',
//         marginBottom: '2rem',
//         boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//       }}>
//         <label style={{
//           display: 'block',
//           fontSize: '1rem',
//           fontWeight: '600',
//           marginBottom: '1rem',
//           color: '#333'
//         }}>
//           Describe your scenario:
//         </label>
//         <input
//           type="text"
//           placeholder="Explain your unique scenario"
//           value={scenarioText}
//           onChange={(e) => setScenarioText(e.target.value)}
//           style={{
//             width: '100%',
//             padding: '1rem',
//             fontSize: '1rem',
//             border: '1px solid #e0e0e0',
//             borderRadius: '8px',
//             outline: 'none',
//             transition: 'border-color 0.2s',
//             boxSizing: 'border-box'
//           }}
//           onFocus={(e) => e.target.style.borderColor = '#10b981'}
//           onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
//         />
//       </div>

//       {/* Scenarios Grid */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
//         gap: '1.5rem',
//         marginBottom: '3rem'
//       }}>
//         {scenarios.map((scenario) => (
//           <div
//             key={scenario.id}
//             onClick={() => handleScenarioClick(scenario)}
//             style={{
//               background: 'white',
//               borderRadius: '12px',
//               overflow: 'hidden',
//               cursor: 'pointer',
//               transition: 'transform 0.2s, box-shadow 0.2s',
//               boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = 'translateY(-4px)';
//               e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = 'translateY(0)';
//               e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
//             }}
//           >
//             <div style={{
//               position: 'relative',
//               paddingBottom: '60%',
//               background: '#e0e0e0'
//             }}>
//               <img
//                 src={scenario.image}
//                 alt={scenario.title}
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   width: '100%',
//                   height: '100%',
//                   objectFit: 'cover'
//                 }}
//               />
//             </div>
//             <div style={{
//               padding: '1.25rem'
//             }}>
//               <p style={{
//                 fontSize: '0.95rem',
//                 color: '#333',
//                 lineHeight: '1.5',
//                 margin: 0
//               }}>
//                 {scenario.title}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Generate More Button */}
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center'
//       }}>
//         <button
//           onClick={handleGenerateMore}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '0.5rem',
//             padding: '1rem 2rem',
//             fontSize: '1rem',
//             fontWeight: '600',
//             color: '#10b981',
//             background: 'white',
//             border: '2px solid #10b981',
//             borderRadius: '50px',
//             cursor: 'pointer',
//             transition: 'all 0.2s'
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.background = '#10b981';
//             e.currentTarget.style.color = 'white';
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.background = 'white';
//             e.currentTarget.style.color = '#10b981';
//           }}
//         >
//           <Sparkles size={20} />
//           Generate more
//         </button>
//       </div>

//       {/* Detail Modal */}
//       {selectedScenario && (
//         <>
//           {/* Backdrop */}
//           <div
//             onClick={handleCloseDetail}
//             style={{
//               position: 'fixed',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               background: 'rgba(0,0,0,0.5)',
//               zIndex: 999,
//               animation: 'fadeIn 0.3s ease-out'
//             }}
//           />

//           {/* Modal */}
//           <div style={{
//             position: 'fixed',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             background: 'white',
//             borderRadius: '16px',
//             padding: '2rem',
//             maxWidth: '900px',
//             width: '90%',
//             maxHeight: '80vh',
//             overflowY: 'auto',
//             zIndex: 1000,
//             animation: 'scaleIn 0.3s ease-out',
//             boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
//           }}>
//             {/* Close Button */}
//             <button
//               onClick={handleCloseDetail}
//               style={{
//                 position: 'absolute',
//                 top: '1rem',
//                 right: '1rem',
//                 background: 'none',
//                 border: 'none',
//                 cursor: 'pointer',
//                 padding: '0.5rem',
//                 display: 'flex',
//                 alignItems: 'center',
//                 color: '#666'
//               }}
//             >
//               <X size={24} />
//             </button>

//             {/* Content */}
//             <div style={{
//               display: 'flex',
//               gap: '2rem',
//               flexWrap: 'wrap'
//             }}>
//               {/* Image Side */}
//               <div style={{
//                 flex: '0 0 300px'
//               }}>
//                 <img
//                   src={selectedScenario.image}
//                   alt={selectedScenario.title}
//                   style={{
//                     width: '100%',
//                     borderRadius: '12px',
//                     marginBottom: '1rem'
//                   }}
//                 />
//                 <p style={{
//                   fontSize: '0.95rem',
//                   color: '#333',
//                   textAlign: 'center',
//                   margin: 0
//                 }}>
//                   {selectedScenario.title}
//                 </p>
//               </div>

//               {/* Text Side */}
//               <div style={{
//                 flex: '1',
//                 minWidth: '300px'
//               }}>
//                 <h2 style={{
//                   fontSize: '1.75rem',
//                   fontWeight: '700',
//                   marginBottom: '1.5rem',
//                   color: '#111'
//                 }}>
//                   The 60-Decibel Drop.
//                 </h2>

//                 <div style={{
//                   fontSize: '1rem',
//                   lineHeight: '1.8',
//                   color: '#333',
//                   marginBottom: '1.5rem'
//                 }}>
//                   <p>You are sitting on the couch, reading. It feels incredibly still.</p>
                  
//                   <p>You walk to the window and pull back the curtain. Outside, the city traffic is gridlocked and a monsoon storm is raging. It should be deafening.</p>
                  
//                   <p>But inside? Absolute silence.</p>
                  
//                   <p>The acoustic glazing and the 50-meter "Green Buffer" of trees work. Your kids are building a Lego tower on the floor, completely unaware that the world outside is screaming.</p>
//                 </div>

//                 <div style={{
//                   background: '#f59e0b',
//                   color: 'white',
//                   padding: '1.25rem',
//                   borderRadius: '8px',
//                   fontSize: '1.05rem',
//                   fontWeight: '600',
//                   textAlign: 'center'
//                 }}>
//                   Sanctuary isn't just a place. It's the absence of noise.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
        
//         @keyframes scaleIn {
//           from {
//             opacity: 0;
//             transform: translate(-50%, -50%) scale(0.9);
//           }
//           to {
//             opacity: 1;
//             transform: translate(-50%, -50%) scale(1);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ScenarioSimulator;
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Sparkles, X, Loader2, AlertCircle } from 'lucide-react';
import { generateScenario, getPreGeneratedScenarios } from './api';

const ScenarioSimulator = ({ onBack }) => {
  const [scenarioText, setScenarioText] = useState('');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [error, setError] = useState('');

  // Load pre-generated scenarios on mount
  useEffect(() => {
    loadPreGeneratedScenarios();
  }, []);

  const loadPreGeneratedScenarios = async () => {
    try {
      const result = await getPreGeneratedScenarios();
      if (result.success && result.scenarios) {
        setScenarios(result.scenarios);
      }
    } catch (err) {
      console.error('Failed to load scenarios:', err);
      setError('Failed to load example scenarios');
    }
  };

  // ✅ FLOW 1: Handle Enter key - Generate CUSTOM scenario from text input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
      e.preventDefault();
      handleGenerateCustomScenario();
    }
  };

  // ✅ FLOW 1: Generate custom scenario from user input
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
          image_url: `data:image/png;base64,${result.image_base64}`,
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

  // ✅ Helper function with retry logic for rate limits
  const generateScenarioWithRetry = async (scenarioText, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await generateScenario(scenarioText);
        return result;
      } catch (error) {
        console.warn(`[RETRY] Attempt ${attempt}/${maxRetries} failed:`, error.message);
        
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          const delay = attempt * 2000; // 2s, 4s, 6s
          console.log(`[RETRY] Waiting ${delay/1000}s before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error; // Final attempt failed
        }
      }
    }
  };

  // ✅ FLOW 2: Generate 5 NEW random scenarios (PARALLEL with retry)
  const handleGenerateMoreScenarios = async () => {
    setIsGeneratingMore(true);
    setError('');

    try {
      console.log('🔄 [RANDOM] Generating 5 new random scenarios in parallel...');
      
      // Random scenario prompts - you can customize these
      const randomScenarios = [
        'Family with elderly parents needs ground floor villa',
        'Young couple wants modern apartment near metro station',
        'Parents looking for home near international school',
        'Fitness enthusiast needs apartment with gym and jogging track',
        'Remote worker needs quiet home office space'
      ];

      // ✅ Generate all 5 in parallel WITH RETRY LOGIC
      const promises = randomScenarios.map((prompt, index) => 
        generateScenarioWithRetry(prompt)
          .then(result => {
            if (result.success) {
              console.log(`✅ [RANDOM] Scenario ${index + 1}/5 complete`);
              return {
                id: Date.now() + index,
                image_url: `data:image/png;base64,${result.image_base64}`,
                title: result.title,
                description: result.story.join('\n\n'),
                tagline: result.tagline,
                story: result.story
              };
            } else {
              console.warn(`⚠️ [RANDOM] Scenario ${index + 1}/5 failed:`, result.error);
              return null;
            }
          })
          .catch(err => {
            console.error(`❌ [RANDOM] Scenario ${index + 1}/5 error:`, err);
            return null;
          })
      );

      const results = await Promise.all(promises);
      
      // Filter out failed scenarios
      const newScenarios = results.filter(scenario => scenario !== null);

      if (newScenarios.length > 0) {
        // REPLACE all existing scenarios with new ones
        setScenarios(newScenarios);
        console.log(`✅ [RANDOM] Generated ${newScenarios.length}/5 scenarios successfully!`);
        
        if (newScenarios.length < 5) {
          setError(`Generated ${newScenarios.length}/5 scenarios (some failed due to rate limits)`);
        }
      } else {
        setError('Failed to generate any scenarios. Please try again in a moment.');
      }
    } catch (err) {
      console.error('❌ [RANDOM] Error generating scenarios:', err);
      setError('Failed to generate new scenarios. Please try again.');
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

      {/* Close Button */}
      <button
        onClick={onBack}
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
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Main Modal Container */}
      <div style={{
        position: 'fixed',
        top: '120px',
        left: 0,
        right: 0,
        bottom: 0,
        background: '#f3f4f6',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        zIndex: 999,
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
        overflowY: 'auto',
        padding: '2rem'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <ChevronLeft size={28} color="#111827" strokeWidth={2.5} />
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            margin: 0,
            color: '#111827'
          }}>
            Scenario Simulator
          </h1>
        </div>

        {/* ✅ FLOW 1: Custom Scenario Input Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.95rem',
            fontWeight: '600',
            marginBottom: '0.75rem',
            color: '#374151'
          }}>
            Describe your scenario:
          </label>
          
          <input
            type="text"
            placeholder="Explain your unique scenario (press Enter to generate)"
            value={scenarioText}
            onChange={(e) => {
              setScenarioText(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            disabled={isGenerating}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              fontSize: '0.95rem',
              border: error ? '2px solid #ef4444' : '1px solid #e5e7eb',
              borderRadius: '12px',
              outline: 'none',
              transition: 'all 0.2s',
              boxSizing: 'border-box',
              opacity: isGenerating ? 0.6 : 1,
              background: '#f9fafb'
            }}
            onFocus={(e) => {
              if (!error) {
                e.target.style.borderColor = '#10b981';
                e.target.style.background = 'white';
              }
            }}
            onBlur={(e) => {
              if (!error) {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = '#f9fafb';
              }
            }}
          />
          
          {error && (
            <div style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {isGenerating && (
            <div style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              color: '#1e40af',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Generating your custom scenario...
            </div>
          )}

          <p style={{
            marginTop: '0.5rem',
            fontSize: '0.75rem',
            color: '#9ca3af',
            fontStyle: 'italic',
            margin: '0.5rem 0 0 0'
          }}>
            
          </p>
        </div>

        {/* Scenarios Grid */}
        {scenarios.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
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
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  opacity: (isGenerating || isGeneratingMore) ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isGenerating && !isGeneratingMore) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{
                  position: 'relative',
                  paddingBottom: '75%',
                  background: '#f3f4f6'
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
                <div style={{
                  padding: '1rem'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    lineHeight: '1.5',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {scenario.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ FLOW 2: Generate More Button - Independent from text input */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '2rem'
        }}>
          <button
            onClick={handleGenerateMoreScenarios}
            disabled={isGeneratingMore || isGenerating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'white',
              background: (isGeneratingMore || isGenerating) ? '#d1d5db' : '#10b981',
              border: 'none',
              borderRadius: '50px',
              cursor: (isGeneratingMore || isGenerating) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: (isGeneratingMore || isGenerating) ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}
            onMouseEnter={(e) => {
              if (!isGeneratingMore && !isGenerating) {
                e.currentTarget.style.background = '#059669';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isGeneratingMore && !isGenerating) {
                e.currentTarget.style.background = '#10b981';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.25)';
              }
            }}
          >
            {isGeneratingMore ? (
              <>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Generating 5 new scenarios...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate more
              </>
            )}
          </button>
        </div>

        {/* Detail Modal */}
        {selectedScenario && (
          <>
            <div
              onClick={handleCloseDetail}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.6)',
                zIndex: 1002,
                animation: 'fadeIn 0.3s ease-out'
              }}
            />

            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '900px',
              width: '90%',
              maxHeight: '85vh',
              overflowY: 'auto',
              zIndex: 1003,
              animation: 'scaleIn 0.3s ease-out',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              <button
                onClick={handleCloseDetail}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: '#f3f4f6',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
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

              <div style={{
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  flex: '0 0 320px',
                  minWidth: '280px'
                }}>
                  <img
                    src={selectedScenario.image_url}
                    alt={selectedScenario.title}
                    style={{
                      width: '100%',
                      borderRadius: '16px',
                      marginBottom: '1rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#374151',
                    textAlign: 'center',
                    margin: 0,
                    fontWeight: '600',
                    lineHeight: '1.4'
                  }}>
                    {selectedScenario.title}
                  </p>
                </div>

                <div style={{
                  flex: '1',
                  minWidth: '300px'
                }}>
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    marginBottom: '1.5rem',
                    color: '#111827',
                    lineHeight: '1.3'
                  }}>
                    {selectedScenario.title}
                  </h2>

                  <div style={{
                    fontSize: '1rem',
                    lineHeight: '1.8',
                    color: '#374151',
                    marginBottom: '1.5rem'
                  }}>
                    {selectedScenario.story ? (
                      selectedScenario.story.map((paragraph, idx) => (
                        <p key={idx} style={{ marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p>{selectedScenario.description}</p>
                    )}
                  </div>

                  {selectedScenario.tagline && (
                    <div style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      fontSize: '1.05rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
                    }}>
                      {selectedScenario.tagline}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
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
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
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