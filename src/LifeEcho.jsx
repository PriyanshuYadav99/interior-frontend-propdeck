import React, { useState, useEffect } from 'react';
import { ChevronLeft, Sparkles, X, Loader2, AlertCircle, Clock, VolumeX, Shield, Home, Building, Grid3x3 } from 'lucide-react';

const generateScenario = async (text) => {
  const response = await fetch('https://interior-backend-production.up.railway.app/api/scenario/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario_text: text })
  });
  if (!response.ok) throw new Error('Failed to generate scenario');
  return await response.json();
};

const getRandomScenarios = async () => {
  const response = await fetch('https://interior-backend-production.up.railway.app/api/scenario/random', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Failed to fetch scenarios');
  return await response.json();
};

const iconMap = {
  clock: Clock,
  volume: VolumeX,
  shield: Shield,
  home: Home,
  building: Building
};

// ✅ NEW: accepts initialScenario prop — if provided, opens that scenario's description immediately
const LifeEcho = ({ onBack, isEmbedded = false, initialScenario = null }) => {
  const [scenarioText, setScenarioText] = useState('');
  // ✅ KEY CHANGE: initialize selectedScenario with initialScenario if provided
  const [selectedScenario, setSelectedScenario] = useState(initialScenario);
  const [scenarios, setScenarios] = useState([]);
  const [highlightedIds, setHighlightedIds] = useState([]);
  const [loadedBatches, setLoadedBatches] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInitialScenarios();
  }, []);

  // ✅ If initialScenario changes (e.g. user clicks a different pill), update selected
  useEffect(() => {
    if (initialScenario) {
      setSelectedScenario(initialScenario);
    }
  }, [initialScenario]);

  const loadInitialScenarios = async () => {
    try {
      const result = await getRandomScenarios();
      if (result.success && result.scenarios) {
        setScenarios(result.scenarios);
        setLoadedBatches(1);
        highlightRandomScenarios(result.scenarios);
      }
    } catch (err) {
      console.error('Failed to load scenarios:', err);
      setError('Failed to load example scenarios');
    }
  };

  const highlightRandomScenarios = (newScenarios) => {
    if (newScenarios.length < 2) return;
    const shuffled = [...newScenarios].sort(() => Math.random() - 0.5);
    const highlighted = shuffled.slice(0, 2).map(s => s.id);
    setHighlightedIds(highlighted);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
      e.preventDefault();
      handleGenerateCustomScenario();
    }
  };

  const handleGenerateCustomScenario = async () => {
    if (!scenarioText.trim()) { setError('Please describe your scenario'); return; }
    if (scenarioText.length < 10) { setError('Please provide more details (minimum 10 characters)'); return; }

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
        {line.replace(/\*\*(.+?)\*\*/g, '$1')}
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
    if (taglineMatch) return taglineMatch[1].trim();
    if (scenario.tagline) return scenario.tagline.replace(/\*\*Tagline:\*\*/i, '').replace(/\*\*/g, '').trim();
    return null;
  };

  return (
    <div style={{ width: '100%', height: '100%', background: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ padding: '1.5rem 2rem', flexShrink: 0, background: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* ✅ Show back-to-list button when viewing a scenario detail */}
          {selectedScenario && (
            <button
              onClick={handleCloseDetail}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '0.85rem', fontWeight: '600', padding: '0.3rem 0.6rem', borderRadius: '6px' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
            >
              <ChevronLeft size={18} />
              Back
            </button>
          )}
          <Grid3x3 size={28} color="#10b981" strokeWidth={2} />
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0, color: '#1f2937' }}>LifeEcho</h1>
        </div>
        <button
          onClick={onBack}
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
        >
          <X size={20} color="#6b7280" />
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#f5f1e8' }}>

        {/* ── SCENARIO LIST (shown when no scenario selected) ── */}
        {!selectedScenario && (
          <>
            {/* Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', padding: '1.5rem 2rem 0 2rem' }}>
              <label style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', whiteSpace: 'nowrap', minWidth: 'fit-content' }}>
                Describe your scenario:
              </label>
              <input
                type="text"
                placeholder="Explain your unique scenario"
                value={scenarioText}
                onChange={(e) => { setScenarioText(e.target.value); setError(''); }}
                onKeyPress={handleKeyPress}
                disabled={isGenerating}
                style={{ flex: 1, padding: '0.875rem 1.25rem', fontSize: '0.95rem', border: error ? '1.5px solid #ef4444' : '1.5px solid #e5e7eb', borderRadius: '12px', outline: 'none', transition: 'all 0.2s', opacity: isGenerating ? 0.6 : 1, background: 'white', color: '#6b7280' }}
              />
            </div>

            {error && (
              <div style={{ margin: '0 2rem 1.5rem 2rem', padding: '0.875rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#dc2626', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <AlertCircle size={16} />{error}
              </div>
            )}

            {isGenerating && (
              <div style={{ margin: '0 2rem 1.5rem 2rem', padding: '0.875rem 1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', color: '#1e40af', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Generating your custom scenario...
              </div>
            )}

            {scenarios.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem', padding: '1.5rem 2rem' }}>
                {scenarios.map((scenario) => {
                  const Icon = iconMap[scenario.icon] || Building;
                  const isHighlighted = highlightedIds.includes(scenario.id);
                  return (
                    <button
                      key={scenario.id}
                      onClick={() => !isGenerating && !isGeneratingMore && handleScenarioClick(scenario)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.75rem 1.25rem', background: 'white',
                        border: isHighlighted ? '2px solid transparent' : '2px solid #e5e7eb',
                        backgroundImage: isHighlighted ? 'linear-gradient(white, white), linear-gradient(135deg, #10b981, #059669)' : 'none',
                        backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box',
                        borderRadius: '50px',
                        cursor: (isGenerating || isGeneratingMore) ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: (isGenerating || isGeneratingMore) ? 0.6 : 1,
                        fontSize: '0.95rem', fontWeight: '500', color: '#374151',
                        boxShadow: isHighlighted ? '0 4px 12px rgba(16, 185, 129, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isHighlighted ? 'linear-gradient(135deg, #10b981, #059669)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} color={isHighlighted ? 'white' : '#6b7280'} />
                      </div>
                      <span>{scenario.title}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', padding: '0 2rem 2rem 2rem' }}>
              <button
                onClick={handleGenerateMoreScenarios}
                disabled={isGeneratingMore || isGenerating}
                style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: '600', color: (isGeneratingMore || isGenerating) ? '#9ca3af' : '#1f2937', background: 'white', border: (isGeneratingMore || isGenerating) ? '2px solid #e5e7eb' : '2px solid #10b981', borderRadius: '50px', cursor: (isGeneratingMore || isGenerating) ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', opacity: (isGeneratingMore || isGenerating) ? 0.6 : 1 }}
              >
                {isGeneratingMore ? (
                  <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />Loading batch {loadedBatches + 1}/7...</>
                ) : loadedBatches >= 7 ? (
                  <><Sparkles size={20} />Start Over</>
                ) : (
                  <><Sparkles size={20} />Generate More</>
                )}
              </button>
            </div>
          </>
        )}

        {/* ── SCENARIO DETAIL (shown when a scenario is selected) ── */}
        {selectedScenario && (
          <div style={{ padding: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ position: 'relative', background: 'white', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>

              <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1.75rem', color: '#111827', paddingRight: '1rem' }}>
                {selectedScenario.title}
              </h2>

              <div style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#374151', marginBottom: '1.75rem' }}>
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
                <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', padding: '1.5rem', borderRadius: '14px', fontSize: '1.1rem', fontWeight: '600', textAlign: 'center', boxShadow: '0 4px 16px rgba(245, 158, 11, 0.25)' }}>
                  {extractTagline(selectedScenario)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LifeEcho;