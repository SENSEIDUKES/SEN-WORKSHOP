/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TemplateContractSection {
  id: string;
  name: string;
  description: string;
  requiredElements: string[];
}

export interface FaceTemplateContract {
  id: string;
  name: string;
  presetId: 'reader_chamber' | 'living_codex';
  description: string;
  sections: TemplateContractSection[];
  html: string;
}

/**
 * FIXED READER CHAMBER TEMPLATE
 * Preserves the exact structural hierarchy, header, viewport, preferences,
 * bookmarks, inline codex indicators, and bottom immersion/playback/navigation controls.
 */
export const READER_CHAMBER_TEMPLATE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reader Chamber — Celestial Library</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,500;0,700;1,500;1,700&family=Alegreya+SC:wght@500;700&family=Noto+Serif:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Rubik:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

    :root {
      --reader-font-size-scale: 1;
      --reader-line-height: 1.65;
      --reader-letter-spacing: 0px;
      --reader-paragraph-spacing: 1.2em;
      --color-bg: #030712;
      --color-text: #F3F4F6;
      --color-portal: #04ACFF;
      --color-accent: #D4AF37;
      --color-human: #FF3333;
    }

    body {
      background-color: var(--color-bg);
      color: var(--color-text);
      font-family: 'Noto Serif', serif;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* Font presets */
    body.font-serif { font-family: 'Noto Serif', Georgia, serif; }
    body.font-sans { font-family: 'Rubik', sans-serif; }
    body.font-display { font-family: 'Alegreya', serif; }
    body.font-sc { font-family: 'Alegreya SC', serif; }

    /* Theme presets */
    body.theme-night { --color-bg: #030712; --color-text: #F3F4F6; }
    body.theme-jade { --color-bg: #041410; --color-text: #E6F4F0; --color-portal: #10B981; }
    body.theme-parchment { --color-bg: #1A1612; --color-text: #E8DFD8; --color-portal: #D4AF37; }
    body.theme-starlight { --color-bg: #080B1A; --color-text: #E0E7FF; --color-portal: #818CF8; }

    .reader-prose p {
      font-size: calc(1.05rem * var(--reader-font-size-scale));
      line-height: var(--reader-line-height);
      letter-spacing: var(--reader-letter-spacing);
      margin-bottom: var(--reader-paragraph-spacing);
    }

    /* Codex Inline Highlights */
    .codex-indicator {
      border-bottom: 1.5px dotted var(--color-portal);
      color: var(--color-portal);
      cursor: pointer;
      padding: 0 2px;
      border-radius: 2px;
      transition: all 0.2s ease;
      background: rgba(4, 172, 255, 0.08);
    }
    .codex-indicator:hover {
      background: rgba(4, 172, 255, 0.2);
      border-bottom-style: solid;
      box-shadow: 0 0 8px rgba(4, 172, 255, 0.3);
    }

    /* SAP Vinyl Disc Spinning */
    .vinyl-disc {
      transition: transform 0.3s ease;
    }
    .vinyl-disc.spinning {
      animation: spin-vinyl 4s linear infinite;
    }
    @keyframes spin-vinyl {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Glass Panels */
    .glass-panel {
      background: rgba(10, 15, 26, 0.92);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
    }

    /* Paragraph bookmark triggers */
    .paragraph-wrapper {
      position: relative;
    }
    .paragraph-wrapper .bm-trigger {
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .paragraph-wrapper:hover .bm-trigger {
      opacity: 1;
    }
  </style>
</head>
<body class="font-serif theme-night min-h-screen flex flex-col">

  <!-- ==================== HEADER (ReaderHeader) ==================== -->
  <header id="reader-header" class="sticky top-0 z-40 w-full glass-panel border-b border-neutral-800/80 px-4 py-3 sm:px-8">
    <div class="max-w-5xl mx-auto flex items-center justify-between gap-3">
      <!-- Left: Back Button & Title -->
      <div class="flex items-center gap-3">
        <button id="btn-back" aria-label="Back to Library" title="Back to Library" class="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800/60 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <div id="story-title" class="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-portal/80">Celestial Library: Eternal Dao</div>
          <h1 id="chapter-title" class="text-sm sm:text-base font-bold text-gray-100 tracking-wide font-sans truncate max-w-xs sm:max-w-md">
            Chapter 42: Breaking the Grand Barrier
          </h1>
        </div>
      </div>

      <!-- Right: Realm Badge & Panel Toggles -->
      <div class="flex items-center gap-2 sm:gap-3">
        <span id="power-stage-badge" class="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
          Core Formation - Stage IX
        </span>
        <button id="btn-preferences" aria-label="Reader Preferences" title="Typography & Theme Preferences" class="p-2 border border-neutral-800 rounded-lg bg-neutral-900/80 text-neutral-300 hover:text-portal hover:border-portal/50 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
        </button>
        <button id="btn-bookmarks" aria-label="Cosmic Bookmarks" title="Saved Bookmarks" class="p-2 border border-neutral-800 rounded-lg bg-neutral-900/80 text-neutral-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors relative">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          <span id="bookmark-badge" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full"></span>
        </button>
        <button id="btn-fullscreen" aria-label="Toggle Fullscreen" title="Fullscreen View" class="p-2 border border-neutral-800 rounded-lg bg-neutral-900/80 text-neutral-300 hover:text-white transition-colors hidden sm:block">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
        </button>
      </div>
    </div>
  </header>

  <!-- ==================== PREFERENCES PANEL OVERLAY ==================== -->
  <aside id="panel-preferences" class="hidden fixed inset-y-0 right-0 z-50 w-80 max-w-full glass-panel p-6 border-l border-neutral-800 flex flex-col justify-between shadow-2xl">
    <div>
      <div class="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
        <h3 class="text-xs uppercase font-mono tracking-widest text-portal font-bold">Reader Controls & Aesthetics</h3>
        <button id="btn-close-prefs" class="text-neutral-400 hover:text-white p-1">✕</button>
      </div>

      <div class="space-y-6">
        <!-- Font Selection -->
        <div>
          <label class="block text-[11px] uppercase tracking-wider text-neutral-400 mb-2">Typography Font</label>
          <div class="grid grid-cols-2 gap-2">
            <button class="font-btn active p-2 text-xs border border-portal bg-portal/10 text-portal rounded text-center font-serif" data-font="serif">Serif (Noto)</button>
            <button class="font-btn p-2 text-xs border border-neutral-800 bg-neutral-900 text-neutral-300 rounded text-center font-sans" data-font="sans">Sans (Rubik)</button>
            <button class="font-btn p-2 text-xs border border-neutral-800 bg-neutral-900 text-neutral-300 rounded text-center font-display" data-font="display">Alegreya</button>
            <button class="font-btn p-2 text-xs border border-neutral-800 bg-neutral-900 text-neutral-300 rounded text-center font-sc" data-font="sc">Alegreya SC</button>
          </div>
        </div>

        <!-- Font Size Slider -->
        <div>
          <div class="flex justify-between text-xs text-neutral-300 mb-1">
            <span>Font Size Scale</span>
            <span id="val-font-size" class="font-mono text-portal">1.05x</span>
          </div>
          <input type="range" id="slider-font-size" min="0.8" max="1.5" step="0.05" value="1.05" class="w-full accent-portal bg-neutral-800 h-1.5 rounded-lg">
        </div>

        <!-- Line Height Slider -->
        <div>
          <div class="flex justify-between text-xs text-neutral-300 mb-1">
            <span>Line Spacing</span>
            <span id="val-line-height" class="font-mono text-portal">1.65</span>
          </div>
          <input type="range" id="slider-line-height" min="1.3" max="2.2" step="0.05" value="1.65" class="w-full accent-portal bg-neutral-800 h-1.5 rounded-lg">
        </div>

        <!-- Themes -->
        <div>
          <label class="block text-[11px] uppercase tracking-wider text-neutral-400 mb-2">Visual Atmosphere Theme</label>
          <div class="grid grid-cols-2 gap-2">
            <button class="theme-btn p-2.5 text-xs rounded border border-neutral-700 bg-gray-950 text-gray-100 flex items-center justify-center gap-1.5" data-theme="night">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Night Void
            </button>
            <button class="theme-btn p-2.5 text-xs rounded border border-neutral-800 bg-emerald-950 text-emerald-100 flex items-center justify-center gap-1.5" data-theme="jade">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Jade Realm
            </button>
            <button class="theme-btn p-2.5 text-xs rounded border border-neutral-800 bg-amber-950/80 text-amber-100 flex items-center justify-center gap-1.5" data-theme="parchment">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Parchment
            </button>
            <button class="theme-btn p-2.5 text-xs rounded border border-neutral-800 bg-indigo-950 text-indigo-100 flex items-center justify-center gap-1.5" data-theme="starlight">
              <span class="w-2.5 h-2.5 rounded-full bg-indigo-400"></span> Starlight
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="text-[10px] text-neutral-500 font-mono text-center pt-4 border-t border-neutral-900">
      SEN Chamber Engine v2.4
    </div>
  </aside>

  <!-- ==================== BOOKMARKS PANEL OVERLAY ==================== -->
  <aside id="panel-bookmarks" class="hidden fixed inset-y-0 right-0 z-50 w-80 max-w-full glass-panel p-6 border-l border-neutral-800 flex flex-col justify-between shadow-2xl">
    <div>
      <div class="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/></svg>
          <h3 class="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold">Cosmic Bookmarks</h3>
        </div>
        <button id="btn-close-bookmarks" class="text-neutral-400 hover:text-white p-1">✕</button>
      </div>

      <div id="bookmarks-list" class="space-y-3 overflow-y-auto max-h-[70vh] pr-1">
        <div class="p-3 bg-neutral-900/90 border border-neutral-800 rounded-lg text-xs space-y-1">
          <div class="flex justify-between items-center text-[10px] font-mono text-amber-400">
            <span>Chapter 42 • Para 3</span>
            <button class="text-red-400 hover:text-red-300">Remove</button>
          </div>
          <p class="text-neutral-300 italic line-clamp-2">"The golden lightning struck Lin Fan's ninth meridian..."</p>
          <p class="text-[10px] text-neutral-400 font-sans font-medium">Note: Momentous breakthrough point</p>
        </div>
      </div>
    </div>
    <button id="btn-add-quick-bm" class="w-full py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors">
      Bookmark Current Position
    </button>
  </aside>

  <!-- ==================== MAIN READING VIEWPORT ==================== -->
  <main id="reader-viewport" class="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:px-8">
    <!-- Chapter Banner / Hero Manifestation -->
    <div id="chapter-hero" class="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden border border-neutral-800 mb-8 bg-neutral-900 flex items-end p-6 shadow-2xl">
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
      <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80" alt="Chapter Hero" class="absolute inset-0 w-full h-full object-cover opacity-60">
      <div class="relative z-20 space-y-1">
        <span class="px-2 py-0.5 rounded bg-portal/20 text-portal border border-portal/40 text-[10px] font-mono uppercase">Momentous Event</span>
        <h2 class="text-xl sm:text-2xl font-bold text-white tracking-wide font-sans">Breakthrough at the Void Abyss</h2>
        <p class="text-xs text-neutral-300 font-serif italic">Lin Fan faces the Ninth Heavenly Tribulation alone.</p>
      </div>
    </div>

    <!-- Prose Content -->
    <article class="reader-prose space-y-6 text-neutral-200">
      <div class="paragraph-wrapper group flex gap-3">
        <span class="text-[10px] font-mono text-neutral-600 select-none pt-1">01</span>
        <div class="flex-1">
          <p data-paragraph-index="1">
            The violent surging of the <span class="codex-indicator" data-codex-term="True Qi" data-codex-desc="Pure spiritual energy cultivated inside a cultivator's dantian.">True Qi</span> within Lin Fan's dantian resounded like roaring thunderstorm waves against an unyielding cliff. He sat cross-legged on the desolate peak of Mt. Heavenly Pillar, surrounded by the swirling ancient banners of the <span class="codex-indicator" data-codex-term="Nine Sun Sect" data-codex-desc="Ancient orthodox sect residing in the Southern Flame Peaks.">Nine Sun Sect</span>.
          </p>
        </div>
        <button class="bm-trigger text-neutral-500 hover:text-amber-400 text-xs p-1" title="Bookmark paragraph">🔖</button>
      </div>

      <div class="paragraph-wrapper group flex gap-3">
        <span class="text-[10px] font-mono text-neutral-600 select-none pt-1">02</span>
        <div class="flex-1">
          <p data-paragraph-index="2">
            "If I cannot condense the Golden Core today," Lin Fan whispered, his eyes flashing with brilliant crimson light, "the thousand-year destiny of the Heavenly Dao will shatter into eternal void." He gripped the edge of his celestial robe, channeling the ancient memory of the <span class="codex-indicator" data-codex-term="Heaven-Opening Sword" data-codex-desc="Ancient divine artifact forged from primordial star-iron.">Heaven-Opening Sword</span>.
          </p>
        </div>
        <button class="bm-trigger text-neutral-500 hover:text-amber-400 text-xs p-1" title="Bookmark paragraph">🔖</button>
      </div>

      <div class="paragraph-wrapper group flex gap-3">
        <span class="text-[10px] font-mono text-neutral-600 select-none pt-1">03</span>
        <div class="flex-1">
          <p data-paragraph-index="3">
            A sudden rift tore open the celestial canopy. A gigantic manifestation of azure flame descended, carrying the divine roar of the <span class="codex-indicator" data-codex-term="Azure Dragon Realm" data-codex-desc="The realm governed by the four sacred beast lords.">Azure Dragon Realm</span>. The surrounding spiritual aura condensed into physical crystals, showering down upon the mountain peaks like shimmering stardust.
          </p>
        </div>
        <button class="bm-trigger text-neutral-500 hover:text-amber-400 text-xs p-1" title="Bookmark paragraph">🔖</button>
      </div>
    </article>
  </main>

  <!-- ==================== IMMERSION POPOVER ==================== -->
  <div id="popover-immersion" class="hidden fixed bottom-24 left-4 z-50 w-72 glass-panel p-4 rounded-xl border border-neutral-800 space-y-4 shadow-2xl">
    <div class="flex justify-between items-center border-b border-neutral-800 pb-2">
      <h4 class="text-[11px] uppercase font-mono text-portal font-bold">Immersion Control Matrix</h4>
      <span class="text-[9px] font-mono text-neutral-500">v2.4</span>
    </div>

    <div class="space-y-3 text-xs">
      <div>
        <label class="text-neutral-400 block mb-1">Narration Voice</label>
        <select class="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-neutral-200">
          <option>Celestial Sage (Deep Male)</option>
          <option>Immortal Empress (Resonant Female)</option>
          <option>Ancient Chronicle (Neutral)</option>
        </select>
      </div>

      <div>
        <label class="text-neutral-400 block mb-1">Recitation Speed</label>
        <input type="range" min="0.5" max="2" step="0.1" value="1.0" class="w-full accent-portal">
      </div>

      <div class="flex justify-between items-center pt-2 border-t border-neutral-800">
        <span class="text-neutral-300">Atmospheric Audio</span>
        <button id="toggle-ambient" class="w-10 h-5 bg-portal/20 border border-portal/40 rounded-full relative p-0.5"><div class="w-3.5 h-3.5 bg-portal rounded-full translate-x-5 transition-transform"></div></button>
      </div>
    </div>
  </div>

  <!-- ==================== CODEX PREVIEW TOOLTIP MODAL ==================== -->
  <div id="codex-tooltip" class="hidden fixed z-50 max-w-sm glass-panel p-4 rounded-xl border border-portal/40 shadow-2xl space-y-2">
    <div class="flex justify-between items-start">
      <span id="tooltip-title" class="font-bold text-sm text-portal font-sans">True Qi</span>
      <button id="close-tooltip" class="text-neutral-400 hover:text-white text-xs">✕</button>
    </div>
    <p id="tooltip-desc" class="text-xs text-neutral-300 font-serif leading-relaxed">
      Pure spiritual energy cultivated inside a cultivator's dantian.
    </p>
    <div class="pt-2 flex justify-end">
      <button class="text-[10px] uppercase font-mono text-portal hover:underline">View in Living Codex →</button>
    </div>
  </div>

  <!-- ==================== BOTTOM CONTROLS (ReaderControls) ==================== -->
  <footer id="reader-controls" class="sticky bottom-0 z-40 w-full glass-panel border-t border-neutral-800 px-4 py-3 pb-6 sm:pb-3">
    <div class="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-6">

      <!-- Left Controls: Immersion & Codex -->
      <div class="flex items-center gap-2">
        <button id="btn-immersion" aria-label="Immersion Settings" title="Immersion Controls" class="p-2.5 border border-neutral-800 rounded-full bg-neutral-900 text-neutral-300 hover:text-portal hover:border-portal/50 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"/></svg>
        </button>
        <button id="btn-codex" aria-label="Open Living Codex" title="Living Codex Lore" class="p-2.5 border border-neutral-800 rounded-full bg-neutral-900 text-neutral-300 hover:text-portal hover:border-portal/50 transition-colors flex items-center gap-1.5 px-3">
          <svg class="w-4 h-4 text-portal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          <span class="text-[11px] font-mono uppercase hidden sm:inline text-portal">Codex</span>
        </button>
      </div>

      <!-- Center: SAP Audio Playback Controls (Vinyl Disc) -->
      <div id="sap-playback-container" class="flex flex-col items-center">
        <button id="btn-sap-playback" aria-label="Toggle Rhythmic Recitation" class="group flex items-center gap-3 bg-black/80 border border-neutral-800 hover:border-portal/60 px-4 py-1.5 rounded-full transition-all shadow-lg">
          <div class="relative w-8 h-8 rounded-full bg-neutral-900 border border-portal/40 flex items-center justify-center overflow-hidden">
            <div id="vinyl-disc" class="vinyl-disc absolute inset-0 rounded-full border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black">
              <div class="absolute inset-1 rounded-full border border-dashed border-portal/30"></div>
            </div>
            <svg id="icon-play" class="w-4 h-4 text-portal relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <svg id="icon-pause" class="w-4 h-4 text-portal relative z-10 hidden" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          </div>
          <span id="label-playback" class="text-xs font-mono uppercase tracking-wider text-neutral-300 group-hover:text-portal transition-colors">
            Begin Recitation
          </span>
        </button>
      </div>

      <!-- Right: Alter Fate & Chapter Navigation -->
      <div class="flex items-center gap-2">
        <button id="btn-alter-fate" aria-label="Alter Fate" title="Alter Fate Branch" class="hidden md:flex items-center gap-1 px-3 py-1.5 bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-300 rounded-full text-xs font-mono uppercase tracking-wider transition-colors">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Alter Fate
        </button>
        <div id="chapter-navigation" class="flex items-center gap-1 border border-neutral-800 rounded-full bg-neutral-900 p-1">
          <button id="btn-prev-chapter" aria-label="Previous Chapter" class="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <span id="chapter-progress" class="text-[10px] font-mono px-2 text-neutral-300">42 / 120</span>
          <button id="btn-next-chapter" aria-label="Next Chapter" class="p-1.5 text-neutral-400 hover:text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

    </div>
  </footer>

  <!-- Script for template interactivity -->
  <script>
    // Panel toggles
    const btnPrefs = document.getElementById('btn-preferences');
    const panelPrefs = document.getElementById('panel-preferences');
    const btnClosePrefs = document.getElementById('btn-close-prefs');
    btnPrefs?.addEventListener('click', () => panelPrefs?.classList.toggle('hidden'));
    btnClosePrefs?.addEventListener('click', () => panelPrefs?.classList.add('hidden'));

    const btnBookmarks = document.getElementById('btn-bookmarks');
    const panelBookmarks = document.getElementById('panel-bookmarks');
    const btnCloseBM = document.getElementById('btn-close-bookmarks');
    btnBookmarks?.addEventListener('click', () => panelBookmarks?.classList.toggle('hidden'));
    btnCloseBM?.addEventListener('click', () => panelBookmarks?.classList.add('hidden'));

    const btnImmersion = document.getElementById('btn-immersion');
    const popoverImmersion = document.getElementById('popover-immersion');
    btnImmersion?.addEventListener('click', () => popoverImmersion?.classList.toggle('hidden'));

    // SAP Vinyl Playback
    const btnSap = document.getElementById('btn-sap-playback');
    const vinylDisc = document.getElementById('vinyl-disc');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    const labelPlayback = document.getElementById('label-playback');
    let isPlaying = false;

    btnSap?.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        vinylDisc?.classList.add('spinning');
        iconPlay?.classList.add('hidden');
        iconPause?.classList.remove('hidden');
        if (labelPlayback) labelPlayback.textContent = "Reciting Chapter...";
      } else {
        vinylDisc?.classList.remove('spinning');
        iconPlay?.classList.remove('hidden');
        iconPause?.classList.add('hidden');
        if (labelPlayback) labelPlayback.textContent = "Begin Recitation";
      }
    });

    // Font family switching
    document.querySelectorAll('.font-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('border-portal', 'bg-portal/10', 'text-portal'));
        const font = e.currentTarget.getAttribute('data-font');
        document.body.className = document.body.className.replace(/font-\\w+/g, '') + ' font-' + font;
        e.currentTarget.classList.add('border-portal', 'bg-portal/10', 'text-portal');
      });
    });

    // Theme switching
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const theme = e.currentTarget.getAttribute('data-theme');
        document.body.className = document.body.className.replace(/theme-\\w+/g, '') + ' theme-' + theme;
      });
    });

    // Font size slider
    const sliderFontSize = document.getElementById('slider-font-size');
    const valFontSize = document.getElementById('val-font-size');
    sliderFontSize?.addEventListener('input', (e) => {
      const val = e.target.value;
      document.documentElement.style.setProperty('--reader-font-size-scale', val);
      if (valFontSize) valFontSize.textContent = val + 'x';
    });

    // Codex indicator click tooltip
    const tooltip = document.getElementById('codex-tooltip');
    const tooltipTitle = document.getElementById('tooltip-title');
    const tooltipDesc = document.getElementById('tooltip-desc');
    const closeTooltip = document.getElementById('close-tooltip');

    document.querySelectorAll('.codex-indicator').forEach(el => {
      el.addEventListener('click', (e) => {
        const rect = el.getBoundingClientRect();
        if (tooltipTitle) tooltipTitle.textContent = el.getAttribute('data-codex-term') || '';
        if (tooltipDesc) tooltipDesc.textContent = el.getAttribute('data-codex-desc') || '';
        if (tooltip) {
          tooltip.style.top = (rect.bottom + 8) + 'px';
          tooltip.style.left = Math.min(rect.left, window.innerWidth - 320) + 'px';
          tooltip.classList.remove('hidden');
        }
      });
    });

    closeTooltip?.addEventListener('click', () => tooltip?.classList.add('hidden'));
  </script>
