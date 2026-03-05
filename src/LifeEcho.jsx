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

const iconMap = { clock: Clock, volume: VolumeX, shield: Shield, home: Home, building: Building };

const LifeEcho = ({ onBack, isEmbedded = false, initialScenario = null }) => {
  const [scenarioText, setScenarioText] = useState('');
  const [selectedScenario, setSelectedScenario] = useState(initialScenario);
  const [scenarios, setScenarios] = useState([]);
  const [highlightedIds, setHighlightedIds] = useState([]);
  const [loadedBatches, setLoadedBatches] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadInitialScenarios(); }, []);
  useEffect(() => { if (initialScenario) setSelectedScenario(initialScenario); }, [initialScenario]);

  const loadInitialScenarios = async () => {
    try {
      const result = await getRandomScenarios();
      if (result.success && result.scenarios) {
        setScenarios(result.scenarios);
        setLoadedBatches(1);
        highlightRandomScenarios(result.scenarios);
      }
    } catch (err) {
      setError('Failed to load example scenarios');
    }
  };

  const highlightRandomScenarios = (newScenarios) => {
    if (newScenarios.length < 2) return;
    const shuffled = [...newScenarios].sort(() => Math.random() - 0.5);
    setHighlightedIds(shuffled.slice(0, 2).map(s => s.id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
      e.preventDefault();
      handleGenerateCustomScenario();
    }
  };

  const handleGenerateCustomScenario = async () => {
    if (!scenarioText.trim()) { setError('Please describe your scenario'); return; }
    if (scenarioText.length < 10) { setError('Please provide more details'); return; }
    setIsGenerating(true); setError('');
    try {
      const result = await generateScenario(scenarioText);
      if (result.success) {
        const newScenario = { id: Date.now(), title: result.title, story: result.story, tagline: result.tagline, icon: 'building', category: 'custom' };
        setScenarios([newScenario, ...scenarios]);
        setScenarioText('');
        setSelectedScenario(newScenario);
      } else {
        setError(result.error || 'Generation failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate scenario.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMoreScenarios = async () => {
    if (loadedBatches >= 7) { setLoadedBatches(0); setScenarios([]); loadInitialScenarios(); return; }
    setIsGeneratingMore(true); setError('');
    try {
      const result = await getRandomScenarios();
      if (result.success && result.scenarios) {
        setScenarios(prev => [...prev, ...result.scenarios]);
        setLoadedBatches(prev => prev + 1);
        highlightRandomScenarios(result.scenarios);
      }
    } catch (err) {
      setError('Failed to load new scenarios.');
    } finally {
      setIsGeneratingMore(false);
    }
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
    if (scenario.tagline && !scenario.tagline.includes('**Tagline:**')) return scenario.tagline.trim();
    const textToSearch = scenario.description || (scenario.story ? scenario.story.join('\n') : '');
    const taglineMatch = textToSearch.match(/\*\*Tagline:\*\*\s*(.+?)(?:\n|$)/i);
    if (taglineMatch) return taglineMatch[1].trim();
    if (scenario.tagline) return scenario.tagline.replace(/\*\*Tagline:\*\*/i, '').replace(/\*\*/g, '').trim();
    return null;
  };

  return (
    <div style={{ width: '100%', height: '100%', background: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* HEADER */}
      <div style={{ padding: '0.75rem 1.5rem', flexShrink: 0, background: '#eaecef', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0, color: '#1f2937' }}>LifeEcho</h1>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={18} color="#6b7280" />
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#eaecef' }}>

        {/* SCENARIO LIST */}
        {!selectedScenario && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem 1.5rem 0 1.5rem' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937', whiteSpace: 'nowrap' }}>Describe your scenario:</label>
              <input type="text" placeholder="Explain your unique scenario" value={scenarioText}
                onChange={(e) => { setScenarioText(e.target.value); setError(''); }}
                onKeyPress={handleKeyPress} disabled={isGenerating}
        style={{ flex: 1, padding: '0.75rem 1rem', fontSize: '0.9rem', border: error ? '1.5px solid #ef4444' : '1.5px solid #e5e7eb', borderRadius: '10px', outline: 'none', background: 'white', color: '#6b7280', opacity: isGenerating ? 0.6 : 1 }}
              />
            </div>
            {error && <div style={{ margin: '0.75rem 1.5rem 0', padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#dc2626', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={15} />{error}</div>}
            {isGenerating && <div style={{ margin: '0.75rem 1.5rem 0', padding: '0.75rem 1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', color: '#1e40af', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />Generating your custom scenario...</div>}
            {scenarios.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', padding: '1.25rem 1.5rem' }}>
                {scenarios.map((scenario) => {
                  const Icon = iconMap[scenario.icon] || Building;
                  const isHighlighted = highlightedIds.includes(scenario.id);
                  return (
                    <button key={scenario.id} onClick={() => !isGenerating && !isGeneratingMore && setSelectedScenario(scenario)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1.1rem', background: 'white', border: isHighlighted ? '2px solid transparent' : '2px solid #e5e7eb', backgroundImage: isHighlighted ? 'linear-gradient(white, white), linear-gradient(135deg, #10b981, #059669)' : 'none', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', borderRadius: '50px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', color: '#374151', boxShadow: isHighlighted ? '0 4px 12px rgba(16,185,129,0.2)' : '0 1px 3px rgba(0,0,0,0.08)' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isHighlighted ? 'linear-gradient(135deg, #10b981, #059669)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={15} color={isHighlighted ? 'white' : '#6b7280'} />
                      </div>
                      <span>{scenario.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '0 1.5rem 1.5rem' }}>
              <button onClick={handleGenerateMoreScenarios} disabled={isGeneratingMore || isGenerating}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', fontSize: '0.95rem', fontWeight: '600', color: (isGeneratingMore || isGenerating) ? '#9ca3af' : '#1f2937', background: 'white', border: (isGeneratingMore || isGenerating) ? '2px solid #e5e7eb' : '2px solid #10b981', borderRadius: '50px', cursor: (isGeneratingMore || isGenerating) ? 'not-allowed' : 'pointer', opacity: (isGeneratingMore || isGenerating) ? 0.6 : 1 }}>
                {isGeneratingMore ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />Loading...</> : loadedBatches >= 7 ? <><Sparkles size={18} />Start Over</> : <><Sparkles size={18} />Generate More</>}
              </button>
            </div>
          </>
        )}

        {/* SCENARIO DETAIL — matches Figma */}
        {selectedScenario && (
          <div style={{ padding: '0.75rem 1.5rem 1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem 1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>

              {/* Title row: left arrow sits directly left of title text, NO separate back button */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1.1rem' }}>
                <button onClick={() => setSelectedScenario(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0, marginTop: '0.25rem' }}>
                  <ChevronLeft size={22} color="#374151" />
                </button>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0, color: '#111827', lineHeight: '1.4' }}>
                  {selectedScenario.title}
                </h2>
              </div>

              {/* Story paragraphs — indented to align with title text */}
              <div style={{ fontSize: '0.93rem', lineHeight: '1.75', color: '#374151', marginBottom: '1.25rem', paddingLeft: '1.75rem' }}>
                {selectedScenario.story ? (
                  selectedScenario.story.map((paragraph, idx) => {
                    const cleaned = getDescriptionWithoutTagline(paragraph);
                    if (!cleaned) return null;
                    return <p key={idx} style={{ margin: '0 0 0.85rem 0' }}>{renderFormattedText(cleaned)}</p>;
                  })
                ) : (
                  <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{renderFormattedText(getDescriptionWithoutTagline(selectedScenario.description))}</p>
                )}
              </div>

              {/* Tagline — orange pill, inline/fit-content (never full width) */}
              {extractTagline(selectedScenario) && (
                <div style={{ paddingLeft: '1.75rem' }}>
                  <span style={{
                    display: 'inline-block',
                    background: '#f97316',
                    color: 'white',
                    padding: '0.5rem 1.1rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    maxWidth: '55%',
                    lineHeight: '1.4'
                  }}>
                    {extractTagline(selectedScenario)}
                  </span>
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