import React, { useState, useRef, useEffect } from 'react';
import { SlidersIcon, ThinkingIcon, MicOffIcon, MicIcon, ArrowUpIcon, XIcon } from './Icons';
import { Session, AppSkin } from '../types';
import { getDnaTitle, getDnaMeaning, getDnaStatusText } from '../dnaUtils';

interface FloatingInputProps {
    focusedArtifactIndex: number | null;
    selectedPreset: any;
    setSelectedPreset: (preset: any) => void;
    showStyleDna: boolean;
    setShowStyleDna: (show: boolean) => void;
    styleDna: Record<string, number>;
    setStyleDna: (dna: Record<string, number>) => void;
    isLoading: boolean;
    inputValue: string;
    placeholders: string[];
    placeholderIndex: number;
    inputRef: React.RefObject<HTMLInputElement>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    currentSession?: Session;
    isDictating: boolean;
    toggleDictation: () => void;
    handleSendMessage: () => void;
    referenceImage: string | null;
    setReferenceImage: (img: string | null) => void;
    activeSkin: AppSkin;
}

export default function FloatingInput({
    focusedArtifactIndex,
    selectedPreset,
    setSelectedPreset,
    showStyleDna,
    setShowStyleDna,
    styleDna,
    setStyleDna,
    isLoading,
    inputValue,
    placeholders,
    placeholderIndex,
    inputRef,
    handleInputChange,
    handleKeyDown,
    currentSession,
    isDictating,
    toggleDictation,
    handleSendMessage,
    referenceImage,
    setReferenceImage,
    activeSkin
}: FloatingInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsToolsMenuOpen(false);
            }
        };
        if (isToolsMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isToolsMenuOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file (e.g., .png, .jpg)');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                setReferenceImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="floating-input-container">
            <div className="input-group">
                {focusedArtifactIndex === null && (
                    <div className="preset-pills-container">
                        {activeSkin.presets.map(preset => (
                            <button
                                key={preset.id}
                                className={`preset-pill ${selectedPreset.id === preset.id ? 'active' : ''}`}
                                onClick={() => setSelectedPreset(preset)}
                            >
                                {preset.label}
                            </button>
                        ))}
                        <button 
                            className={`preset-pill highlight ${showStyleDna ? 'active' : ''}`}
                            onClick={() => setShowStyleDna(!showStyleDna)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}
                        >
                            <SlidersIcon /> Style DNA
                        </button>
                    </div>
                )}
                
                {showStyleDna && (
                    <div className="dna-panel-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="dna-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Style DNA Customizer</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button 
                                    onClick={() => {
                                        const resetDna: Record<string, number> = {};
                                        activeSkin.dnaDimensions.forEach(dim => resetDna[dim.key] = 0);
                                        setStyleDna(resetDna);
                                    }}
                                    style={{
                                        background: 'none', border: 'none', color: '#04ACFF', fontSize: '11px', cursor: 'pointer', padding: '2px 6px',
                                        borderRadius: '4px', transition: 'all 0.2s'
                                    }}
                                    title="Reset All to Zero"
                                >
                                    Reset to Zero
                                </button>
                                <button 
                                    onClick={() => setShowStyleDna(false)}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                        color: '#e4e4e7',
                                        fontSize: '11px',
                                        cursor: 'pointer',
                                        padding: '3px 8px',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        transition: 'all 0.2s'
                                    }}
                                    title="Minimize Style DNA panel"
                                >
                                    <XIcon /> Minimize
                                </button>
                            </div>
                        </div>
                        {activeSkin.dnaDimensions.map(dim => {
                            const val = styleDna[dim.key] !== undefined ? styleDna[dim.key] : dim.defaultWeight;
                            return (
                                <div key={dim.key} className="dna-slider-container" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#f4f4f5' }}>
                                            {getDnaTitle(dim.key)}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <input 
                                                type="number"
                                                min="-100"
                                                max="100"
                                                value={val}
                                                onChange={(e) => {
                                                    const raw = e.target.value;
                                                    if (raw === '' || raw === '-') {
                                                        setStyleDna({...styleDna, [dim.key]: 0});
                                                        return;
                                                    }
                                                    let parsed = parseInt(raw, 10);
                                                    if (isNaN(parsed)) parsed = 0;
                                                    if (parsed > 100) parsed = 100;
                                                    if (parsed < -100) parsed = -100;
                                                    setStyleDna({...styleDna, [dim.key]: parsed});
                                                }}
                                                style={{
                                                    width: '56px',
                                                    textAlign: 'center',
                                                    fontSize: '11px',
                                                    fontFamily: 'monospace',
                                                    fontWeight: 600,
                                                    color: val === 0 ? '#8e8e93' : '#04ACFF',
                                                    background: val === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(4, 172, 255, 0.12)',
                                                    padding: '2px 4px',
                                                    borderRadius: '6px',
                                                    border: val === 0 ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(4, 172, 255, 0.25)',
                                                    outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                                title="Type value (-100 to 100)"
                                            />
                                        </div>
                                    </div>
                                    <div className="dna-slider-row">
                                        <span className="dna-label left" style={{ transition: 'color 0.2s', color: val < 0 ? '#fff' : 'var(--text-secondary)' }}>
                                            {dim.labelLeft}
                                        </span>
                                        <input 
                                            type="range"
                                            className="dna-slider"
                                            min="-100" max="100" step="1"
                                            value={val}
                                            onChange={(e) => setStyleDna({...styleDna, [dim.key]: parseInt(e.target.value)})}
                                        />
                                        <span className="dna-label right" style={{ transition: 'color 0.2s', color: val > 0 ? '#fff' : 'var(--text-secondary)' }}>
                                            {dim.labelRight}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-2px' }}>
                                        <span style={{ fontSize: '10px', color: '#a1a1aa', fontStyle: 'normal' }}>
                                            {getDnaMeaning(dim.key)}
                                        </span>
                                        <span className="dna-status-badge" style={{
                                            fontSize: '10px',
                                            fontWeight: 500,
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            background: val === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(4, 172, 255, 0.1)',
                                            color: val === 0 ? '#8e8e93' : '#04ACFF',
                                            border: val === 0 ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(4, 172, 255, 0.2)',
                                            transition: 'all 0.2s',
                                            letterSpacing: '0.02em'
                                        }}>
                                            {getDnaStatusText(dim.key, val)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className={`input-wrapper ${isLoading ? 'loading' : ''} ${referenceImage ? 'has-image-seed' : ''}`}>
                    {/* Attach Tools Dropdown Toggle */}
                    <div className="tools-menu-container" ref={menuRef}>
                        <button 
                            type="button"
                            className={`tools-menu-toggle ${isToolsMenuOpen ? 'active' : ''} ${(referenceImage || isDictating) ? 'has-active' : ''}`}
                            onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                            disabled={isLoading}
                            title="Attach Image or Voice Dictation"
                            aria-label="Attach Image or Voice Dictation"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            {(referenceImage || isDictating) && <span className="tools-active-dot" />}
                        </button>

                        {isToolsMenuOpen && (
                            <div className="tools-dropdown-menu animation-fade-in">
                                <button
                                    type="button"
                                    className={`tools-dropdown-item ${referenceImage ? 'active' : ''}`}
                                    onClick={() => {
                                        setIsToolsMenuOpen(false);
                                        fileInputRef.current?.click();
                                    }}
                                    disabled={isLoading}
                                >
                                    <div className="tools-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                    </div>
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">
                                            {referenceImage ? 'Change Image Seed' : 'Upload Image Seed'}
                                        </span>
                                        <span className="tools-item-sub">
                                            {referenceImage ? 'Image seed attached' : 'Extract palette, mood & style'}
                                        </span>
                                    </div>
                                    {referenceImage && <span className="tools-item-badge">Active</span>}
                                </button>

                                <button
                                    type="button"
                                    className={`tools-dropdown-item ${isDictating ? 'dictating' : ''}`}
                                    onClick={() => {
                                        setIsToolsMenuOpen(false);
                                        toggleDictation();
                                    }}
                                    disabled={isLoading}
                                >
                                    <div className="tools-item-icon">
                                        {isDictating ? <MicOffIcon /> : <MicIcon />}
                                    </div>
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">
                                            {isDictating ? 'Stop Voice Input' : 'Voice Input / Speech'}
                                        </span>
                                        <span className="tools-item-sub">
                                            {isDictating ? 'Listening to speech...' : 'Speak prompt out loud'}
                                        </span>
                                    </div>
                                    {isDictating && <span className="tools-item-badge recording">Live</span>}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Image Seed Preview Thumbnail */}
                    {!isLoading && referenceImage && (
                        <div className="image-seed-preview" style={{ 
                            height: '32px', width: '32px', flexShrink: 0, borderRadius: '6px', 
                            overflow: 'hidden', position: 'relative',
                            border: '1px solid var(--border-color)', backgroundImage: `url(${referenceImage})`,
                            backgroundSize: 'cover', backgroundPosition: 'center'
                        }}>
                            <button 
                                type="button"
                                onClick={() => setReferenceImage(null)}
                                style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.7)', 
                                         color: '#fff', border: 'none', borderRadius: '0 0 0 4px', 
                                         width: '14px', height: '14px', display: 'flex', alignItems: 'center', 
                                         justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                                title="Remove Image Seed"
                            >
                                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                    )}

                    {(!inputValue && !isLoading && !referenceImage) && (
                        <div className="animated-placeholder" key={placeholderIndex}>
                            <span className="placeholder-text">
                                {focusedArtifactIndex !== null 
                                    ? "Edit this visual face..." 
                                    : placeholders[placeholderIndex]}
                            </span>
                            {focusedArtifactIndex === null && <span className="tab-hint">Tab</span>}
                        </div>
                    )}

                    {!isLoading ? (
                        <input 
                            ref={inputRef}
                            type="text" 
                            value={inputValue} 
                            placeholder={referenceImage && !inputValue ? "Extract palette, mood, texture..." : ""}
                            onChange={handleInputChange} 
                            onKeyDown={handleKeyDown} 
                            disabled={isLoading} 
                        />
                    ) : (
                        <div className="input-generating-label">
                            <span className="generating-prompt-text">{currentSession?.prompt}</span>
                            <ThinkingIcon />
                        </div>
                    )}

                    <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange}
                    />

                    <button 
                        type="button"
                        className="send-button" 
                        onClick={() => handleSendMessage()} 
                        disabled={isLoading || (!inputValue.trim() && !referenceImage)}
                        title="Send Prompt"
                    >
                        <ArrowUpIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