</body>
</html>`;

/**
 * FIXED LIVING CODEX TEMPLATE
 * Preserves the shell, mobile/desktop navigation, Portraits, Karma, Power,
 * Artifacts, Fate, Lore, Deep Memory toggle, and cards/panels.
 */
export const LIVING_CODEX_TEMPLATE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Living Codex — Celestial Library</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,500;0,700;1,500;1,700&family=Alegreya+SC:wght@500;700&family=Noto+Serif:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Rubik:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

    body {
      background-color: #020408;
      color: #FAFAFA;
      font-family: 'Rubik', sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }

    .codex-premium-shell {
      background: radial-gradient(ellipse 90% 60% at 50% 0%, rgba(4, 172, 255, 0.08), transparent 75%), #020408;
      min-h: 100vh;
    }

    /* Tab button active states */
    .codex-tab {
      color: #9CA3AF;
      border: 1px solid transparent;
      transition: all 0.25s ease;
    }
    .codex-tab.active {
      color: #04ACFF;
      background: rgba(4, 172, 255, 0.12);
      border-color: rgba(4, 172, 255, 0.4);
      box-shadow: 0 0 16px rgba(4, 172, 255, 0.2);
    }

    /* Panel Card Aesthetics */
    .codex-card {
      background: rgba(10, 15, 26, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(12px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .codex-card:hover {
      border-color: rgba(4, 172, 255, 0.35);
      transform: translateY(-2px);
    }

    /* Dormant lore opacity */
    .dormant-entry {
      opacity: 0.6;
      border-style: dashed;
    }
  </style>
</head>
<body class="codex-premium-shell min-h-screen flex flex-col">

  <!-- ==================== CODEX SHELL HEADER ==================== -->
  <header id="codex-header" class="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-neutral-850 px-4 py-4 sm:px-8">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-portal animate-pulse"></span>
          <span id="codex-realm-badge" class="text-[10px] font-mono uppercase tracking-widest text-portal">Nine Heavens Realm</span>
        </div>
        <h1 id="codex-title" class="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide">
          Living Codex — Celestial Library
        </h1>
      </div>

      <!-- Deep Memory / Dormant Toggle Control -->
      <div class="flex items-center gap-3 bg-neutral-900/90 border border-neutral-800 px-3 py-1.5 rounded-full">
        <label for="toggle-deep-memory" class="text-xs font-mono text-neutral-300 cursor-pointer">Deep Memory (Dormant Lore)</label>
        <button id="toggle-deep-memory" role="switch" aria-checked="false" class="w-10 h-5 bg-neutral-800 rounded-full relative p-0.5 transition-colors">
          <div id="deep-memory-knob" class="w-3.5 h-3.5 bg-neutral-400 rounded-full transition-transform"></div>
        </button>
      </div>
    </div>
  </header>

  <!-- ==================== TAB NAVIGATION BAR ==================== -->
  <nav id="codex-tab-bar" class="sticky top-[73px] z-30 bg-neutral-950/95 border-b border-neutral-900 px-4 py-2.5 overflow-x-auto shadow-md">
    <div class="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
      <button class="codex-tab active px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2" data-tab="portraits">
        <span>👤</span> Portraits & Chronicle
      </button>
      <button class="codex-tab px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2" data-tab="karma">
        <span>🕸️</span> Karma & Relations
      </button>
      <button class="codex-tab px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2" data-tab="power">
        <span>⚡</span> Power Rankings
      </button>
      <button class="codex-tab px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2" data-tab="artifacts">
        <span>🗡️</span> Artifacts & Treasures
      </button>
      <button class="codex-tab px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2" data-tab="fate">
        <span>🔮</span> Fate & World Molding
      </button>
      <button class="codex-tab px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2" data-tab="lore">
        <span>📜</span> Lore & Glossary
      </button>
    </div>
  </nav>

  <!-- ==================== MAIN CODEX CONTENT AREA ==================== -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-8 space-y-8">

    <!-- TAB 1: PORTRAITS & CHRONICLE -->
    <section id="sec-portraits" class="space-y-8">
      <!-- Chronicle Photo Memory Collage Album -->
      <div id="codex-collage" class="codex-card p-6 rounded-2xl space-y-4">
        <h3 class="text-xs uppercase font-mono tracking-widest text-portal font-bold">Chronicle Visual Collage Album</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="relative h-36 rounded-xl overflow-hidden border border-neutral-800 group">
            <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Peak">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-end">
              <span class="text-[10px] font-mono text-neutral-200">Mt. Heavenly Pillar</span>
            </div>
          </div>
          <div class="relative h-36 rounded-xl overflow-hidden border border-neutral-800 group">
            <img src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Void">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-end">
              <span class="text-[10px] font-mono text-neutral-200">The Void Abyss</span>
            </div>
          </div>
          <div class="relative h-36 rounded-xl overflow-hidden border border-neutral-800 group">
            <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Sword">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-end">
              <span class="text-[10px] font-mono text-neutral-200">Heaven-Opening Sword Manifest</span>
            </div>
          </div>
          <div class="relative h-36 rounded-xl overflow-hidden border border-neutral-800 group">
            <img src="https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=400&q=80" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Dragon">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-end">
              <span class="text-[10px] font-mono text-neutral-200">Azure Dragon Awakening</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Characters List -->
      <div class="space-y-4">
        <h3 class="text-xs uppercase font-mono tracking-widest text-portal font-bold">Primary Cultivators & Key Entities</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="codex-card p-5 rounded-xl space-y-3 cursor-pointer entry-card" data-entry-name="Lin Fan">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-portal/20 border border-portal/50 flex items-center justify-center font-bold text-portal text-lg">LF</div>
              <div>
                <h4 class="font-bold text-white font-sans text-base">Lin Fan</h4>
                <p class="text-xs text-amber-400 font-mono">Core Formation • Stage IX</p>
              </div>
            </div>
            <p class="text-xs text-neutral-300 font-serif leading-relaxed line-clamp-2">
              Protagonist born with dormant Nine-Sun Divine Meridians. Seeks to unravel the true origin of the Heavenly Dao.
            </p>
            <div class="flex gap-2 pt-1">
              <span class="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300 font-mono">Nine Sun Sect</span>
              <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">Active</span>
            </div>
          </div>

          <div class="codex-card p-5 rounded-xl space-y-3 cursor-pointer entry-card" data-entry-name="Elder Gu">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center font-bold text-amber-400 text-lg">EG</div>
              <div>
                <h4 class="font-bold text-white font-sans text-base">Elder Gu</h4>
                <p class="text-xs text-amber-400 font-mono">Nascent Soul • Stage III</p>
              </div>
            </div>
            <p class="text-xs text-neutral-300 font-serif leading-relaxed line-clamp-2">
              First Elder of Nine Sun Sect. Lin Fan's loyal master who sealed his meridians to protect him from the Shadow Clan.
            </p>
            <div class="flex gap-2 pt-1">
              <span class="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300 font-mono">Nine Sun Sect</span>
              <span class="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-mono">Mentor</span>
            </div>
          </div>

          <div class="codex-card p-5 rounded-xl space-y-3 cursor-pointer entry-card dormant-entry hidden" data-dormant="true" data-entry-name="Shadow Sovereign">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center font-bold text-red-400 text-lg">SS</div>
              <div>
                <h4 class="font-bold text-white font-sans text-base">Shadow Sovereign</h4>
                <p class="text-xs text-red-400 font-mono">Dao Ancestor • Dormant</p>
              </div>
            </div>
            <p class="text-xs text-neutral-300 font-serif leading-relaxed line-clamp-2">
              Dormant entity resting in the Abyssal Void. Ancient ruler who attempted to refine the Nine Heavens into a spirit weapon.
            </p>
            <div class="flex gap-2 pt-1">
              <span class="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-mono">Dormant lore</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TAB 2: KARMA & RELATIONS -->
    <section id="sec-karma" class="hidden space-y-8">
      <div class="codex-card p-6 rounded-2xl space-y-4">
        <h3 class="text-xs uppercase font-mono tracking-widest text-portal font-bold">Karmic Relationship Matrix</h3>
        <div class="p-6 bg-neutral-950/80 rounded-xl border border-neutral-850 flex flex-col items-center justify-center min-h-[220px] text-center space-y-3">
          <div class="flex items-center gap-4 text-xs font-mono">
            <span class="px-3 py-1.5 rounded-lg bg-portal/20 text-portal border border-portal/40">Lin Fan</span>
            <span class="text-neutral-500">── [Master / Disciple] ──</span>
            <span class="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">Elder Gu</span>
          </div>
          <div class="flex items-center gap-4 text-xs font-mono">
            <span class="px-3 py-1.5 rounded-lg bg-portal/20 text-portal border border-portal/40">Lin Fan</span>
            <span class="text-red-400">── [Mortal Enemy] ──</span>
            <span class="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40">Shadow Sovereign</span>
          </div>
        </div>
      </div>
    </section>

    <!-- TAB 3: POWER RANKINGS -->
    <section id="sec-power" class="hidden space-y-8">
      <div class="codex-card p-6 rounded-2xl space-y-4">
        <h3 class="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold">Cultivation Stage Hierarchy</h3>
        <div class="space-y-2 font-mono text-xs">
          <div class="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex justify-between items-center">
            <span>Stage VI: Dao Ancestor</span>
            <span class="text-neutral-500">Legendary</span>
          </div>
          <div class="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex justify-between items-center">
            <span>Stage V: Nascent Soul</span>
            <span class="text-amber-400">Elder Gu</span>
          </div>
          <div class="p-3 bg-portal/10 border border-portal/40 rounded-lg flex justify-between items-center text-portal font-bold">
            <span>Stage IV: Core Formation (Stage IX)</span>
            <span>Lin Fan (MC)</span>
          </div>
          <div class="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex justify-between items-center">
            <span>Stage III: Foundation Establishment</span>
            <span class="text-neutral-500">Outer Disciples</span>
          </div>
        </div>
      </div>
    </section>

    <!-- TAB 4: ARTIFACTS & TREASURES -->
    <section id="sec-artifacts" class="hidden space-y-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="codex-card p-5 rounded-xl space-y-2 border-amber-500/30">
          <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono uppercase">Heavenly Grade</span>
          <h4 class="text-base font-bold text-white">Heaven-Opening Sword</h4>
          <p class="text-xs text-neutral-300 font-serif">Forged from primordial star-iron in the First Epoch.</p>
        </div>
        <div class="codex-card p-5 rounded-xl space-y-2">
          <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-mono uppercase">Earth Grade</span>
          <h4 class="text-base font-bold text-white">Nine Dragon Cauldron</h4>
          <p class="text-xs text-neutral-300 font-serif">Ancient spirit cauldron used for refining high-grade pills.</p>
        </div>
      </div>
    </section>

    <!-- TAB 5: FATE & WORLD MOLDING -->
    <section id="sec-fate" class="hidden space-y-8">
      <div class="codex-card p-6 rounded-2xl space-y-4">
        <h3 class="text-xs uppercase font-mono tracking-widest text-red-400 font-bold">Destiny & Fate Molding Log</h3>
        <p class="text-xs text-neutral-300 font-serif">
          Logged fate alterations: Chapter 42 - Lin Fan chose to absorb the Azure Dragon core instead of destroying it.
        </p>
      </div>
    </section>

    <!-- TAB 6: LORE & GLOSSARY -->
    <section id="sec-lore" class="hidden space-y-8">
      <div class="codex-card p-6 rounded-2xl space-y-4">
        <h3 class="text-xs uppercase font-mono tracking-widest text-portal font-bold">World Glossary & Laws</h3>
        <div class="space-y-3">
          <div class="p-3 bg-neutral-900 rounded-lg">
            <h4 class="font-bold text-xs text-portal font-mono">True Qi</h4>
            <p class="text-xs text-neutral-300 font-serif">The fundamental energy of cultivation.</p>
          </div>
          <div class="p-3 bg-neutral-900 rounded-lg">
            <h4 class="font-bold text-xs text-portal font-mono">Dantian</h4>
            <p class="text-xs text-neutral-300 font-serif">The spiritual reservoir located below the navel.</p>
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- Script for Tab Navigation & Deep Memory Toggle -->
  <script>
    const tabs = document.querySelectorAll('.codex-tab');
    const sections = {
      portraits: document.getElementById('sec-portraits'),
      karma: document.getElementById('sec-karma'),
      power: document.getElementById('sec-power'),
      artifacts: document.getElementById('sec-artifacts'),
      fate: document.getElementById('sec-fate'),
      lore: document.getElementById('sec-lore')
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.getAttribute('data-tab');
        Object.keys(sections).forEach(key => {
          if (sections[key]) {
            if (key === target) sections[key].classList.remove('hidden');
            else sections[key].classList.add('hidden');
          }
        });
      });
    });

    // Deep Memory Toggle
    const btnToggleDeep = document.getElementById('toggle-deep-memory');
    const knobDeep = document.getElementById('deep-memory-knob');
    let isDeepActive = false;

    btnToggleDeep?.addEventListener('click', () => {
      isDeepActive = !isDeepActive;
      btnToggleDeep.setAttribute('aria-checked', isDeepActive ? 'true' : 'false');
      if (isDeepActive) {
        knobDeep?.classList.add('translate-x-5', 'bg-portal');
        document.querySelectorAll('[data-dormant="true"]').forEach(el => el.classList.remove('hidden'));
      } else {
        knobDeep?.classList.remove('translate-x-5', 'bg-portal');
        document.querySelectorAll('[data-dormant="true"]').forEach(el => el.classList.add('hidden'));
      }
    });
  </script>
</body>
</html>`;

