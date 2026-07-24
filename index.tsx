/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

//Vibe coded by ammaar@google.com

import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

import { Artifact, Session, ComponentVariation, LayoutOption, AppSkin } from './types';
import { INITIAL_PLACEHOLDERS, APP_SKINS } from './constants';
import { generateContent, getSettings } from './ai';
import { useGenerativeSessions } from './hooks/useGenerativeSessions';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

import DottedGlowBackground from './components/DottedGlowBackground';
import ArtifactCard from './components/ArtifactCard';
import SettingsPanel from './components/SettingsPanel';
import ActionDrawer from './components/ActionDrawer';
import ActionBar from './components/ActionBar';
import FloatingInput from './components/FloatingInput';
import LibraryDrawer from './components/LibraryDrawer';
import InfoDrawer from './components/InfoDrawer';
import { saveComponent, SavedComponent } from './services/dbService';
import { getThumbnailId, thumbnailCache } from './hooks/useThumbnail';
import { useLanguage, LANGUAGE_NAMES, Language } from './localization';
import { buildDnaPrompt } from './dnaUtils';
import { extractDominantColor } from './utils';
import { 
    SettingsIcon,
    SparklesIcon, 
    ArrowLeftIcon, 
    ArrowRightIcon,
    LibraryIcon,
    InfoIcon
} from './components/Icons';

