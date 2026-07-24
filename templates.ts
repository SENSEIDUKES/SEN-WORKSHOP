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
 * bookmarks, inline codex indicators, immersion popover, and responsive bottom controls.
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
  </style>
</head>
<body class="theme-night font-serif min-h-screen pb-28">

  <!-- HEADER CHAMBER (#reader-header) -->
  <header id="reader-header" class="sticky top-0 z-40 w-full backdrop-blur-md bg-gray-950/85 border-b border-gray-800/80 px-4 py-3 transition-all duration-200">
    <div class="max-w-6xl mx-auto flex items-center justify-between gap-3">
      
      <!-- Left Navigation & Title Context -->
      <div class="flex items-center gap-3">
        <a href="#back" class="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors" title="Return to Library">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </a>
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span id="story-title" class="text-xs uppercase tracking-widest text-sky-400 font-semibold font-sans">Celestial Library: Eternal Dao</span>
            <span id="sealed-badge" class="lock-indicator hidden sm:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-sans">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Sealed Scripture
            </span>
          </div>
          <h1 id="chapter-title" class="text-sm md:text-base font-bold text-gray-100 truncate max-w-xs md:max-w-md font-serif">
            Chapter 42: The Nine Heavens Alignment
          </h1>
        </div>
      </div>

      <!-- Center Power Stage Badge & Continuity Warning -->
      <div class="hidden lg:flex items-center gap-2">
        <span id="power-stage-badge" class="text-xs px-2.5 py-1 rounded-full bg-sky-950/80 border border-sky-500/30 text-sky-300 font-sans tracking-wide">
          Foundation Establishment Peak
        </span>
        <span id="continuity-divergence-badge" class="continuity-fault hidden text-xs px-2 py-0.5 rounded bg-red-950/80 border border-red-500/30 text-red-400 font-sans">
          Timeline Fault: Divergence
        </span>
      </div>

      <!-- Right Header Actions -->
      <div class="flex items-center gap-2">
        <select id="chapter-select" class="hidden sm:block text-xs bg-gray-900 border border-gray-800 text-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500">
          <option value="42">Ch. 42: Nine Heavens</option>
          <option value="43">Ch. 43: Ancestral Dao</option>
          <option value="44">Ch. 44: Celestial Fate</option>
        </select>

        <button id="audio-widget" class="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-sky-400 transition-colors relative" title="Audio Recitation Matrix">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
        </button>

        <button id="btn-mark-read" class="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-emerald-400 transition-colors" title="Mark Chapter Finished">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        </button>

        <button id="btn-preferences" class="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-sky-400 transition-colors" title="Aetherial Styles & Reader Preferences">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
        </button>

        <button id="btn-bookmarks" class="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-amber-400 transition-colors relative" title="Chronicle Anchors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          <span id="bookmark-badge" class="absolute -top-1 -right-1 text-[10px] bg-amber-500 text-black font-bold rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </button>

        <button id="btn-fullscreen" class="hidden sm:p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors" title="Toggle Fullscreen">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
        </button>
      </div>
    </div>
  </header>

  <!-- MAIN READING VIEWPORT (#reader-viewport) -->
  <main id="reader-viewport" class="max-w-3xl mx-auto px-4 md:px-6 py-8">
    
    <!-- Hero / Banner Manifestation (#chapter-hero) -->
    <div id="chapter-hero" class="mb-10 rounded-2xl overflow-hidden border border-sky-500/20 bg-gradient-to-b from-sky-950/40 via-gray-900/60 to-gray-950 p-6 md:p-8 relative">
      <div class="absolute top-3 right-3 text-[10px] font-sans tracking-widest text-sky-400/80 uppercase border border-sky-500/30 px-2 py-0.5 rounded-full">
        Celestial Manifestation
      </div>
      <div id="hero-image" class="w-full h-48 md:h-64 rounded-xl bg-cover bg-center mb-6 border border-gray-800 shadow-2xl relative" style="background-image: url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop')">
        <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
      </div>
      <h2 class="text-2xl md:text-3xl font-bold text-gray-100 font-serif mb-2">
        The Alignment of the Nine Stellar Arrays
      </h2>
      <p class="text-sm text-gray-400 font-sans leading-relaxed">
        As ancient resonant energy pulses across the Azure Sky Continent, Xiao Chen stands atop the Void Cauldron Peak, observing the karmic threads connecting all living beings.
      </p>
    </div>

    <!-- PROSE CONTENT AREA (.reader-prose) -->
    <article class="reader-prose space-y-6 text-gray-200">
      <p data-paragraph-index="1" class="relative group">
        <span class="bm-trigger absolute -left-6 top-1 opacity-0 group-hover:opacity-100 text-amber-500 cursor-pointer transition-opacity" title="Anchor Bookmark">🔖</span>
        The night sky above <span class="codex-indicator" data-codex-term="Void Cauldron Peak" data-codex-desc="The sacred pinnacle where ancient cultivators aligned heavenly star arrays.">Void Cauldron Peak</span> shimmered with ethereal violet light. A cold wind swept through the pine forest below, carrying the subtle fragrance of refined spirit pills.
      </p>

      <p data-paragraph-index="2" class="relative group">
        <span class="bm-trigger absolute -left-6 top-1 opacity-0 group-hover:opacity-100 text-amber-500 cursor-pointer transition-opacity" title="Anchor Bookmark">🔖</span>
        Xiao Chen closed his eyes, extending his divine sense into the <span class="codex-indicator" data-codex-term="Nine Heavens Star Array" data-codex-desc="A supreme spatial formation created during the Primordial Era.">Nine Heavens Star Array</span>. Every pulse of spiritual qi resonated with the fundamental rhythm of his dantian. He could feel the celestial barriers weakening as the ancient prophecy approached its fulfillment.
      </p>

      <p data-paragraph-index="3" class="relative group">
        <span class="bm-trigger absolute -left-6 top-1 opacity-0 group-hover:opacity-100 text-amber-500 cursor-pointer transition-opacity" title="Anchor Bookmark">🔖</span>
        "Master," whispered <span class="codex-indicator" data-codex-term="Ling Yue" data-codex-desc="Senior Disciple of the Azure Lotus Faction and master of the Ice Phoenix Sword.">Ling Yue</span>, stepping softly onto the stone platform, her Ice Phoenix Blade gleaming with frosty aura. "The patriarchs of the five great factions have gathered at the base of the mountain. They await your command regarding the dormant artifact."
      </p>

      <p data-paragraph-index="4" class="relative group">
        <span class="bm-trigger absolute -left-6 top-1 opacity-0 group-hover:opacity-100 text-amber-500 cursor-pointer transition-opacity" title="Anchor Bookmark">🔖</span>
        Xiao Chen opened his eyes, a flare of golden stellar flame igniting within his pupils. "Let them wait. The destiny of the Nine Heavens Realm cannot be dictated by those who fear the void."
      </p>
    </article>

    <!-- Inline Codex Tooltip (#codex-tooltip) -->
    <div id="codex-tooltip" class="hidden fixed z-50 max-w-xs p-4 bg-gray-900/95 border border-sky-500/40 rounded-xl shadow-2xl backdrop-blur-md text-xs font-sans">
      <div class="flex justify-between items-start mb-1">
        <span id="tooltip-title" class="font-bold text-sky-400 font-serif text-sm">Void Cauldron Peak</span>
        <button id="close-tooltip" class="text-gray-500 hover:text-white">✕</button>
      </div>
      <p id="tooltip-desc" class="text-gray-300 leading-relaxed">
        The sacred pinnacle where ancient cultivators aligned heavenly star arrays during the Primordial Era.
      </p>
    </div>
  </main>

  <!-- PREFERENCES PANEL (#panel-preferences) -->
  <aside id="panel-preferences" class="hidden fixed top-0 right-0 h-full w-80 z-50 bg-gray-950/95 border-l border-gray-800 backdrop-blur-xl p-6 shadow-2xl overflow-y-auto text-sm font-sans transition-transform duration-300">
    <div class="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
      <h3 class="font-bold text-gray-100 font-serif tracking-wide text-base">Aetherial Styles</h3>
      <button id="btn-close-prefs" class="p-1 rounded text-gray-400 hover:text-white">✕</button>
    </div>

    <!-- Font Family Selection -->
    <div class="mb-6 space-y-2">
      <label class="text-xs uppercase font-semibold text-gray-400">Typography Treatment</label>
      <div class="grid grid-cols-2 gap-2">
        <button class="font-btn active p-2.5 rounded-lg bg-sky-950 border border-sky-500/50 text-sky-300 font-serif text-xs text-left" data-font="serif">Noto Serif</button>
        <button class="font-btn p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 font-sans text-xs text-left" data-font="sans">Rubik Sans</button>
        <button class="font-btn p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 font-serif text-xs text-left" data-font="display">Alegreya</button>
        <button class="font-btn p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 font-serif text-xs text-left" data-font="sc">Alegreya SC</button>
      </div>
    </div>

    <!-- Font Size Slider -->
    <div class="mb-6 space-y-2">
      <div class="flex justify-between text-xs">
        <span class="text-gray-400 font-semibold uppercase">Text Scale</span>
        <span id="val-font-size" class="text-sky-400 font-mono">100%</span>
      </div>
      <input id="slider-font-size" type="range" min="80" max="150" value="100" class="w-full accent-sky-500 bg-gray-800 h-1.5 rounded-lg appearance-none cursor-pointer">
    </div>

    <!-- Line Height Slider -->
    <div class="mb-6 space-y-2">
      <div class="flex justify-between text-xs">
        <span class="text-gray-400 font-semibold uppercase">Line Spacing</span>
        <span id="val-line-height" class="text-sky-400 font-mono">1.65</span>
      </div>
      <input id="slider-line-height" type="range" min="130" max="220" value="165" class="w-full accent-sky-500 bg-gray-800 h-1.5 rounded-lg appearance-none cursor-pointer">
    </div>

    <!-- Atmosphere Theme Preset -->
    <div class="mb-6 space-y-2">
      <label class="text-xs uppercase font-semibold text-gray-400">Atmosphere Realm</label>
      <div class="grid grid-cols-2 gap-2">
        <button class="theme-btn active p-2.5 rounded-lg bg-gray-950 border border-sky-500 text-sky-300 text-xs flex items-center gap-2" data-theme="night">
          <span class="w-3 h-3 rounded-full bg-gray-950 border border-gray-700"></span> Night Void
        </button>
        <button class="theme-btn p-2.5 rounded-lg bg-emerald-950 border border-gray-800 text-emerald-200 text-xs flex items-center gap-2" data-theme="jade">
          <span class="w-3 h-3 rounded-full bg-emerald-950 border border-emerald-700"></span> Jade Realm
        </button>
        <button class="theme-btn p-2.5 rounded-lg bg-amber-950 border border-gray-800 text-amber-200 text-xs flex items-center gap-2" data-theme="parchment">
          <span class="w-3 h-3 rounded-full bg-amber-950 border border-amber-700"></span> Parchment
        </button>
        <button class="theme-btn p-2.5 rounded-lg bg-indigo-950 border border-gray-800 text-indigo-200 text-xs flex items-center gap-2" data-theme="starlight">
          <span class="w-3 h-3 rounded-full bg-indigo-950 border border-indigo-700"></span> Starlight
        </button>
      </div>
    </div>
  </aside>

  <!-- BOOKMARKS PANEL (#panel-bookmarks) -->
  <aside id="panel-bookmarks" class="hidden fixed top-0 right-0 h-full w-80 z-50 bg-gray-950/95 border-l border-gray-800 backdrop-blur-xl p-6 shadow-2xl overflow-y-auto text-sm font-sans transition-transform duration-300">
    <div class="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
      <h3 class="font-bold text-gray-100 font-serif tracking-wide text-base">Chronicle Anchors</h3>
      <button id="btn-close-bookmarks" class="p-1 rounded text-gray-400 hover:text-white">✕</button>
    </div>

    <button id="btn-add-quick-bm" class="w-full mb-6 py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-xs">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
      Anchor Current Position
    </button>

    <div id="bookmarks-list" class="space-y-3">
      <div class="p-3 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1">
        <div class="flex justify-between items-center text-[10px] text-gray-400">
          <span>Paragraph 1 • Ch. 42</span>
          <button class="text-red-400 hover:text-red-300">Remove</button>
        </div>
        <p class="text-xs text-gray-200 font-serif line-clamp-2">"The night sky above Void Cauldron Peak shimmered with ethereal violet light..."</p>
      </div>
    </div>
  </aside>

  <!-- IMMERSION SETTINGS POPOVER (#popover-immersion) -->
  <div id="popover-immersion" class="hidden fixed bottom-20 left-4 md:left-auto md:right-8 z-50 w-80 p-5 bg-gray-950/95 border border-sky-500/30 rounded-2xl shadow-2xl backdrop-blur-xl text-xs font-sans space-y-4">
    <div class="flex justify-between items-center border-b border-gray-800 pb-3">
      <span class="font-bold text-gray-200 text-sm font-serif">Immersion & Audio Matrix</span>
      <button id="close-immersion" class="text-gray-400 hover:text-white">✕</button>
    </div>

    <!-- Toggles -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-gray-300">Auto Scroll Flow</span>
        <button id="toggle-auto-scroll" class="w-9 h-5 bg-gray-800 rounded-full p-0.5 transition-colors relative" aria-checked="false">
          <span class="block w-4 h-4 bg-gray-400 rounded-full transition-transform"></span>
        </button>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-gray-300">Holographic Visions</span>
        <button id="toggle-image-popups" class="w-9 h-5 bg-sky-600 rounded-full p-0.5 transition-colors relative" aria-checked="true">
          <span class="block w-4 h-4 bg-white rounded-full translate-x-4 transition-transform"></span>
        </button>
      </div>
    </div>

    <!-- Audio Recitation Menu (#audio-menu) -->
    <div id="audio-menu" class="pt-3 border-t border-gray-800 space-y-2.5">
      <span class="text-gray-400 uppercase font-semibold text-[10px] tracking-wider">Voice Matrix Signatures</span>
      
      <div class="space-y-1">
        <label class="text-[10px] text-gray-400">Narrator Voice</label>
        <select id="narrator-voice" class="w-full bg-gray-900 border border-gray-800 text-gray-200 rounded-lg p-1.5 text-xs">
          <option value="deep_sage">Celestial Elder (Deep Male)</option>
          <option value="immortal_maiden">Azure Maiden (Calm Female)</option>
        </select>
      </div>

      <div class="space-y-1">
        <label class="text-[10px] text-gray-400">Dialogue Matrix</label>
        <select id="dialogue-voice" class="w-full bg-gray-900 border border-gray-800 text-gray-200 rounded-lg p-1.5 text-xs">
          <option value="dynamic">Polymorphic Character Sync</option>
          <option value="monotone">Unified Reciter</option>
        </select>
      </div>

      <div class="space-y-1 hidden">
        <select id="side-voice"><option value="default">Default</option></select>
      </div>

      <div class="flex items-center justify-between pt-2">
        <button id="btn-speech-rate" class="px-2.5 py-1 bg-gray-900 border border-gray-800 rounded text-sky-400 text-[11px]">Speed: 1.0x</button>
        <button id="btn-export-text" class="px-2.5 py-1 bg-gray-900 border border-gray-800 rounded text-gray-300 hover:text-white text-[11px]">Export Chapter</button>
      </div>
    </div>
  </div>

  <!-- RESPONSIVE BOTTOM CONTROLS (#reader-controls) -->
  <footer id="reader-controls" class="fixed bottom-0 left-0 right-0 z-40 bg-gray-950/90 border-t border-gray-800/80 backdrop-blur-md px-4 py-3">
    
    <!-- MOBILE CONTROLS ROW (.mobile-controls / flex sm:hidden) -->
    <div class="mobile-controls flex sm:hidden items-center justify-between gap-2">
      
      <!-- Left Controls: Immersion & Codex Link -->
      <div class="flex items-center gap-2">
        <button id="btn-immersion" class="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-sky-400" title="Immersion Settings">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </button>
        <button id="btn-codex" class="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sky-400 hover:text-sky-300" title="Living Codex">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        </button>
      </div>

      <!-- Center SAP Vinyl Disc Playback (#sap-playback-container / #btn-sap-playback) -->
      <div id="sap-playback-container" class="flex items-center gap-2">
        <button id="btn-sap-playback" class="p-2 bg-sky-950 border border-sky-500/40 rounded-full flex items-center justify-center shadow-lg shadow-sky-500/20 group">
          <div id="vinyl-disc" class="vinyl-disc w-8 h-8 rounded-full bg-gray-900 border-2 border-gray-800 flex items-center justify-center relative">
            <span class="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span id="icon-play" class="absolute text-white text-[10px]">▶</span>
            <span id="icon-pause" class="absolute text-white text-[10px] hidden">⏸</span>
          </div>
        </button>
      </div>

      <!-- Right Controls: Alter Fate & Chapter Nav -->
      <div class="flex items-center gap-2">
        <button id="btn-alter-fate" class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20" title="Alter Fate Branch">
          ⚡
        </button>
        <div id="chapter-navigation" class="flex items-center bg-gray-900 border border-gray-800 rounded-xl p-1">
          <button id="btn-prev-chapter" class="p-1.5 text-gray-400 hover:text-white">◀</button>
          <span id="chapter-progress" class="text-[11px] px-1 text-gray-400 font-mono">42/100</span>
          <button id="btn-next-chapter" class="p-1.5 text-gray-400 hover:text-white">▶</button>
        </div>
      </div>
    </div>

    <!-- DESKTOP CONTROLS ROW (.desktop-controls / hidden sm:flex) -->
    <div class="desktop-controls hidden sm:flex items-center justify-between max-w-6xl mx-auto">
      
      <!-- Desktop TTS / Audio Recitation Playback -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3 bg-gray-900/90 border border-gray-800 rounded-2xl px-3 py-1.5">
          <div class="vinyl-disc-desktop w-9 h-9 rounded-full bg-gray-950 border-2 border-sky-500/40 flex items-center justify-center shadow-md shadow-sky-500/10">
            <span class="w-3 h-3 rounded-full bg-sky-400 animate-pulse"></span>
          </div>
          <div class="flex flex-col">
            <span id="playback-title" class="text-xs font-bold text-gray-200">Listen to Chapter</span>
            <span id="playback-subtitle" class="text-[10px] text-sky-400 font-sans">Rhythmic Recitation Active</span>
          </div>
        </div>

        <button id="btn-immersion-desktop" class="px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-300 hover:text-white flex items-center gap-2">
          ⚙️ Immersion Settings
        </button>
      </div>

      <!-- Desktop Navigation & Alter Fate -->
      <div class="flex items-center gap-3">
        <button id="btn-alter-fate-desktop" class="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-medium flex items-center gap-2">
          ⚡ Alter Fate Branch
        </button>

        <div id="chapter-nav-desktop" class="flex items-center bg-gray-900 border border-gray-800 rounded-xl p-1 gap-2">
          <button id="btn-prev-chapter-desktop" class="px-3 py-1.5 text-xs text-gray-300 hover:text-white">← Prev</button>
          <button id="btn-codex-desktop" class="px-3 py-1.5 text-xs text-sky-400 font-semibold border-x border-gray-800">Living Codex</button>
          <button id="btn-next-chapter-desktop" class="px-3 py-1.5 text-xs text-gray-300 hover:text-white">Next →</button>
        </div>
      </div>
    </div>
  </footer>

  <script>
    // Reader Chamber Interactive Controls
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
    const btnImmersionDesktop = document.getElementById('btn-immersion-desktop');
    const popoverImmersion = document.getElementById('popover-immersion');
    const closeImmersion = document.getElementById('close-immersion');

    btnImmersion?.addEventListener('click', () => popoverImmersion?.classList.toggle('hidden'));
    btnImmersionDesktop?.addEventListener('click', () => popoverImmersion?.classList.toggle('hidden'));
    closeImmersion?.addEventListener('click', () => popoverImmersion?.classList.add('hidden'));

    // Font family switching
    document.querySelectorAll('.font-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active', 'bg-sky-950', 'border-sky-500/50', 'text-sky-300'));
        btn.classList.add('active', 'bg-sky-950', 'border-sky-500/50', 'text-sky-300');
        const font = btn.getAttribute('data-font');
        document.body.className = document.body.className.replace(/font-\\w+/g, '') + ' font-' + font;
      });
    });

    // Font size scaling
    const sliderFont = document.getElementById('slider-font-size');
    const valFont = document.getElementById('val-font-size');
    sliderFont?.addEventListener('input', (e) => {
      const val = e.target.value;
      if (valFont) valFont.innerText = val + '%';
      document.documentElement.style.setProperty('--reader-font-size-scale', val / 100);
    });

    // Line height scaling
    const sliderLH = document.getElementById('slider-line-height');
    const valLH = document.getElementById('val-line-height');
    sliderLH?.addEventListener('input', (e) => {
      const val = (e.target.value / 100).toFixed(2);
      if (valLH) valLH.innerText = val;
      document.documentElement.style.setProperty('--reader-line-height', val);
    });

    // Theme switching
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        document.body.className = document.body.className.replace(/theme-\\w+/g, '') + ' theme-' + theme;
      });
    });

    // Codex Tooltip hover triggers
    document.querySelectorAll('.codex-indicator').forEach(el => {
      el.addEventListener('click', (e) => {
        const term = el.getAttribute('data-codex-term');
        const desc = el.getAttribute('data-codex-desc');
        const tooltip = document.getElementById('codex-tooltip');
        const titleEl = document.getElementById('tooltip-title');
        const descEl = document.getElementById('tooltip-desc');

        if (tooltip && titleEl && descEl) {
          titleEl.innerText = term || 'Codex Term';
          descEl.innerText = desc || 'Information recorded in the Living Codex.';
          tooltip.style.top = Math.min(e.clientY + 10, window.innerHeight - 150) + 'px';
          tooltip.style.left = Math.min(e.clientX + 10, window.innerWidth - 300) + 'px';
          tooltip.classList.remove('hidden');
        }
      });
    });

    document.getElementById('close-tooltip')?.addEventListener('click', () => {
      document.getElementById('codex-tooltip')?.classList.add('hidden');
    });

    // Vinyl SAP Disc Spinning toggle
    const btnPlayback = document.getElementById('btn-sap-playback');
    const vinylDisc = document.getElementById('vinyl-disc');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    let isPlaying = false;

    btnPlayback?.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        vinylDisc?.classList.add('spinning');
        iconPlay?.classList.add('hidden');
        iconPause?.classList.remove('hidden');
      } else {
        vinylDisc?.classList.remove('spinning');
        iconPlay?.classList.remove('hidden');
        iconPause?.classList.add('hidden');
      }
    });
  </script>