export const FIXED_FACE_TEMPLATES: Record<string, FaceTemplateContract> = {
  reader_chamber: {
    id: 'reader_chamber',
    name: 'Reader Chamber',
    presetId: 'reader_chamber',
    description: 'Fixed structural face template for the Reader Chamber reading experience.',
    sections: [
      {
        id: 'header',
        name: 'Reader Header',
        description: 'Header with back navigation, story & chapter title, power stage badge, and panel toggles.',
        requiredElements: ['#reader-header', '#story-title', '#chapter-title', '#power-stage-badge', '#btn-preferences', '#btn-bookmarks', '#btn-fullscreen']
      },
      {
        id: 'viewport',
        name: 'Reading Viewport',
        description: 'Main chapter viewport with hero image, prose paragraphs, and inline codex term indicators.',
        requiredElements: ['#reader-viewport', '#chapter-hero', '.reader-prose', '.codex-indicator']
      },
      {
        id: 'preferences_panel',
        name: 'Preferences Panel',
        description: 'Slide-out panel for font families, font size scale, line height, and atmosphere themes.',
        requiredElements: ['#panel-preferences', '#slider-font-size', '#slider-line-height', '.font-btn', '.theme-btn']
      },
      {
        id: 'bookmarks_panel',
        name: 'Cosmic Bookmarks Panel',
        description: 'Panel for saved paragraph bookmarks, custom notes, and quick position saving.',
        requiredElements: ['#panel-bookmarks', '#bookmarks-list', '#btn-add-quick-bm']
      },
      {
        id: 'bottom_controls',
        name: 'Responsive Bottom Controls',
        description: 'Bottom bar containing immersion settings, Codex access, SAP audio recitation vinyl control, alter fate, and chapter navigation.',
        requiredElements: ['#reader-controls', '#btn-immersion', '#btn-codex', '#sap-playback-container', '#btn-sap-playback', '#vinyl-disc', '#btn-alter-fate', '#chapter-navigation', '#btn-prev-chapter', '#btn-next-chapter']
      }
    ],
    html: READER_CHAMBER_TEMPLATE_HTML
  },
  living_codex: {
    id: 'living_codex',
    name: 'Living Codex',
    presetId: 'living_codex',
    description: 'Fixed structural face template for the Living Codex lore companion.',
    sections: [
      {
        id: 'shell_header',
        name: 'Codex Shell Header',
        description: 'Shell header with codex title, realm badge, and Deep Memory / Dormant toggle.',
        requiredElements: ['#codex-header', '#codex-title', '#codex-realm-badge', '#toggle-deep-memory']
      },
      {
        id: 'tab_bar',
        name: 'Navigation Tab Bar',
        description: 'Responsive tab bar for Portraits, Karma, Power, Artifacts, Fate, and Lore.',
        requiredElements: ['#codex-tab-bar', '.codex-tab[data-tab="portraits"]', '.codex-tab[data-tab="karma"]', '.codex-tab[data-tab="power"]', '.codex-tab[data-tab="artifacts"]', '.codex-tab[data-tab="fate"]', '.codex-tab[data-tab="lore"]']
      },
      {
        id: 'portraits_section',
        name: 'Portraits & Chronicle',
        description: 'Collage album, character cards, beasts, factions, locations, and visual story recaps.',
        requiredElements: ['#sec-portraits', '#codex-collage', '.entry-card']
      },
      {
        id: 'karma_section',
        name: 'Karma & Relations',
        description: 'Karmic relationship matrix, affinity webs, and unresolved plot threads.',
        requiredElements: ['#sec-karma']
      },
      {
        id: 'power_section',
        name: 'Power Rankings',
        description: 'Cultivation power stage hierarchy and cultivation analytics.',
        requiredElements: ['#sec-power']
      },
      {
        id: 'artifacts_section',
        name: 'Artifacts & Treasures',
        description: 'Heavenly treasures, spirit weapons, and magic cauldron cards.',
        requiredElements: ['#sec-artifacts']
      },
      {
        id: 'fate_section',
        name: 'Fate & World Molding',
        description: 'Destiny molding log and alter fate choices.',
        requiredElements: ['#sec-fate']
      },
      {
        id: 'lore_section',
        name: 'Lore & Glossary',
        description: 'World glossary terms index and laws of the realm.',
        requiredElements: ['#sec-lore']
      }
    ],
    html: LIVING_CODEX_TEMPLATE_HTML
  }
};

export function getTemplateForPreset(presetIdOrLabel: string): FaceTemplateContract {
  const normalized = presetIdOrLabel.toLowerCase().replace(/[\s_]+/g, '_');
  if (normalized.includes('codex')) {
    return FIXED_FACE_TEMPLATES.living_codex;
  }
  return FIXED_FACE_TEMPLATES.reader_chamber;
}
