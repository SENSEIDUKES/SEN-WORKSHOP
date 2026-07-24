import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings, getSettingsB, saveSettingsB, generateContent, fetchAvailableModels } from '../ai';
import { ModelSettings, Provider, AppSkin } from '../types';
import { APP_SKINS } from '../constants';
import { useLanguage, LANGUAGE_NAMES, Language } from '../localization';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onOpenInfo: () => void;
    activeSkin?: AppSkin;
    onSkinChange?: (skinId: string) => void;
}

export default function SettingsPanel({ isOpen, onClose, onOpenInfo, activeSkin, onSkinChange }: Props) {
    const { lang, changeLanguage, t } = useLanguage();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalledApp, setIsInstalledApp] = useState(false);

    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
            setIsInstalledApp(true);
        }

        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        };
    }, []);

    const triggerInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsInstalledApp(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
        }
    };

    const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');
    const [settingsA, setSettingsA] = useState<ModelSettings>(getSettings());
    const [settingsB, setSettingsB] = useState<ModelSettings>(getSettingsB());
    const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [testMessage, setTestMessage] = useState('');
    
    const [availableModelsA, setAvailableModelsA] = useState<string[]>([]);
    const [isLoadingModelsA, setIsLoadingModelsA] = useState(false);

    const [availableModelsB, setAvailableModelsB] = useState<string[]>([]);
    const [isLoadingModelsB, setIsLoadingModelsB] = useState(false);

    const [autoRefreshModels, setAutoRefreshModels] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem('sea_auto_refresh_models');
            return saved !== null ? JSON.parse(saved) : true;
        } catch {
            return true;
        }
    });

    const currentSettings = activeTab === 'A' ? settingsA : settingsB;
    const setCurrentSettings = activeTab === 'A' ? setSettingsA : setSettingsB;
    const availableModels = activeTab === 'A' ? availableModelsA : availableModelsB;
    const isLoadingModels = activeTab === 'A' ? isLoadingModelsA : isLoadingModelsB;

    const DEFAULT_PINNED_MODELS = [
        'gemini-3.6-flash',
        'gemini-3.5-flash',
        'gemini-3.5-flash-lite',
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'anthropic/claude-3-haiku',
        'meta-llama/llama-3-8b-instruct'
    ];

    const [pinnedModels, setPinnedModels] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('sea_pinned_models');
            if (saved) {
                const parsed: string[] = JSON.parse(saved);
                const updated = parsed.map(m => m === 'gemini-3-flash-preview' ? 'gemini-3.6-flash' : m);
                return Array.from(new Set([...DEFAULT_PINNED_MODELS.slice(0, 3), ...updated]));
            }
            return DEFAULT_PINNED_MODELS;
        } catch {
            return DEFAULT_PINNED_MODELS;
        }
    });

    const [providerSearch, setProviderSearch] = useState('');
    const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);
    const [modelSearch, setModelSearch] = useState('');
    const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

    const togglePinModel = (modelName: string) => {
        setPinnedModels(prev => {
            const updated = prev.includes(modelName) 
                ? prev.filter(m => m !== modelName) 
                : [...prev, modelName];
            localStorage.setItem('sea_pinned_models', JSON.stringify(updated));
            return updated;
        });
    };

    const handleSelectPinnedModel = (modelName: string) => {
        let guessedProvider = currentSettings.provider;
        if (modelName.startsWith('gemini')) {
            guessedProvider = 'gemini';
        } else if (modelName.includes('/') && !modelName.startsWith('llama')) {
            guessedProvider = 'openrouter';
        } else if (modelName.startsWith('llama3') || modelName.startsWith('mistral') || modelName.startsWith('phi3') || modelName.startsWith('gemma2') || modelName.startsWith('qwen')) {
            guessedProvider = 'ollama';
        }
        
        setCurrentSettings({
            ...currentSettings,
            provider: guessedProvider,
            model: modelName
        });
    };

    // Sync state when opened
    useEffect(() => {
        if (isOpen) {
            setSettingsA(getSettings());
            setSettingsB(getSettingsB());
            setTestStatus('idle');
            setTestMessage('');
        }
    }, [isOpen]);

    // Fetch models whenever provider or auth info changes for A
    useEffect(() => {
        if (!isOpen) return;
        let isCurrent = true;
        const loadModels = async () => {
            if (settingsA.provider === 'openrouter' && !settingsA.apiKey) {
                if (isCurrent) setAvailableModelsA([]);
                return;
            }
            if (isCurrent) setIsLoadingModelsA(true);
            const models = await fetchAvailableModels(settingsA.provider, settingsA.apiKey, settingsA.baseUrl);
            if (isCurrent) {
                setAvailableModelsA(models);
                setIsLoadingModelsA(false);
                if (autoRefreshModels && models.length > 0) {
                    setPinnedModels(prev => {
                        const merged = Array.from(new Set([...prev, ...models.slice(0, 6)]));
                        localStorage.setItem('sea_pinned_models', JSON.stringify(merged));
                        return merged;
                    });
                }
            }
        };
        const timeoutId = setTimeout(loadModels, autoRefreshModels ? 300 : 800);
        return () => { isCurrent = false; clearTimeout(timeoutId); };
    }, [isOpen, settingsA.provider, settingsA.apiKey, settingsA.baseUrl, autoRefreshModels]);

    // Fetch models whenever provider or auth info changes for B
    useEffect(() => {
        if (!isOpen) return;
        let isCurrent = true;
        const loadModels = async () => {
            if (settingsB.provider === 'openrouter' && !settingsB.apiKey) {
                if (isCurrent) setAvailableModelsB([]);
                return;
            }
            if (isCurrent) setIsLoadingModelsB(true);
            const models = await fetchAvailableModels(settingsB.provider, settingsB.apiKey, settingsB.baseUrl);
            if (isCurrent) {
                setAvailableModelsB(models);
                setIsLoadingModelsB(false);
                if (autoRefreshModels && models.length > 0) {
                    setPinnedModels(prev => {
                        const merged = Array.from(new Set([...prev, ...models.slice(0, 6)]));
                        localStorage.setItem('sea_pinned_models', JSON.stringify(merged));
                        return merged;
                    });
                }
            }
        };
        const timeoutId = setTimeout(loadModels, autoRefreshModels ? 300 : 800);
        return () => { isCurrent = false; clearTimeout(timeoutId); };
    }, [isOpen, settingsB.provider, settingsB.apiKey, settingsB.baseUrl, autoRefreshModels]);

    // Reset status when settings change
    useEffect(() => {
        setTestStatus('idle');
        setTestMessage('');
    }, [currentSettings.provider, currentSettings.model, currentSettings.apiKey, currentSettings.baseUrl]);

    const handleTestConnection = async () => {
        setTestStatus('testing');
        setTestMessage('');
        try {
            await generateContent('Hello, reply with just "OK".', currentSettings);
            setTestStatus('success');
            setTestMessage('Connection successful!');
        } catch (error: any) {
            setTestStatus('error');
            setTestMessage(error.message || 'Connection failed.');
        }
    };

    const handlePullModels = async () => {
        const activeSettings = activeTab === 'A' ? settingsA : settingsB;
        const setIsLoading = activeTab === 'A' ? setIsLoadingModelsA : setIsLoadingModelsB;
        const setAvailable = activeTab === 'A' ? setAvailableModelsA : setAvailableModelsB;

        setIsLoading(true);
        const models = await fetchAvailableModels(activeSettings.provider, activeSettings.apiKey, activeSettings.baseUrl);
        setAvailable(models);
        setIsLoading(false);

        if (models.length > 0) {
            setPinnedModels(prev => {
                const merged = Array.from(new Set([...prev, ...models.slice(0, 10)]));
                localStorage.setItem('sea_pinned_models', JSON.stringify(merged));
                return merged;
            });
        }

        setTestStatus('success');
        setTestMessage(`Pulled ${models.length} live model string(s) for ${activeSettings.provider.toUpperCase()} & updated quick-select badges.`);
    };

    const handleSave = () => {
        saveSettings(settingsA);
        saveSettingsB(settingsB);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={`settings-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="settings-panel">
                <div className="settings-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <h2>
                            <span style={{ fontSize: '18px' }}>⚡</span>
                            <span>Model Lab</span>
                            <span style={{ fontSize: '10px', background: 'rgba(4, 172, 255, 0.15)', border: '1px solid rgba(4, 172, 255, 0.3)', color: '#04ACFF', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                                Dual Engine
                            </span>
                        </h2>
                        <button className="close-button" onClick={onClose}>&times;</button>
                    </div>

                    <div className="settings-tabs-container">
                        <button 
                            type="button"
                            className={`settings-tab-btn ${activeTab === 'A' ? 'active' : ''}`}
                            onClick={() => setActiveTab('A')}
                        >
                            <span>Model Engine A</span>
                            {activeTab === 'A' && (
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#04ACFF' }} />
                            )}
                        </button>
                        <button 
                            type="button"
                            className={`settings-tab-btn ${activeTab === 'B' ? 'active' : ''}`}
                            onClick={() => setActiveTab('B')}
                        >
                            <span>Model Engine B</span>
                            {activeTab === 'B' && (
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#04ACFF' }} />
                            )}
                        </button>
                    </div>
                </div>
                
                <div className="settings-body">
                    {/* Provider Selection Cards */}
                    <div className="setting-group">
                        <label>Generative Provider</label>
                        <div className="provider-grid">
                            {[
                                { id: 'gemini', name: 'Google Gemini', desc: 'Cloud GenAI', icon: '✦' },
                                { id: 'openrouter', name: 'OpenRouter', desc: 'Unified Models', icon: '🌐' },
                                { id: 'ollama', name: 'Ollama', desc: 'Local :11434', icon: '💻' },
                                { id: 'lmstudio', name: 'LM Studio', desc: 'Local :1234', icon: '⚡' }
                            ].map(p => {
                                const isSelected = currentSettings.provider === p.id;
                                return (
                                    <div 
                                        key={p.id}
                                        className={`provider-card ${isSelected ? 'active' : ''}`}
                                        onClick={() => {
                                            const newProvider = p.id as Provider;
                                            let newModel = currentSettings.model;
                                            if (newProvider === 'openrouter' && currentSettings.model.startsWith('gemini')) {
                                                newModel = 'anthropic/claude-3-haiku';
                                            } else if (newProvider === 'gemini' && !currentSettings.model.startsWith('gemini')) {
                                                newModel = 'gemini-3.6-flash';
                                            }
                                            setCurrentSettings({ ...currentSettings, provider: newProvider, model: newModel });
                                        }}
                                    >
                                        <div className="icon-badge">{p.icon}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#FAFAFA' }}>{p.name}</span>
                                            <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)' }}>{p.desc}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Model Name Selector & Live Pull */}
                    <div className="setting-group" style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <label>Model String</label>
                            <button
                                type="button"
                                onClick={handlePullModels}
                                disabled={isLoadingModels}
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: '#04ACFF',
                                    background: 'rgba(4, 172, 255, 0.12)',
                                    border: '1px solid rgba(4, 172, 255, 0.25)',
                                    padding: '3px 10px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <span>{isLoadingModels ? '🔄 Querying...' : '📡 Pull Live Models'}</span>
                            </button>
                        </div>
                        
                        {/* Pinned Quick-Switch Badges */}
                        {pinnedModels.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '4px 0' }}>
                                {pinnedModels.map(m => {
                                    const isActive = currentSettings.model === m;
                                    return (
                                        <div 
                                            key={m}
                                            onClick={() => handleSelectPinnedModel(m)}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontSize: '11px',
                                                fontFamily: 'monospace',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s',
                                                background: isActive ? 'rgba(4, 172, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid',
                                                borderColor: isActive ? 'rgba(4, 172, 255, 0.5)' : 'rgba(255, 255, 255, 0.08)',
                                                color: isActive ? '#04ACFF' : 'rgba(255, 255, 255, 0.7)'
                                            }}
                                        >
                                            <span style={{ maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m}</span>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    togglePinModel(m);
                                                }}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'rgba(255,255,255,0.4)',
                                                    cursor: 'pointer',
                                                    fontSize: '10px',
                                                    padding: '0 2px'
                                                }}
                                                title="Unpin model"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div style={{ position: 'relative' }}>
                            {isLoadingModels ? (
                                <input type="text" value="Fetching available live model strings..." disabled className="setting-input" style={{ opacity: 0.6 }} />
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                                        className="setting-input"
                                        style={{
                                            display: 'flex',
                                            justify: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            fontFamily: 'monospace'
                                        }}
                                    >
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {currentSettings.model || "Select or enter a model string"}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {pinnedModels.includes(currentSettings.model) && (
                                                <span style={{ color: '#EAB308', fontSize: '12px' }}>★</span>
                                            )}
                                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{modelDropdownOpen ? '▲' : '▼'}</span>
                                        </div>
                                    </button>

                                    {modelDropdownOpen && (
                                        <>
                                            <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => { setModelDropdownOpen(false); setModelSearch(''); }} />
                                            <div style={{
                                                position: 'absolute',
                                                top: 'calc(100% + 6px)',
                                                left: 0,
                                                width: '100%',
                                                background: '#121318',
                                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                                borderRadius: '12px',
                                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9)',
                                                zIndex: 20,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                padding: '8px'
                                            }}>
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    placeholder="Search or type custom model string..."
                                                    value={modelSearch}
                                                    onChange={(e) => setModelSearch(e.target.value)}
                                                    className="setting-input"
                                                    style={{ fontSize: '12px', padding: '8px 10px', marginBottom: '6px' }}
                                                />
                                                <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    {(() => {
                                                        const normalizedSearch = modelSearch.trim().toLowerCase();
                                                        let filtered = availableModels.filter(m => m.toLowerCase().includes(normalizedSearch));
                                                        
                                                        if (currentSettings.model && !availableModels.includes(currentSettings.model) && currentSettings.model.toLowerCase().includes(normalizedSearch)) {
                                                            filtered = [currentSettings.model, ...filtered];
                                                        }

                                                        const showCustomOption = modelSearch.trim() && !filtered.some(f => f.toLowerCase() === modelSearch.trim().toLowerCase());

                                                        return (
                                                            <>
                                                                {showCustomOption && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const customM = modelSearch.trim();
                                                                            setCurrentSettings({ ...currentSettings, model: customM });
                                                                            setPinnedModels(prev => {
                                                                                const merged = Array.from(new Set([customM, ...prev]));
                                                                                localStorage.setItem('sea_pinned_models', JSON.stringify(merged));
                                                                                return merged;
                                                                            });
                                                                            setModelDropdownOpen(false);
                                                                            setModelSearch('');
                                                                        }}
                                                                        style={{
                                                                            width: '100%',
                                                                            textAlign: 'left',
                                                                            padding: '8px 10px',
                                                                            fontSize: '12px',
                                                                            color: '#04ACFF',
                                                                            background: 'rgba(4, 172, 255, 0.1)',
                                                                            border: 'none',
                                                                            borderRadius: '6px',
                                                                            cursor: 'pointer',
                                                                            fontFamily: 'monospace'
                                                                        }}
                                                                    >
                                                                        + Set custom: {modelSearch.trim()}
                                                                    </button>
                                                                )}

                                                                {filtered.length === 0 && !showCustomOption && (
                                                                    <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '12px', fontSize: '12px' }}>
                                                                        No matching models found.
                                                                    </div>
                                                                )}

                                                                {filtered.map(m => {
                                                                    const isSelected = currentSettings.model === m;
                                                                    const isPinned = pinnedModels.includes(m);
                                                                    return (
                                                                        <div
                                                                            key={m}
                                                                            style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justify: 'space-between',
                                                                                padding: '2px 6px',
                                                                                borderRadius: '6px',
                                                                                background: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                                                                            }}
                                                                        >
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setCurrentSettings({ ...currentSettings, model: m });
                                                                                    setPinnedModels(prev => {
                                                                                        const merged = Array.from(new Set([m, ...prev]));
                                                                                        localStorage.setItem('sea_pinned_models', JSON.stringify(merged));
                                                                                        return merged;
                                                                                    });
                                                                                    setModelDropdownOpen(false);
                                                                                    setModelSearch('');
                                                                                }}
                                                                                style={{
                                                                                    flex: 1,
                                                                                    textAlign: 'left',
                                                                                    padding: '6px 4px',
                                                                                    fontSize: '12px',
                                                                                    fontFamily: 'monospace',
                                                                                    color: isSelected ? '#FAFAFA' : 'rgba(255, 255, 255, 0.7)',
                                                                                    background: 'none',
                                                                                    border: 'none',
                                                                                    cursor: 'pointer',
                                                                                    overflow: 'hidden',
                                                                                    textOverflow: 'ellipsis',
                                                                                    whiteSpace: 'nowrap'
                                                                                }}
                                                                            >
                                                                                {m}
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    togglePinModel(m);
                                                                                }}
                                                                                style={{
                                                                                    background: 'none',
                                                                                    border: 'none',
                                                                                    color: isPinned ? '#EAB308' : 'rgba(255,255,255,0.3)',
                                                                                    cursor: 'pointer',
                                                                                    fontSize: '13px',
                                                                                    padding: '4px'
                                                                                }}
                                                                                title={isPinned ? "Unpin model" : "Pin model"}
                                                                            >
                                                                                ★
                                                                            </button>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* API Key & Auto-Refresh Toggle */}
                    <div className="setting-group">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <label>API Key</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', color: '#04ACFF', fontWeight: 500 }}>
                                <input 
                                    type="checkbox"
                                    checked={autoRefreshModels}
                                    onChange={(e) => {
                                        const val = e.target.checked;
                                        setAutoRefreshModels(val);
                                        try {
                                            localStorage.setItem('sea_auto_refresh_models', JSON.stringify(val));
                                        } catch (err) {
                                            console.warn("Failed to persist autoRefreshModels", err);
                                        }
                                    }}
                                    style={{ accentColor: '#04ACFF', cursor: 'pointer' }}
                                />
                                <span>Auto-Sync Models</span>
                            </label>
                        </div>
                        <input 
                            type="password" 
                            className="setting-input"
                            value={currentSettings.apiKey} 
                            onChange={(e) => setCurrentSettings({ ...currentSettings, apiKey: e.target.value })}
                            placeholder={currentSettings.provider === 'gemini' ? 'Leave empty to use process.env API Key' : 'Enter API Key...'}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '2px' }}>
                            <span>Stored locally in browser session.</span>
                            {autoRefreshModels && (
                                <span style={{ color: '#04ACFF', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#04ACFF' }} />
                                    Live Auto-Sync Active
                                </span>
                            )}
                        </div>
                    </div>

                    {(currentSettings.provider === 'ollama' || currentSettings.provider === 'lmstudio') && (
                        <div className="setting-group">
                            <label>Base Endpoint URL</label>
                            <input 
                                type="text" 
                                className="setting-input"
                                value={currentSettings.baseUrl || ''} 
                                onChange={(e) => setCurrentSettings({ ...currentSettings, baseUrl: e.target.value })}
                                placeholder={currentSettings.provider === 'ollama' ? 'http://localhost:11434/v1/chat/completions' : 'http://localhost:1234/v1/chat/completions'}
                            />
                            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '2px' }}>The full OpenAI-compatible chat completions endpoint.</div>
                        </div>
                    )}

                    <div className="setting-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label>Temperature ({currentSettings.temperature})</label>
                            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'monospace' }}>
                                {currentSettings.temperature < 0.5 ? 'Precise / Deterministic' : currentSettings.temperature < 1.0 ? 'Balanced' : 'Creative / Expressive'}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="2" 
                            step="0.1" 
                            value={currentSettings.temperature} 
                            onChange={(e) => setCurrentSettings({ ...currentSettings, temperature: parseFloat(e.target.value) })}
                            style={{ width: '100%', accentColor: '#04ACFF', cursor: 'pointer', margin: '4px 0' }}
                        />
                    </div>

                    <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '16px 0' }}></div>

                    {/* Active Workspace Skin Section */}
                    <div className="setting-group" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '16px' }}>🎨</span>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#FAFAFA', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                    Active Visual Skin
                                </span>
                            </div>
                            {activeSkin && (
                                <span style={{ fontSize: '10px', background: 'rgba(4, 172, 255, 0.15)', border: '1px solid rgba(4, 172, 255, 0.3)', color: '#04ACFF', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                                    {activeSkin.presets.length} Presets
                                </span>
                            )}
                        </div>
                        
                        <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                            {activeSkin?.description || 'Select the visual skin configuration for generation.'}
                        </p>

                        <select
                            value={activeSkin?.id || APP_SKINS[0].id}
                            onChange={(e) => onSkinChange && onSkinChange(e.target.value)}
                            className="setting-input"
                            style={{ cursor: 'pointer' }}
                        >
                            {APP_SKINS.map(skin => (
                                <option key={skin.id} value={skin.id} style={{ background: '#121318', color: '#fff' }}>
                                    {skin.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '16px 0' }}></div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="setting-group">
                            <label>Language</label>
                            <select 
                                value={lang} 
                                onChange={(e) => changeLanguage(e.target.value as Language)}
                                className="setting-input"
                                style={{ cursor: 'pointer' }}
                            >
                                {(Object.keys(LANGUAGE_NAMES) as Language[]).map((l) => (
                                    <option key={l} value={l} style={{ background: '#121318', color: '#fff' }}>
                                        {LANGUAGE_NAMES[l]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="setting-group">
                            <label>Guide</label>
                            <button 
                                type="button"
                                className="test-btn" 
                                onClick={onOpenInfo}
                                style={{ 
                                    width: '100%', 
                                    height: '38px',
                                    justifyContent: 'center',
                                    borderRadius: '10px'
                                }}
                            >
                                <span>ℹ️</span> {t('how_to_use')}
                            </button>
                        </div>
                    </div>

                    {/* PWA Section */}
                    <div className="setting-group" style={{ background: 'rgba(4, 172, 255, 0.03)', border: '1px solid rgba(4, 172, 255, 0.15)', padding: '14px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#04ACFF', boxShadow: '0 0 8px #04ACFF' }} />
                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#FAFAFA', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Desktop App Shell
                            </span>
                        </div>
                        <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                            Run SEN Workshop in a dedicated, standalone window with offline local LLM streaming.
                        </p>
                        
                        {isInstalledApp ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#04ACFF', fontWeight: 500, background: 'rgba(4,172,255,0.08)', padding: '8px 12px', borderRadius: '8px' }}>
                                ✓ Standalone Shell Active
                            </div>
                        ) : isInstallable ? (
                            <button
                                className="test-btn"
                                onClick={triggerInstall}
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    background: '#8B0000',
                                    border: 'none',
                                    color: '#FAFAFA',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    fontSize: '12px'
                                }}
                            >
                                Install Workspace App Shell
                            </button>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                Standalone Shell Ready (PWA Cache Loaded)
                            </div>
                        )}
                    </div>

                    <div style={{ textAlign: 'center', paddingTop: '4px' }}>
                        <a 
                            href="https://seihouse.world/" 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', textDecoration: 'none', fontWeight: 500 }}
                        >
                            {t('created_by')}
                        </a>
                    </div>
                </div>

                <div className="settings-footer">
                    <div className="test-connection-wrapper">
                        <button 
                            className="test-btn" 
                            onClick={handleTestConnection}
                            disabled={testStatus === 'testing'}
                        >
                            {testStatus === 'testing' ? 'Testing Connection...' : '⚡ Test Connection'}
                        </button>
                        {testStatus !== 'idle' && (
                            <span className={`test-status-msg ${testStatus}`} title={testMessage}>
                                {testMessage}
                            </span>
                        )}
                    </div>
                    <button className="save-btn" onClick={handleSave}>Save & Close</button>
                </div>
            </div>
        </div>
    );
}