</body>
</html>`;

/**
 * FIXED LIVING CODEX TEMPLATE
 * Preserves horizontal mobile navigation, vertical desktop sidebar, responsive content area,
 * Deep Memory dormant toggle, and all required sections: Portraits, Karma, Power, Artifacts, Fate, Lore.
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

    :root {
      --color-portal: #04ACFF;
      --color-gold: #D4AF37;
      --color-karma: #A855F7;
    }

    body {
      background-color: #030712;
      color: #F3F4F6;
      font-family: 'Rubik', sans-serif;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }

    .codex-tab.active {
      background: rgba(4, 172, 255, 0.15);
      border-color: #04ACFF;
      color: #38BDF8;
    }
  </style>
</head>
<body class="min-h-screen bg-gray-950 text-gray-100">

  <!-- CODEX CONTAINER / SHELL (#living-codex-container / .codex-premium-shell) -->
  <div id="living-codex-container" class="codex-premium-shell max-w-7xl mx-auto p-4 md:p-6 space-y-6">
    
    <!-- HEADER SECTION (#codex-header) -->
    <header id="codex-header" class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-gray-900 via-sky-950/40 to-gray-900 border border-sky-500/30 relative overflow-hidden shadow-2xl">
      <div class="flex items-center gap-4 z-10">
        <div class="w-12 h-12 rounded-xl bg-sky-950 border border-sky-500/40 flex items-center justify-center text-sky-400 text-2xl font-serif shadow-inner">
          📜
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span id="codex-realm-badge" class="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300">
              Nine Heavens Realm
            </span>
          </div>
          <h1 id="codex-title" class="text-xl md:text-2xl font-bold font-serif text-gray-100 tracking-wide mt-0.5">
            Living Codex — Divine Registry
          </h1>
        </div>
      </div>

      <!-- Deep Memory Control (#toggle-deep-memory) -->
      <div class="flex items-center gap-3 z-10 bg-gray-950/80 p-2.5 rounded-xl border border-gray-800">
        <div class="flex flex-col text-right">
          <span class="text-xs font-semibold text-gray-200">Deep Memory Access</span>
          <span class="text-[10px] text-amber-400">4 Dormant Entries</span>
        </div>
        <button id="toggle-deep-memory" class="w-11 h-6 bg-gray-800 rounded-full p-1 relative transition-colors" aria-checked="false">
          <span id="deep-memory-knob" class="block w-4 h-4 bg-gray-400 rounded-full transition-transform"></span>
        </button>
      </div>
    </header>

    <!-- RESPONSIVE NAVIGATION & CONTENT SPLIT -->
    <div class="flex flex-col md:flex-row gap-6">
      
      <!-- SIDEBAR / TOP SCROLLER NAVIGATION (#codex-side-nav / #codex-tab-scroller) -->
      <nav id="codex-side-nav" class="w-full md:w-64 flex-shrink-0">
        <div id="codex-tab-scroller" class="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-2 p-1.5 bg-gray-900/80 rounded-2xl border border-gray-800">
          
          <button class="codex-tab active whitespace-nowrap px-4 py-3 rounded-xl border border-transparent text-left font-medium text-xs text-gray-300 hover:text-white transition-all flex items-center gap-3" data-tab="portraits">
            <span>🎨</span> Portraits & Chronicle
          </button>

          <button class="codex-tab whitespace-nowrap px-4 py-3 rounded-xl border border-transparent text-left font-medium text-xs text-gray-300 hover:text-white transition-all flex items-center gap-3" data-tab="karma">
            <span>☯️</span> Karma & Relations
          </button>

          <button class="codex-tab whitespace-nowrap px-4 py-3 rounded-xl border border-transparent text-left font-medium text-xs text-gray-300 hover:text-white transition-all flex items-center gap-3" data-tab="power">
            <span>⚡</span> Power Rankings
          </button>

          <button class="codex-tab whitespace-nowrap px-4 py-3 rounded-xl border border-transparent text-left font-medium text-xs text-gray-300 hover:text-white transition-all flex items-center gap-3" data-tab="artifacts">
            <span>🗡️</span> Artifacts & Treasures
          </button>

          <button class="codex-tab whitespace-nowrap px-4 py-3 rounded-xl border border-transparent text-left font-medium text-xs text-gray-300 hover:text-white transition-all flex items-center gap-3" data-tab="fate">
            <span>🌌</span> Fate & World Molding
          </button>

          <button class="codex-tab whitespace-nowrap px-4 py-3 rounded-xl border border-transparent text-left font-medium text-xs text-gray-300 hover:text-white transition-all flex items-center gap-3" data-tab="lore">
            <span>📚</span> Lore & Glossary
          </button>

          <a id="btn-back-reader" href="#reader" class="hidden md:flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-sky-400 hover:text-sky-300">
            ← Return to Reader Chamber
          </a>
        </div>
      </nav>

      <!-- RESPONSIVE CONTENT AREA (#codex-content-area) -->
      <main id="codex-content-area" class="flex-1 bg-gray-900/60 rounded-2xl border border-gray-800 p-6">
        
        <!-- SECTION 1: PORTRAITS & CHRONICLE (#sec-portraits) -->
        <section id="sec-portraits" class="space-y-8">
          
          <!-- Visual Collage Album (#codex-collage) -->
          <div id="codex-collage" class="p-4 rounded-xl bg-gray-950/80 border border-sky-500/20 space-y-3">
            <h3 class="text-sm font-bold font-serif text-sky-400 uppercase tracking-wider">Chronicle Photo Memory Collage</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div class="h-28 rounded-lg bg-cover bg-center border border-gray-800" style="background-image: url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop')"></div>
              <div class="h-28 rounded-lg bg-cover bg-center border border-gray-800" style="background-image: url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop')"></div>
              <div class="h-28 rounded-lg bg-cover bg-center border border-gray-800" style="background-image: url('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop')"></div>
              <div class="h-28 rounded-lg bg-cover bg-center border border-gray-800" style="background-image: url('https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=400&auto=format&fit=crop')"></div>
            </div>
          </div>

          <!-- Characters Grid (#codex-characters) -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold font-serif text-gray-200 uppercase tracking-wider">Primary Cultivators</h3>
            <div id="codex-characters" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div class="entry-card p-4 rounded-xl bg-gray-950 border border-gray-800 hover:border-sky-500/50 transition-all flex gap-4">
                <div class="w-16 h-16 rounded-xl bg-sky-950 border border-sky-500/30 flex items-center justify-center text-xl flex-shrink-0">
                  ⚔️
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-gray-100 text-sm font-serif">Xiao Chen</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30">Protagonist</span>
                  </div>
                  <p class="text-xs text-gray-400 mt-1 leading-relaxed">
                    Master of the Nine Heavens Sword Assembly. Bearer of the Primordial Dantain.
                  </p>
                </div>
              </div>

              <div class="entry-card p-4 rounded-xl bg-gray-950 border border-gray-800 hover:border-sky-500/50 transition-all flex gap-4">
                <div class="w-16 h-16 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-xl flex-shrink-0">
                  🪷
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-gray-100 text-sm font-serif">Ling Yue</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">Senior Disciple</span>
                  </div>
                  <p class="text-xs text-gray-400 mt-1 leading-relaxed">
                    Wielder of the Ice Phoenix Sword. Possesses the Heavenly Frost Physique.
                  </p>
                </div>
              </div>

              <!-- Dormant Entry Example -->
              <div class="entry-card hidden p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex gap-4" data-dormant="true">
                <div class="w-16 h-16 rounded-xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-xl flex-shrink-0">
                  👁️
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-amber-200 text-sm font-serif">Ancient Monarch Void</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Dormant Memory</span>
                  </div>
                  <p class="text-xs text-amber-200/70 mt-1 leading-relaxed">
                    Sealed primordial cultivator residing in the deepest layer of the Void Cauldron.
                  </p>
                </div>
              </div>

            </div>
          </div>

          <!-- Factions (#codex-factions) -->
          <div id="codex-factions" class="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">Prominent Factions</h3>
            <p class="text-xs text-gray-300">Azure Lotus Faction • Void Cauldron Sect • Heavenly Sword Assembly</p>
          </div>

          <!-- Timeline (#codex-timeline) -->
          <div id="codex-timeline" class="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">Chronicle Timeline Recaps</h3>
            <div class="space-y-1 text-xs text-gray-300">
              <p>• Year 10,400: Alignment of the Nine Heavens Stars</p>
              <p>• Year 10,398: Opening of the Void Cauldron Realm</p>
            </div>
          </div>

        </section>

        <!-- SECTION 2: KARMA & RELATIONS (#sec-karma) -->
        <section id="sec-karma" class="hidden space-y-6">
          <div id="codex-relations" class="p-4 rounded-xl bg-gray-950 border border-purple-500/30 space-y-3">
            <h3 class="text-sm font-bold font-serif text-purple-400">Karmic Relationship Matrix</h3>
            <p class="text-xs text-gray-300 leading-relaxed">
              Xiao Chen ↔ Ling Yue (Karmic Bond: 94% Alignment) • Xiao Chen ↔ Faction Patriarchs (Hostile Rivalry)
            </p>
          </div>

          <div id="codex-mysteries" class="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-wider text-purple-400">Karmic Threads & Mysteries</h3>
            <p className="text-xs text-gray-400">• Mystery of the Shattered Heavenly Blade (Unresolved)</p>
          </div>
        </section>

        <!-- SECTION 3: POWER RANKINGS (#sec-power) -->
        <section id="sec-power" class="hidden space-y-6">
          <div id="codex-power-hierarchy" class="p-4 rounded-xl bg-gray-950 border border-sky-500/30 space-y-3">
            <h3 class="text-sm font-bold font-serif text-sky-400">Cultivation Stage Hierarchy</h3>
            <div class="space-y-2 text-xs">
              <div class="p-2 rounded bg-gray-900 border border-gray-800 flex justify-between">
                <span>1. Qi Condensation</span> <span class="text-gray-500">Mortal Realm</span>
              </div>
              <div class="p-2 rounded bg-sky-950 border border-sky-500/40 flex justify-between text-sky-300">
                <span>2. Foundation Establishment</span> <span class="text-sky-400 font-bold">Xiao Chen (Peak)</span>
              </div>
              <div class="p-2 rounded bg-gray-900 border border-gray-800 flex justify-between">
                <span>3. Core Formation</span> <span class="text-gray-500">Patriarch Realm</span>
              </div>
            </div>
          </div>

          <div id="codex-dashboards" class="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">Cultivation Analytics</h3>
            <p class="text-xs text-gray-300">Spiritual Qi Density Index: 884.2 PPM • Heavenly Alignment Ratio: 99.4%</p>
          </div>
        </section>

        <!-- SECTION 4: ARTIFACTS & TREASURES (#sec-artifacts) -->
        <section id="sec-artifacts" class="hidden space-y-6">
          <div id="codex-artifacts-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-gray-950 border border-amber-500/30 space-y-2">
              <span class="text-xs font-bold text-amber-400">Heavenly Void Cauldron</span>
              <p class="text-xs text-gray-400">Grade: Supreme Artifact. Capable of refining ninth-grade divine spirit pills.</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-950 border border-indigo-500/30 space-y-2">
              <span class="text-xs font-bold text-indigo-400">Ice Phoenix Blade</span>
              <p class="text-xs text-gray-400">Grade: Earth Realm Treasure. Infuses strikes with absolute frost energy.</p>
            </div>
          </div>
        </section>

        <!-- SECTION 5: FATE & WORLD MOLDING (#sec-fate) -->
        <section id="sec-fate" class="hidden space-y-6">
          <div id="codex-fate-panel" class="p-4 rounded-xl bg-gray-950 border border-sky-500/30 space-y-3">
            <h3 class="text-sm font-bold font-serif text-sky-400">Destiny & Fate Molding Log</h3>
            <p class="text-xs text-gray-300">
              Branch 42-A: Xiao Chen opens the Void Cauldron early (+15% Karma Divergence)
            </p>
          </div>
        </section>

        <!-- SECTION 6: LORE & GLOSSARY (#sec-lore) -->
        <section id="sec-lore" class="hidden space-y-6">
          <div id="codex-glossary" class="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-3">
            <h3 class="text-sm font-bold font-serif text-gray-200">World Glossary & Laws</h3>
            <div class="space-y-2 text-xs text-gray-300">
              <p><strong class="text-sky-400">Nine Heavens Realm:</strong> The primary upper plane governed by nine celestial star arrays.</p>
              <p><strong class="text-sky-400">Primordial Dantain:</strong> An ancient inner reservoir storing unrefined star qi.</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  </div>

  <script>
    // Living Codex Tab Switching logic
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
        const target = tab.getAttribute('data-tab');
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

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
        knobDeep?.classList.add('translate-x-5', 'bg-sky-400');
        document.querySelectorAll('[data-dormant="true"]').forEach(el => el.classList.remove('hidden'));
      } else {
        knobDeep?.classList.remove('translate-x-5', 'bg-sky-400');
        document.querySelectorAll('[data-dormant="true"]').forEach(el => el.classList.add('hidden'));
      }
    });
  </script>
</body>
</html>`;