function App() {
  const { lang, changeLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholders, setPlaceholders] = useState<string[]>(INITIAL_PLACEHOLDERS);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [activeSkin, setActiveSkin] = useState<AppSkin>(() => {
    try {
      const savedSkinId = localStorage.getItem('sen_active_skin_id');
      const found = APP_SKINS.find(s => s.id === savedSkinId);
      return found || APP_SKINS[0];
    } catch {
      return APP_SKINS[0];
    }
  });

  const [drawerState, setDrawerState] = useState<{
      isOpen: boolean;
      mode: 'code' | 'variations' | 'export' | 'preview' | 'playground' | null;
      title: string;
      data: any; 
  }>({ isOpen: false, mode: null, title: '', data: null });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(activeSkin.presets[0]);

  const [showStyleDna, setShowStyleDna] = useState(false);
  const [styleDna, setStyleDna] = useState<Record<string, number>>(() => {
    const dna: Record<string, number> = {};
    activeSkin.dnaDimensions.forEach(dim => dna[dim.key] = dim.defaultWeight);
    return dna;
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editElementData, setEditElementData] = useState<{name: string, html: string} | null>(null);
  const [editElementInstruction, setEditElementInstruction] = useState('');

  const handleSkinChange = (skinId: string) => {
      const skin = APP_SKINS.find(s => s.id === skinId);
      if (skin) {
          setActiveSkin(skin);
          setSelectedPreset(skin.presets[0]);
          const newDna: Record<string, number> = {};
          skin.dnaDimensions.forEach(dim => newDna[dim.key] = dim.defaultWeight);
          setStyleDna(newDna);
          try {
              localStorage.setItem('sen_active_skin_id', skin.id);
          } catch (e) {
              console.warn("Failed to persist skin ID", e);
          }
      }
  };

  // Extract complex state and management into isolated custom hooks
  const {
    sessions,
    setSessions,
    currentSessionIndex,
    setCurrentSessionIndex,
    focusedArtifactIndex,
    setFocusedArtifactIndex,
    isLoading,
    componentVariations,
    handleSendMessage: runSendMessage,
    handleGenerateVariations: runGenerateVariations,
    applyVariation: runApplyVariation,
    handleRevert,
    handleFuse,
    handleEditElement,
    nextItem,
    prevItem
  } = useGenerativeSessions(activeSkin);

  const currentSession = sessions[currentSessionIndex];
  const activeArtifact = currentSession?.artifacts?.[focusedArtifactIndex ?? 0] || currentSession?.artifacts?.[0];
  const activeColor = extractDominantColor(
    activeArtifact?.html,
    currentSession?.prompt,
    activeArtifact?.styleName || currentSession?.componentType
  );

  const {
    isDictating,
    toggleDictation,
    stopDictation
  } = useSpeechRecognition({ inputValue, setInputValue });

  const getDnaPrompt = useCallback(() => {
    return buildDnaPrompt(styleDna);
  }, [styleDna]);

  const inputRef = useRef<HTMLInputElement>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (focusedArtifactIndex === null) {
      setIsEditMode(false);
      setEditElementData(null);
    }
  }, [focusedArtifactIndex]);

  const handleApplyElementEdit = async () => {
    if (!editElementData || !editElementInstruction.trim()) return;
    await handleEditElement(editElementInstruction, editElementData.html, editElementData.name, () => {
        setEditElementData(null);
        setEditElementInstruction('');
        setIsEditMode(false);
    });
  };

  const handleLoadIntoWorkspace = (comp: SavedComponent) => {
    const newSession: Session = {
        id: comp.id + '-session',
        prompt: comp.prompt,
        componentType: comp.preset || 'default',
        timestamp: Date.now(),
        artifacts: [
            {
                id: comp.id,
                styleName: comp.preset || 'default',
                html: comp.html,
                status: 'complete',
                history: [
                    {
                        html: comp.html,
                        timestamp: Date.now(),
                        label: 'Loaded Saved Version'
                    }
                ]
            }
        ]
    };

    setSessions((prev: Session[]) => {
        const exists = prev.findIndex(s => s.artifacts.some(a => a.id === comp.id));
        if (exists !== -1) {
            setCurrentSessionIndex(exists);
            setFocusedArtifactIndex(0);
            return prev;
        }
        const nextSessions = [...prev, newSession];
        setCurrentSessionIndex(nextSessions.length - 1);
        setFocusedArtifactIndex(0);
        return nextSessions;
    });

    setDrawerState({
        isOpen: false,
        mode: null,
        title: '',
        data: null
    });
  };

  // Fix for mobile: reset scroll when focusing an item to prevent "overscroll" state
  useEffect(() => {
    if (focusedArtifactIndex !== null && window.innerWidth <= 1024) {
        if (gridScrollRef.current) {
            gridScrollRef.current.scrollTop = 0;
        }
        window.scrollTo(0, 0);
    }
  }, [focusedArtifactIndex]);

  // Cycle placeholders
  useEffect(() => {
      const interval = setInterval(() => {
          setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
      }, 3000);
      return () => clearInterval(interval);
  }, [placeholders.length]);

  // Dynamic placeholder generation on load
  useEffect(() => {
      const fetchDynamicPlaceholders = async () => {
          try {
              const settings = getSettings();
              const response = await generateContent(
                  `Generate 20 creative, short visual face prompts for the SEN Light Novels app (specifically complete faces for the Reader Chamber reading layout, Living Codex lore encyclopedia, or coordinated Face Family). Return ONLY a raw JSON array of strings. IP SAFEGUARD: Avoid referencing specific trademarked characters or brands. Return ONLY the JSON raw array string.`,
                  settings
              );
              const text = response.text || '[]';
              const jsonMatch = text.match(/\[[\s\S]*\]/);
              if (jsonMatch) {
                  const newPlaceholders = JSON.parse(jsonMatch[0]);
                  if (Array.isArray(newPlaceholders) && newPlaceholders.length > 0) {
                      const shuffled = newPlaceholders.sort(() => 0.5 - Math.random()).slice(0, 10);
                      setPlaceholders(prev => [...prev, ...shuffled]);
                  }
              }
          } catch (e) {
              console.warn("Silently failed to fetch dynamic placeholders", e);
          }
      };
      setTimeout(fetchDynamicPlaceholders, 1000);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleGenerateVariations = useCallback(async () => {
    const currentSession = sessions[currentSessionIndex];
    if (!currentSession || focusedArtifactIndex === null) return;
    const currentArtifact = currentSession.artifacts[focusedArtifactIndex];
    if (!currentArtifact) return;

    setDrawerState({ isOpen: true, mode: 'variations', title: 'Variations', data: currentArtifact.id });
    await runGenerateVariations();
  }, [sessions, currentSessionIndex, focusedArtifactIndex, runGenerateVariations]);

  const applyVariation = (html: string) => {
      runApplyVariation(html, () => {
          setDrawerState(s => ({ ...s, isOpen: false }));
      });
  };

  const handleShowCode = () => {
      const currentSession = sessions[currentSessionIndex];
      if (currentSession && focusedArtifactIndex !== null) {
          const artifact = currentSession.artifacts[focusedArtifactIndex];
          if (artifact) setDrawerState({ isOpen: true, mode: 'code', title: 'Source Code', data: artifact.html });
      }
  };

  const handleExport = async () => {
      const currentSession = sessions[currentSessionIndex];
      if (currentSession && focusedArtifactIndex !== null) {
          const artifact = currentSession.artifacts[focusedArtifactIndex];
          if (artifact) {
              setDrawerState({ isOpen: true, mode: 'export', title: 'Export Component', data: artifact });
              
              // Generate thumbnail lazily in background if not already in cache
              const thumbnailId = getThumbnailId(artifact.html);
              if (!thumbnailCache.has(thumbnailId)) {
                  try {
                      const { generateThumbnail } = await import('./services/screenshotService');
                      generateThumbnail(artifact.html, 800, 600).then(generated => {
                          if (generated) {
                              thumbnailCache.set(thumbnailId, generated);
                              window.dispatchEvent(new CustomEvent('thumbnail_generated', { detail: { id: thumbnailId, dataUrl: generated } }));
                          }
                      }).catch(e => console.error("Export thumbnail generation failed:", e));
                  } catch (err) {
                      console.error("Export thumbnail import failed:", err);
                  }
              }
          }
      }
  };

  const handleSendMessage = useCallback(async (manualPrompt?: string) => {
    let promptToUse = manualPrompt || inputValue;
    if (!promptToUse.trim() && referenceImage) {
        promptToUse = "Extract the palette, mood, texture, symbols, and visual language from the reference image, then generate a complete visual face theme for SEN Light Novels inspired by it.";
    }
    const trimmedInput = promptToUse.trim();
    
    if (!trimmedInput || isLoading) return;
    
    stopDictation();
    
    if (!manualPrompt) {
        setInputValue('');
        setReferenceImage(null);
    }

    const isFamily = selectedPreset.id === 'face_family' || selectedPreset.label === 'Face Family';

    const options = {
      componentType: selectedPreset.label,
      componentInstruction: selectedPreset.instruction,
      mode: isFamily ? ('family' as const) : ('single' as const),
      showStyleDna,
      styleDnaPrompt: getDnaPrompt(),
      referenceImage: referenceImage || undefined
    };

    await runSendMessage(trimmedInput, options, () => {
        setTimeout(() => inputRef.current?.focus(), 100);
    });
  }, [inputValue, isLoading, showStyleDna, getDnaPrompt, selectedPreset, runSendMessage, stopDictation]);

  const handleSurpriseMe = () => {
      const currentPrompt = placeholders[placeholderIndex];
      setInputValue(currentPrompt);
      handleSendMessage(currentPrompt);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      event.preventDefault();
      handleSendMessage();
    } else if (event.key === 'Tab' && !inputValue && !isLoading) {
        event.preventDefault();
        setInputValue(placeholders[placeholderIndex]);
    }
  };

  const isLoadingDrawer = isLoading && drawerState.mode === 'variations' && componentVariations.length === 0;

  const hasStarted = sessions.length > 0 || isLoading;

  let canGoBack = false;
  let canGoForward = false;

  if (hasStarted) {
      if (focusedArtifactIndex !== null) {
          canGoBack = focusedArtifactIndex > 0;
          canGoForward = focusedArtifactIndex < (currentSession?.artifacts.length || 0) - 1;
      } else {
          canGoBack = currentSessionIndex > 0;
          canGoForward = currentSessionIndex < sessions.length - 1;
      }
  }

  const handleDismissSession = () => {
      if (currentSessionIndex === -1) return;
      const newSessions = sessions.filter((_, i) => i !== currentSessionIndex);
      setSessions(newSessions);
      if (newSessions.length === 0) {
          setCurrentSessionIndex(-1);
          setFocusedArtifactIndex(null);
      } else {
          setCurrentSessionIndex(Math.max(0, currentSessionIndex - 1));
          setFocusedArtifactIndex(null);
      }
  };

  const handleSaveArtifact = async () => {
      if (!currentSession || focusedArtifactIndex === null) return;
      const artifact = currentSession.artifacts[focusedArtifactIndex];

      const thumbnailId = getThumbnailId(artifact.html);
      let thumbnailDataUrl = thumbnailCache.get(thumbnailId) || null;
      
      if (!thumbnailDataUrl) {
          const { generateThumbnail } = await import('./services/screenshotService');
          const generated = await generateThumbnail(artifact.html, 800, 600);
          if (generated) {
              thumbnailDataUrl = generated;
              thumbnailCache.set(thumbnailId, generated);
              window.dispatchEvent(new CustomEvent('thumbnail_generated', { detail: { id: thumbnailId, dataUrl: generated } }));
          }
      }

      const settings = getSettings();

      await saveComponent({
          id: artifact.id,
          name: currentSession.prompt.slice(0, 40) + '...',
          thumbnail: thumbnailDataUrl,
          html: artifact.html,
          prompt: currentSession.prompt,
          preset: currentSession.componentType || 'default',
          model: settings.model,
          provider: settings.provider,
          favorite: false,
          timestamp: Date.now()
      });
      alert(t('saved_to_lib'));
  };

  return (
    <>
        <SettingsPanel 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            onOpenInfo={() => {
                setIsSettingsOpen(false);
                setIsInfoOpen(true);
            }} 
            activeSkin={activeSkin}
            onSkinChange={handleSkinChange}
        />
        <LibraryDrawer 
            isOpen={isLibraryOpen} 
            onClose={() => setIsLibraryOpen(false)} 
            onSelectComponent={(comp) => {
                setIsLibraryOpen(false);
                setDrawerState({
                    isOpen: true,
                    mode: 'preview',
                    title: comp.name,
                    data: comp
                });
            }} 
        />
        <InfoDrawer 
            isOpen={isInfoOpen} 
            onClose={() => setIsInfoOpen(false)} 
        />
        
        {/* Top Left Header Brand & Logo with Interactive Ambient Glow Sync */}
        <div className="app-header-brand" onClick={() => setIsInfoOpen(true)} title={`SEN Workshop - Celestial Library (${activeColor.name})`} style={{
            position: 'fixed',
            top: '20px',
            left: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 101,
            background: 'rgba(9, 9, 11, 0.82)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid rgba(${activeColor.rgb}, 0.35)`,
            padding: '6px 16px 6px 8px',
            borderRadius: '999px',
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 24px rgba(${activeColor.rgb}, 0.22)`,
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                    src="https://pub-e482c2dbbb984c3c87ecdd8ae3a92183.r2.dev/LIBRARY/images/CELESTIAL%20LIBRARY%20ICON.jpg" 
                    alt="SEN Workshop Logo" 
                    referrerPolicy="no-referrer"
                    style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `1.5px solid rgba(${activeColor.rgb}, 0.6)`,
                        boxShadow: `0 0 16px rgba(${activeColor.rgb}, 0.55), 0 0 32px rgba(${activeColor.rgb}, 0.3)`,
                        transition: 'all 0.4s ease-in-out',
                        flexShrink: 0
                    }}
                />
                <span style={{
                    position: 'absolute',
                    bottom: '-1px',
                    right: '-1px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: activeColor.hex,
                    border: '1.5px solid #09090b',
                    boxShadow: `0 0 8px ${activeColor.hex}`,
                    transition: 'background-color 0.4s ease-in-out, box-shadow 0.4s ease-in-out'
                }} title={`Glow Sync: ${activeColor.name}`} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                <span style={{
                    fontFamily: "'Alegreya SC', 'Alegreya', serif",
                    fontSize: '15px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: '#FAFAFA',
                    lineHeight: 1.2
                }}>
                    {t('app_title')}
                </span>
                <span style={{
                    fontSize: '10px',
                    fontFamily: 'Inter, sans-serif',
                    color: `rgba(${activeColor.rgb}, 0.9)`,
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    transition: 'color 0.4s ease-in-out'
                }}>
                    Celestial Library
                </span>
            </div>
        </div>

        <div style={{ position: 'fixed', top: '24px', right: '24px', display: 'flex', gap: '12px', zIndex: 100 }}>
            <button className="settings-button" style={{ position: 'relative', top: 'auto', right: 'auto' }} onClick={() => setIsLibraryOpen(true)} title={t('library_title')}>
                <LibraryIcon />
            </button>
            <button className="settings-button" style={{ position: 'relative', top: 'auto', right: 'auto' }} onClick={() => setIsSettingsOpen(true)} title={t('settings_title')}>
                <SettingsIcon />
            </button>
        </div>



        <ActionDrawer 
            drawerState={drawerState}
            setDrawerState={setDrawerState}
            isLoadingDrawer={isLoadingDrawer}
            componentVariations={componentVariations}
            applyVariation={applyVariation}
            onLoadIntoWorkspace={handleLoadIntoWorkspace}
            activeSkin={activeSkin}
        />

        <div className="immersive-app">
            <DottedGlowBackground 
                gap={32} 
                radius={1.2} 
                color="rgba(255, 255, 255, 0.01)" 
                glowColor="rgba(255, 255, 255, 0.03)" 
                speedScale={0.15} 
            />

            <div className={`stage-container ${focusedArtifactIndex !== null ? 'mode-focus' : 'mode-split'}`}>
                 <div className={`empty-state ${hasStarted ? 'fade-out' : ''}`}>
                     <div className="empty-content">
                         <h1>{t('app_title')}</h1>
                         <p>{t('app_sub')}</p>
                     </div>
                 </div>

                {sessions.map((session, sIndex) => {
                    let positionClass = 'hidden';
                    if (sIndex === currentSessionIndex) positionClass = 'active-session';
                    else if (sIndex < currentSessionIndex) positionClass = 'past-session';
                    else if (sIndex > currentSessionIndex) positionClass = 'future-session';
                    
                    return (
                        <div key={session.id} className={`session-group ${positionClass}`}>
                            <div className="artifact-grid" ref={sIndex === currentSessionIndex ? gridScrollRef : null}>
                                {session.artifacts.map((artifact, aIndex) => {
                                    const isFocused = focusedArtifactIndex === aIndex;
                                    
                                    return (
                                        <ArtifactCard 
                                            key={artifact.id}
                                            artifact={artifact}
                                            isFocused={isFocused}
                                            onClick={() => setFocusedArtifactIndex(aIndex)}
                                            onRevert={handleRevert}
                                            onDismiss={handleDismissSession}
                                            isEditMode={isEditMode}
                                            onElementSelect={(name, html) => {
                                                setEditElementData({name, html});
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

             {canGoBack && (
                <button className="nav-handle left" onClick={prevItem} aria-label="Previous">
                    <ArrowLeftIcon />
                </button>
             )}
             {canGoForward && (
                <button className="nav-handle right" onClick={nextItem} aria-label="Next">
                    <ArrowRightIcon />
                </button>
             )}

            <ActionBar 
                focusedArtifactIndex={focusedArtifactIndex}
                currentSession={currentSession}
                isLoading={isLoading}
                isEditMode={isEditMode}
                setIsEditMode={(v) => { setIsEditMode(v); if (!v) setEditElementData(null); }}
                setFocusedArtifactIndex={setFocusedArtifactIndex}
                handleGenerateVariations={handleGenerateVariations}
                handleShowCode={handleShowCode}
                handleExport={handleExport}
                handleSave={handleSaveArtifact}
            />

            {editElementData && (
                <div style={{
                    position: 'fixed',
                    bottom: '100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 0, 0, 0.95)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                    padding: '16px',
                    width: '90%',
                    maxWidth: '500px',
                    zIndex: 1000,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    fontFamily: 'Inter, sans-serif'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ color: '#04ACFF', fontSize: '12px', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>
                            Editing: {editElementData.name}
                        </span>
                        <button 
                            onClick={() => setEditElementData(null)}
                            style={{ background: 'transparent', border: 'none', color: '#FAFAFA', cursor: 'pointer' }}
                        >✕</button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="What do you want changed?"
                            value={editElementInstruction}
                            onChange={(e) => setEditElementInstruction(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleApplyElementEdit(); }}
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                padding: '10px 12px',
                                color: '#FAFAFA',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                        <button 
                            onClick={handleApplyElementEdit}
                            disabled={isLoading || !editElementInstruction.trim()}
                            style={{
                                background: '#04ACFF',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#000',
                                padding: '0 16px',
                                fontWeight: 600,
                                fontSize: '13px',
                                cursor: isLoading || !editElementInstruction.trim() ? 'not-allowed' : 'pointer',
                                opacity: isLoading || !editElementInstruction.trim() ? 0.5 : 1
                            }}
                        >
                            {isLoading ? 'Applying...' : 'Apply Edit'}
                        </button>
                    </div>
                </div>
            )}

            <FloatingInput
                focusedArtifactIndex={focusedArtifactIndex}
                selectedPreset={selectedPreset}
                setSelectedPreset={setSelectedPreset}
                showStyleDna={showStyleDna}
                setShowStyleDna={setShowStyleDna}
                styleDna={styleDna}
                setStyleDna={setStyleDna}
                isLoading={isLoading}
                inputValue={inputValue}
                placeholders={placeholders}
                placeholderIndex={placeholderIndex}
                inputRef={inputRef}
                handleInputChange={handleInputChange}
                handleKeyDown={handleKeyDown}
                currentSession={currentSession}
                isDictating={isDictating}
                toggleDictation={toggleDictation}
                handleSendMessage={handleSendMessage}
                referenceImage={referenceImage}
                setReferenceImage={setReferenceImage}
                activeSkin={activeSkin}
            />
        </div>
    </>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}