/**
 * FIXED FACE FAMILY TEMPLATE
 * Combines Reader Chamber and Living Codex in a paired preview container
 * with a top Face Family navigation toolbar (#face-family-nav) and toggle tabs.
 */
export const FACE_FAMILY_TEMPLATE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Face Family — Celestial Library</title>
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

    .family-nav-btn.active {
      background: #04ACFF;
      color: #030712;
      font-weight: 700;
    }

    .reader-prose p {
      font-size: calc(1.05rem * var(--reader-font-size-scale));
      line-height: var(--reader-line-height);
      margin-bottom: var(--reader-paragraph-spacing);
    }

    .codex-indicator {
      border-bottom: 1.5px dotted var(--color-portal);
      color: var(--color-portal);
      cursor: pointer;
      padding: 0 2px;
      border-radius: 2px;
    }

    .vinyl-disc.spinning {
      animation: spin-vinyl 4s linear infinite;
    }
    @keyframes spin-vinyl {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .codex-tab.active {
      background: rgba(4, 172, 255, 0.15);
      border-color: #04ACFF;
      color: #38BDF8;
    }
  </style>
</head>
<body class="theme-night font-serif min-h-screen pb-28 bg-gray-950 text-gray-100">

  <!-- TOP FACE FAMILY NAVIGATION TOOLBAR (#face-family-nav) -->
  <header id="face-family-nav" class="sticky top-0 z-50 bg-gray-950/95 border-b border-sky-500/30 backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-3 shadow-2xl">
    <div class="flex items-center gap-2.5">
      <span class="w-3 h-3 rounded-full bg-sky-400 animate-pulse"></span>
      <div>
        <span class="text-xs font-bold font-serif text-sky-400 uppercase tracking-widest block">Celestial Face Family</span>
        <span class="text-[10px] text-gray-400 font-sans hidden sm:block">Coordinated Visual DNA • Reader Chamber + Living Codex</span>
      </div>
    </div>

    <div class="flex items-center gap-1.5 bg-gray-900/90 border border-gray-800 p-1 rounded-xl font-sans">
      <button id="btn-view-split" class="family-nav-btn active text-xs px-3 py-1.5 rounded-lg text-gray-300 hover:text-white transition-all flex items-center gap-1.5">
        ⚡ <span>Paired View</span>
      </button>
      <button id="btn-view-reader" class="family-nav-btn text-xs px-3 py-1.5 rounded-lg text-gray-300 hover:text-white transition-all flex items-center gap-1.5">
        📖 <span>Reader Chamber</span>
      </button>
      <button id="btn-view-codex" class="family-nav-btn text-xs px-3 py-1.5 rounded-lg text-gray-300 hover:text-white transition-all flex items-center gap-1.5">
        📜 <span>Living Codex</span>
      </button>
    </div>
  </header>

  <!-- PAIRED SURFACE CONTAINERS -->
  <div id="face-family-container" class="space-y-12 p-2 md:p-6">
    
    <!-- READER CHAMBER SURFACE SECTION (#face-family-reader-wrapper) -->
    <section id="face-family-reader-wrapper" class="rounded-3xl border border-sky-500/20 bg-gray-950/60 p-4 md:p-6 shadow-2xl relative">
      <div class="flex items-center justify-between border-b border-sky-500/20 pb-3 mb-6 font-sans">
        <span class="text-xs font-bold uppercase tracking-widest text-sky-400 flex items-center gap-2">
          📖 Reader Chamber Visual Surface
        </span>
        <span class="text-[10px] px-2 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-sky-300">Coordinated Face DNA</span>
      </div>

      <!-- HEADER CHAMBER (#reader-header) -->
      <header id="reader-header" class="sticky top-12 z-40 w-full backdrop-blur-md bg-gray-950/85 border-b border-gray-800/80 px-4 py-3 rounded-2xl transition-all duration-200">
        <div class="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <a href="#back" class="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </a>
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <span id="story-title" class="text-xs uppercase tracking-widest text-sky-400 font-semibold font-sans">Celestial Library: Eternal Dao</span>
                <span id="sealed-badge" class="lock-indicator hidden sm:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-sans">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Sealed Scripture
                </span>
              </div>
              <h1 id="chapter-title" class="text-sm md:text-base font-bold text-gray-100 truncate max-w-xs md:max-w-md font-serif">
                Chapter 42: The Nine Heavens Alignment
              </h1>
            </div>
          </div>

          <div class="hidden lg:flex items-center gap-2">
            <span id="power-stage-badge" class="text-xs px-2.5 py-1 rounded-full bg-sky-950/80 border border-sky-500/30 text-sky-300 font-sans tracking-wide">
              Foundation Establishment Peak
            </span>
            <span id="continuity-divergence-badge" class="continuity-fault hidden text-xs px-2 py-0.5 rounded bg-red-950/80 border border-red-500/30 text-red-400 font-sans">
              Timeline Fault: Divergence
            </span>
          </div>

          <div class="flex items-center gap-2">
            <select id="chapter-select" class="hidden sm:block text-xs bg-gray-900 border border-gray-800 text-gray-300 rounded-lg px-2.5 py-1.5">
              <option value="42">Ch. 42: Nine Heavens</option>
              <option value="43">Ch. 43: Ancestral Dao</option>
            </select>
            <button id="audio-widget" class="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-sky-400 relative">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
            </button>
            <button id="btn-mark-read" class="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-emerald-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </button>
            <button id="btn-preferences" class="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-sky-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
            </button>
            <button id="btn-bookmarks" class="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-amber-400 relative">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              <span id="bookmark-badge" class="absolute -top-1 -right-1 text-[10px] bg-amber-500 text-black font-bold rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </button>
            <button id="btn-fullscreen" class="hidden sm:p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
            </button>
          </div>
        </div>
      </header>

      <!-- VIEWPORT (#reader-viewport) -->
      <main id="reader-viewport" class="max-w-3xl mx-auto px-2 md:px-6 py-6">
        <div id="chapter-hero" class="mb-8 rounded-2xl border border-sky-500/20 bg-gradient-to-b from-sky-950/40 to-gray-950 p-6 relative">
          <div id="hero-image" class="w-full h-44 rounded-xl bg-cover bg-center mb-4 border border-gray-800 shadow-2xl" style="background-image: url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop')"></div>
          <h2 class="text-xl md:text-2xl font-bold text-gray-100 font-serif mb-2">The Alignment of the Nine Stellar Arrays</h2>
          <p class="text-xs text-gray-400 font-sans">Xiao Chen stands atop Void Cauldron Peak, observing the karmic threads connecting all living beings.</p>
        </div>

        <article class="reader-prose space-y-5 text-gray-200">
          <p data-paragraph-index="1" class="relative group">
            <span class="bm-trigger absolute -left-6 top-1 opacity-0 group-hover:opacity-100 text-amber-500 cursor-pointer">🔖</span>
            The night sky above <span class="codex-indicator" data-codex-term="Void Cauldron Peak" data-codex-desc="The sacred pinnacle where ancient cultivators aligned heavenly star arrays.">Void Cauldron Peak</span> shimmered with ethereal violet light.
          </p>
          <p data-paragraph-index="2" class="relative group">
            <span class="bm-trigger absolute -left-6 top-1 opacity-0 group-hover:opacity-100 text-amber-500 cursor-pointer">🔖</span>
            Xiao Chen closed his eyes, extending his divine sense into the <span class="codex-indicator" data-codex-term="Nine Heavens Star Array" data-codex-desc="A supreme spatial formation created during the Primordial Era.">Nine Heavens Star Array</span>.
          </p>
        </article>

        <div id="codex-tooltip" class="hidden fixed z-50 max-w-xs p-4 bg-gray-900/95 border border-sky-500/40 rounded-xl shadow-2xl text-xs font-sans">
          <div class="flex justify-between items-start mb-1">
            <span id="tooltip-title" class="font-bold text-sky-400 font-serif text-sm">Void Cauldron Peak</span>
            <button id="close-tooltip" class="text-gray-500">✕</button>
          </div>
          <p id="tooltip-desc" class="text-gray-300">The sacred pinnacle where ancient cultivators aligned heavenly star arrays.</p>
        </div>
      </main>

      <!-- PANELS & CONTROLS -->
      <aside id="panel-preferences" class="hidden fixed top-0 right-0 h-full w-80 z-50 bg-gray-950/95 border-l border-gray-800 p-6 font-sans">
        <div class="flex justify-between pb-4 border-b border-gray-800 mb-4">
          <h3 class="font-bold text-gray-100 font-serif">Aetherial Styles</h3>
          <button id="btn-close-prefs" class="text-gray-400">✕</button>
        </div>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-2">
            <button class="font-btn active p-2 rounded bg-sky-950 border border-sky-500/50 text-sky-300 text-xs" data-font="serif">Noto Serif</button>
            <button class="font-btn p-2 rounded bg-gray-900 border border-gray-800 text-gray-400 text-xs" data-font="sans">Rubik Sans</button>
          </div>
          <div class="space-y-1">
            <span class="text-xs text-gray-400">Text Scale: <span id="val-font-size">100%</span></span>
            <input id="slider-font-size" type="range" min="80" max="150" value="100" class="w-full">
          </div>
          <div class="space-y-1">
            <span class="text-xs text-gray-400">Line Spacing: <span id="val-line-height">1.65</span></span>
            <input id="slider-line-height" type="range" min="130" max="220" value="165" class="w-full">
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button class="theme-btn active p-2 rounded bg-gray-950 text-sky-300 text-xs" data-theme="night">Night Void</button>
            <button class="theme-btn p-2 rounded bg-emerald-950 text-emerald-200 text-xs" data-theme="jade">Jade Realm</button>
          </div>
        </div>
      </aside>

      <aside id="panel-bookmarks" class="hidden fixed top-0 right-0 h-full w-80 z-50 bg-gray-950/95 border-l border-gray-800 p-6 font-sans">
        <div class="flex justify-between pb-4 border-b border-gray-800 mb-4">
          <h3 class="font-bold text-gray-100 font-serif">Chronicle Anchors</h3>
          <button id="btn-close-bookmarks" class="text-gray-400">✕</button>
        </div>
        <button id="btn-add-quick-bm" class="w-full mb-4 py-2 bg-sky-600 text-white rounded text-xs">Anchor Position</button>
        <div id="bookmarks-list" class="space-y-2"></div>
      </aside>

      <div id="popover-immersion" class="hidden fixed bottom-20 left-4 z-50 w-80 p-4 bg-gray-950/95 border border-sky-500/30 rounded-xl font-sans">
        <div class="flex justify-between border-b border-gray-800 pb-2 mb-3">
          <span class="font-bold text-gray-200 text-xs">Immersion Settings</span>
          <button id="close-immersion" class="text-gray-400">✕</button>
        </div>
        <div class="space-y-3 text-xs">
          <button id="toggle-auto-scroll" class="w-full text-left p-2 rounded bg-gray-900 text-gray-300">Auto Scroll Flow</button>
          <button id="toggle-image-popups" class="w-full text-left p-2 rounded bg-gray-900 text-gray-300">Holographic Visions</button>
          <div id="audio-menu" class="space-y-2 pt-2 border-t border-gray-800">
            <select id="narrator-voice" class="w-full bg-gray-900 border border-gray-800 p-1 text-xs rounded"><option value="sage">Celestial Elder</option></select>
            <select id="dialogue-voice" class="w-full bg-gray-900 border border-gray-800 p-1 text-xs rounded"><option value="sync">Character Sync</option></select>
            <select id="side-voice" class="hidden"><option value="default">Default</option></select>
            <div class="flex justify-between pt-1">
              <button id="btn-speech-rate" class="p-1 bg-gray-900 text-sky-400 rounded text-[10px]">Speed: 1.0x</button>
              <button id="btn-export-text" class="p-1 bg-gray-900 text-gray-300 rounded text-[10px]">Export Chapter</button>
            </div>
          </div>
        </div>
      </div>

      <footer id="reader-controls" class="w-full bg-gray-950/90 border-t border-gray-800/80 p-3 rounded-2xl font-sans">
        <div class="mobile-controls flex sm:hidden items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <button id="btn-immersion" class="p-2 rounded bg-gray-900 text-gray-300">⚙️</button>
            <button id="btn-codex" class="p-2 rounded bg-gray-900 text-sky-400">📜</button>
          </div>
          <div id="sap-playback-container">
            <button id="btn-sap-playback" class="p-2 bg-sky-950 rounded-full">
              <div id="vinyl-disc" class="vinyl-disc w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                <span id="icon-play" class="text-white text-[10px]">▶</span>
                <span id="icon-pause" class="text-white text-[10px] hidden">⏸</span>
              </div>
            </button>
          </div>
          <div class="flex items-center gap-2">
            <button id="btn-alter-fate" class="p-2 rounded bg-amber-500/10 text-amber-300">⚡</button>
            <div id="chapter-navigation" class="flex items-center bg-gray-900 rounded p-1">
              <button id="btn-prev-chapter" class="px-1 text-gray-400">◀</button>
              <span id="chapter-progress" class="text-[10px] text-gray-400">42/100</span>
              <button id="btn-next-chapter" class="px-1 text-gray-400">▶</button>
            </div>
          </div>
        </div>

        <div class="desktop-controls hidden sm:flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button id="btn-immersion-desktop" class="px-3 py-1.5 rounded bg-gray-900 text-xs text-gray-300">⚙️ Immersion Settings</button>
          </div>
          <div class="flex items-center gap-3">
            <button id="btn-alter-fate-desktop" class="px-3 py-1.5 rounded bg-amber-500/10 text-amber-300 text-xs">⚡ Alter Fate</button>
            <div id="chapter-nav-desktop" class="flex items-center bg-gray-900 rounded p-1 text-xs">
              <button id="btn-prev-chapter-desktop" class="px-2 text-gray-300">← Prev</button>
              <button id="btn-codex-desktop" class="px-2 text-sky-400 border-x border-gray-800">Living Codex</button>
              <button id="btn-next-chapter-desktop" class="px-2 text-gray-300">Next →</button>
            </div>
          </div>
        </div>
      </footer>
    </section>

    <!-- LIVING CODEX SURFACE SECTION (#face-family-codex-wrapper) -->
    <section id="face-family-codex-wrapper" class="rounded-3xl border border-sky-500/20 bg-gray-950/60 p-4 md:p-6 shadow-2xl relative font-sans">
      <div class="flex items-center justify-between border-b border-sky-500/20 pb-3 mb-6">
        <span class="text-xs font-bold uppercase tracking-widest text-sky-400 flex items-center gap-2">
          📜 Living Codex Lore Surface
        </span>
        <span class="text-[10px] px-2 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-sky-300">Coordinated Face DNA</span>
      </div>

      <div id="living-codex-container" class="codex-premium-shell space-y-6">
        <header id="codex-header" class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-gray-900 via-sky-950/40 to-gray-900 border border-sky-500/30">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-sky-950 border border-sky-500/40 flex items-center justify-center text-sky-400 text-xl font-serif">📜</div>
            <div>
              <span id="codex-realm-badge" class="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300">Nine Heavens Realm</span>
              <h1 id="codex-title" class="text-lg font-bold font-serif text-gray-100">Living Codex — Divine Registry</h1>
            </div>
          </div>

          <div class="flex items-center gap-3 bg-gray-950/80 p-2 rounded-xl border border-gray-800">
            <div class="flex flex-col text-right">
              <span class="text-xs font-semibold text-gray-200">Deep Memory Access</span>
              <span class="text-[10px] text-amber-400">4 Dormant Entries</span>
            </div>
            <button id="toggle-deep-memory" class="w-11 h-6 bg-gray-800 rounded-full p-1 relative transition-colors" aria-checked="false">
              <span id="deep-memory-knob" class="block w-4 h-4 bg-gray-400 rounded-full transition-transform"></span>
            </button>
          </div>
        </header>

        <div class="flex flex-col md:flex-row gap-6">
          <nav id="codex-side-nav" class="w-full md:w-56 flex-shrink-0">
            <div id="codex-tab-scroller" class="flex flex-row md:flex-col overflow-x-auto gap-2 p-1.5 bg-gray-900/80 rounded-2xl border border-gray-800">
              <button class="codex-tab active whitespace-nowrap px-3 py-2.5 rounded-xl text-left text-xs text-gray-300 flex items-center gap-2" data-tab="portraits"><span>🎨</span> Portraits & Chronicle</button>
              <button class="codex-tab whitespace-nowrap px-3 py-2.5 rounded-xl text-left text-xs text-gray-300 flex items-center gap-2" data-tab="karma"><span>☯️</span> Karma & Relations</button>
              <button class="codex-tab whitespace-nowrap px-3 py-2.5 rounded-xl text-left text-xs text-gray-300 flex items-center gap-2" data-tab="power"><span>⚡</span> Power Rankings</button>
              <button class="codex-tab whitespace-nowrap px-3 py-2.5 rounded-xl text-left text-xs text-gray-300 flex items-center gap-2" data-tab="artifacts"><span>🗡️</span> Artifacts & Treasures</button>
              <button class="codex-tab whitespace-nowrap px-3 py-2.5 rounded-xl text-left text-xs text-gray-300 flex items-center gap-2" data-tab="fate"><span>🌌</span> Fate & World Molding</button>
              <button class="codex-tab whitespace-nowrap px-3 py-2.5 rounded-xl text-left text-xs text-gray-300 flex items-center gap-2" data-tab="lore"><span>📚</span> Lore & Glossary</button>
              <a id="btn-back-reader" href="#reader" class="hidden md:flex items-center gap-2 mt-2 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-sky-400">← Reader Chamber</a>
            </div>
          </nav>

          <main id="codex-content-area" class="flex-1 bg-gray-900/60 rounded-2xl border border-gray-800 p-5">
            <section id="sec-portraits" class="space-y-6">
              <div id="codex-collage" class="p-4 rounded-xl bg-gray-950/80 border border-sky-500/20 space-y-2">
                <h3 class="text-xs font-bold font-serif text-sky-400 uppercase">Chronicle Collage</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div class="h-20 rounded-lg bg-cover bg-center border border-gray-800" style="background-image: url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop')"></div>
                </div>
              </div>

              <div class="space-y-3">
                <h3 class="text-xs font-bold font-serif text-gray-200 uppercase">Primary Cultivators</h3>
                <div id="codex-characters" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="entry-card p-3 rounded-xl bg-gray-950 border border-gray-800 flex gap-3">
                    <div class="w-12 h-12 rounded-xl bg-sky-950 border border-sky-500/30 flex items-center justify-center text-lg">⚔️</div>
                    <div>
                      <h4 class="font-bold text-gray-100 text-xs font-serif">Xiao Chen</h4>
                      <p class="text-[11px] text-gray-400 mt-0.5">Master of the Nine Heavens Sword Assembly.</p>
                    </div>
                  </div>
                  <div class="entry-card hidden p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex gap-3" data-dormant="true">
                    <div class="w-12 h-12 rounded-xl bg-amber-950 flex items-center justify-center text-lg">👁️</div>
                    <div><h4 class="font-bold text-amber-200 text-xs font-serif">Ancient Monarch Void</h4></div>
                  </div>
                </div>
              </div>

              <div id="codex-factions" class="p-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-300">Azure Lotus Faction • Void Cauldron Sect</div>
              <div id="codex-timeline" class="p-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-300">Year 10,400: Alignment of Nine Stars</div>
            </section>

            <section id="sec-karma" class="hidden space-y-4">
              <div id="codex-relations" class="p-3 rounded-xl bg-gray-950 border border-purple-500/30 text-xs text-gray-300">Karmic Bond: 94% Alignment</div>
              <div id="codex-mysteries" class="p-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-400">Mystery of Shattered Blade</div>
            </section>

            <section id="sec-power" class="hidden space-y-4">
              <div id="codex-power-hierarchy" class="p-3 rounded-xl bg-gray-950 border border-sky-500/30 text-xs text-sky-300">Foundation Establishment Peak</div>
              <div id="codex-dashboards" class="p-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-400">Qi Resonator Dashboard</div>
            </section>

            <section id="sec-artifacts" class="hidden space-y-4">
              <div id="codex-artifacts-grid" class="p-3 rounded-xl bg-gray-950 border border-amber-500/30 text-xs text-amber-200">Ice Phoenix Sword</div>
            </section>

            <section id="sec-fate" class="hidden space-y-4">
              <div id="codex-fate-panel" class="p-3 rounded-xl bg-gray-950 border border-sky-500/30 text-xs text-sky-300">Karmic Branching System</div>
            </section>

            <section id="sec-lore" class="hidden space-y-4">
              <div id="codex-glossary" class="p-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-300">Nine Heavens Realm Law</div>
            </section>
          </main>
        </div>
      </div>
    </section>

  </div>

  <script>
    // Face Family Top Tab Navigation
    const btnSplit = document.getElementById('btn-view-split');
    const btnReader = document.getElementById('btn-view-reader');
    const btnCodex = document.getElementById('btn-view-codex');
    const readerWrap = document.getElementById('face-family-reader-wrapper');
    const codexWrap = document.getElementById('face-family-codex-wrapper');

    function setViewMode(mode) {
      btnSplit?.classList.remove('active');
      btnReader?.classList.remove('active');
      btnCodex?.classList.remove('active');

      if (mode === 'split') {
        btnSplit?.classList.add('active');
        readerWrap?.classList.remove('hidden');
        codexWrap?.classList.remove('hidden');
      } else if (mode === 'reader') {
        btnReader?.classList.add('active');
        readerWrap?.classList.remove('hidden');
        codexWrap?.classList.add('hidden');
      } else if (mode === 'codex') {
        btnCodex?.classList.add('active');
        readerWrap?.classList.add('hidden');
        codexWrap?.classList.remove('hidden');
      }
    }

    btnSplit?.addEventListener('click', () => setViewMode('split'));
    btnReader?.addEventListener('click', () => setViewMode('reader'));
    btnCodex?.addEventListener('click', () => setViewMode('codex'));

    // Living Codex Tab Switching
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
        const target = tab.getAttribute('data-tab');
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
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
        knobDeep?.classList.add('translate-x-5', 'bg-sky-400');
        document.querySelectorAll('[data-dormant="true"]').forEach(el => el.classList.remove('hidden'));
      } else {
        knobDeep?.classList.remove('translate-x-5', 'bg-sky-400');
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
        description: 'Header with back navigation, story & chapter title, power stage badge, locked chapter status, timeline divergence badge, audio widget, mark read, preferences toggle, bookmarks toggle, fullscreen toggle, and chapter select.',
        requiredElements: ['#reader-header', '#story-title', '#chapter-title', '#power-stage-badge', '#sealed-badge', '#continuity-divergence-badge', '#audio-widget', '#btn-mark-read', '#btn-preferences', '#btn-bookmarks', '#bookmark-badge', '#btn-fullscreen', '#chapter-select']
      },
      {
        id: 'viewport',
        name: 'Reading Viewport',
        description: 'Main chapter viewport with hero image manifestation, prose paragraphs, paragraph bookmark triggers, and inline codex term indicators with preview tooltip.',
        requiredElements: ['#reader-viewport', '#chapter-hero', '.reader-prose', '.codex-indicator', '.bm-trigger', '#codex-tooltip']
      },
      {
        id: 'preferences_panel',
        name: 'Preferences Panel',
        description: 'Slide-out panel for typography treatments, font size scale slider, line spacing slider, and atmosphere realm themes.',
        requiredElements: ['#panel-preferences', '#btn-close-prefs', '.font-btn', '#slider-font-size', '#val-font-size', '#slider-line-height', '#val-line-height', '.theme-btn']
      },
      {
        id: 'bookmarks_panel',
        name: 'Cosmic Bookmarks Panel',
        description: 'Panel for saved paragraph bookmarks and quick position anchor button.',
        requiredElements: ['#panel-bookmarks', '#btn-close-bookmarks', '#bookmarks-list', '#btn-add-quick-bm']
      },
      {
        id: 'immersion_popover',
        name: 'Immersion Matrix Popover',
        description: 'Popover for auto-scroll toggle, holographic vision popups, voice matrix signatures, speech rate button, and chapter export.',
        requiredElements: ['#popover-immersion', '#toggle-auto-scroll', '#toggle-image-popups', '#audio-menu', '#narrator-voice', '#dialogue-voice', '#side-voice', '#btn-speech-rate', '#btn-export-text']
      },
      {
        id: 'bottom_controls',
        name: 'Responsive Bottom Controls',
        description: 'Bottom bar containing immersion settings, Codex access, SAP audio recitation vinyl control, alter fate, and chapter navigation across both mobile and desktop arrangements.',
        requiredElements: ['#reader-controls', '.mobile-controls', '.desktop-controls', '#btn-immersion', '#btn-codex', '#sap-playback-container', '#btn-sap-playback', '#vinyl-disc', '#btn-alter-fate', '#chapter-navigation', '#btn-prev-chapter', '#btn-next-chapter']
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
        requiredElements: ['#living-codex-container', '#codex-header', '#codex-title', '#codex-realm-badge', '#toggle-deep-memory', '#deep-memory-knob']
      },
      {
        id: 'navigation_sidebar',
        name: 'Navigation Sidebar',
        description: 'Responsive horizontal tab scroller on mobile and vertical sidebar on desktop.',
        requiredElements: ['#codex-side-nav', '#codex-tab-scroller', '.codex-tab', '[data-tab="portraits"]', '[data-tab="karma"]', '[data-tab="power"]', '[data-tab="artifacts"]', '[data-tab="fate"]', '[data-tab="lore"]', '#btn-back-reader']
      },
      {
        id: 'content_area',
        name: 'Codex Content Area',
        description: 'Main viewport containing all 6 lore sections: Portraits, Karma, Power, Artifacts, Fate, Lore.',
        requiredElements: ['#codex-content-area', '#sec-portraits', '#sec-karma', '#sec-power', '#sec-artifacts', '#sec-fate', '#sec-lore', '#codex-collage', '#codex-characters', '#codex-factions', '#codex-timeline', '#codex-relations', '#codex-mysteries', '#codex-power-hierarchy', '#codex-dashboards', '#codex-artifacts-grid', '#codex-fate-panel', '#codex-glossary']
      }
    ],
    html: LIVING_CODEX_TEMPLATE_HTML
  },
  face_family: {
    id: 'face_family',
    name: 'Face Family',
    presetId: 'face_family',
    description: 'Fixed structural template for a coordinated Face Family (Reader Chamber + Living Codex).',
    sections: [
      {
        id: 'family_header',
        name: 'Face Family Header Navigation',
        description: 'Top Face Family navigation toolbar with view mode switcher.',
        requiredElements: ['#face-family-nav', '#btn-view-split', '#btn-view-reader', '#btn-view-codex']
      },
      {
        id: 'reader_surface',
        name: 'Reader Chamber Surface',
        description: 'Coordinated Reader Chamber surface with header, viewport, preferences, bookmarks, immersion popover, and bottom controls.',
        requiredElements: ['#face-family-reader-wrapper', '#reader-header', '#story-title', '#chapter-title', '#reader-viewport', '#chapter-hero', '.reader-prose', '#panel-preferences', '#panel-bookmarks', '#popover-immersion', '#reader-controls']
      },
      {
        id: 'codex_surface',
        name: 'Living Codex Surface',
        description: 'Coordinated Living Codex surface with shell header, tab scroller, and content area.',
        requiredElements: ['#face-family-codex-wrapper', '#living-codex-container', '#codex-header', '#codex-title', '#codex-side-nav', '#codex-tab-scroller', '#codex-content-area', '#sec-portraits']
      }
    ],
    html: FACE_FAMILY_TEMPLATE_HTML
  }
};

export function getTemplateForPreset(presetIdOrLabel: string): FaceTemplateContract {
  const normalized = (presetIdOrLabel || '').toLowerCase().replace(/[\s_]+/g, '_');
  if (normalized.includes('family') || normalized.includes('face_family')) {
    return FIXED_FACE_TEMPLATES.face_family;
  }
  if (normalized.includes('codex')) {
    return FIXED_FACE_TEMPLATES.living_codex;
  }
  return FIXED_FACE_TEMPLATES.reader_chamber;
}

export interface ContractValidationResult {
  valid: boolean;
  missingElements: string[];
  missingSections: string[];
}

/**
 * Validates generated HTML against the template contract for a preset.
 */
export function validateTemplateContract(html: string, presetIdOrLabel: string): ContractValidationResult {
  const contract = getTemplateForPreset(presetIdOrLabel);
  const missingElements: string[] = [];
  const missingSections: string[] = [];

  if (!html || typeof html !== 'string' || html.trim().length === 0) {
    return {
      valid: false,
      missingElements: ['HTML empty'],
      missingSections: contract.sections.map(s => s.id)
    };
  }

  for (const section of contract.sections) {
    let sectionHasElements = false;
    for (const req of section.requiredElements) {
      let isPresent = false;

      if (req.startsWith('#')) {
        const idName = req.slice(1);
        const regex = new RegExp(`id=["']?${idName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}["']?`, 'i');
        isPresent = regex.test(html);
      } else if (req.startsWith('.')) {
        const className = req.slice(1);
        const regex = new RegExp(`class=["']?[^"']*\\b${className.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}\\b[^"']*["']?`, 'i');
        isPresent = regex.test(html);
      } else if (req.includes('[')) {
        const attrMatch = req.match(/\[([^=]+)=["']?([^\]"']+)["']?\]/);
        if (attrMatch) {
          const attrName = attrMatch[1];
          const attrVal = attrMatch[2];
          const regex = new RegExp(`${attrName}=["']?${attrVal}["']?`, 'i');
          isPresent = regex.test(html);
        } else {
          isPresent = html.includes(req);
        }
      } else {
        isPresent = html.includes(req);
      }

      if (!isPresent) {
        missingElements.push(`${section.name}: ${req}`);
      } else {
        sectionHasElements = true;
      }
    }

    if (!sectionHasElements) {
      missingSections.push(section.id);
    }
  }

  return {
    valid: missingElements.length === 0 && missingSections.length === 0,
    missingElements,
    missingSections
  };
}
