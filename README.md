# SEN Workshop 📖⚡

**SEN Workshop** (Flash UI) is a high-fidelity, AI-powered visual face design application built for **SEN Light Novels (Celestial Library)**. It allows creators, designers, and developers to rapidly generate, preview, refine, fuse, and export cohesive visual faces and design systems for long-form reading and world codex experiences.

Designed as a professional creative instrument, SEN Workshop focuses generative AI models on product-useful reading UI surfaces—such as the **Reader Chamber** and **Living Codex**—guaranteeing structural integrity and functional behavior through enforced mandatory template contracts.

---

## 🌟 Overview & Celestial Library Architecture

Celestial Library is an expanded-novel reading experience designed around generated worlds, long-form reading, scene scoring, audio narration, visual manifestations, and lore exploration.

**SEN Workshop** serves as the visual face studio for the Celestial Library:
* **Visual Faces**: Complete coordinated visual design systems encompassing color palettes, materials, typography pairings, spatial depth, shadows, borders, motion, and control styling.
* **Mandatory Template Contracts**: Every generated face preserves essential structural controls, chapter navigation, audio narration triggers, and Codex encyclopedia sections so that styling changes never break underlying reading logic or navigation.
* **Context Isolation**: Generated HTML/CSS faces run inside isolated sandboxed iframes to prevent layout bleed or CSS pollution with the host application.

---

## 🎨 Three Core Creation Modes

SEN Workshop supports three dedicated workflow modes:

1. **Reader Chamber** 📖
   - Generates complete visual faces for the core reading experience.
   - Features long-form reading viewport layout, chapter navigation controls, audio narration & scene scoring playback widgets, font options, and atmospheric theme states.

2. **Living Codex** 📜
   - Generates complete visual faces for the lore companion encyclopedia.
   - Covers character profiles, portraits, artifacts, beasts, factions, locations, power systems, timelines, and world knowledge indices.

3. **Face Family** 🌌
   - Generates three coordinated design directions simultaneously.
   - Each direction includes a **Reader Chamber face** and a **Living Codex face** created from shared visual DNA, establishing a unified visual identity across both surfaces.

---

## 🔬 Style DNA Panel & Interactive Fine-Tuning

Prior to triggering model generation, users can customize style attributes via the interactive **Style DNA Panel**:

* **Theme**: Dark ↔ Light
* **Era**: Traditional / Historical ↔ Modern / Futuristic
* **Immersion**: Restrained / Minimalist ↔ Immersive / Atmospheric

### Advanced Creator Features:
* **Speech Recognition**: Voice dictation via Web Speech API for hands-free prompt input.
* **Reference Image Upload**: Use image attachments or screenshots as visual style prompts.
* **Element Editing**: Select specific HTML elements within a face snapshot to perform targeted AI style modifications.
* **Variations Generator**: Generate 3 radical conceptual variations from an initial prompt.
* **Fusion Engine**: Intelligently merge two face implementations using customizable modes (`Best Of`, `A Look + B Structure`, `B Look + A Structure`, `Cleaner / Production`).
* **Multi-Format Export**: Export faces as raw HTML/CSS, React functional components, or React + Tailwind CSS components.
* **Local Saved Library**: Save and manage visual faces locally using IndexedDB (`services/dbService.ts`).

---

## 📡 Multi-Provider AI Architecture

SEN Workshop incorporates a polymorphic, multi-provider generative AI client (`ai.ts`):

* **Native Google GenAI SDK**: `@google/genai` with support for Gemini models (e.g. `gemini-2.5-flash`).
* **OpenRouter**: Access to third-party and open-source models.
* **Local LLM Support**: Direct compatibility with **Ollama** (`http://localhost:11434`) and **LM Studio** (`http://localhost:1234`).
* **Custom SSE Streaming Parser**: Custom Server-Sent Events generator (`parseOpenAIStream`) for real-time response streaming from non-Gemini SSE endpoints.
* **Automated Model Discovery**: Debounced API key verification automatically fetches available models into a select dropdown menu and persists settings in `localStorage`.

---

## 🛠️ Project Structure

```bash
├── components/
│   ├── ActionBar.tsx            # Primary action bar for prompt input, presets & mode controls
│   ├── ActionDrawer.tsx         # Slide-out drawer for code inspection, variations & fusion
│   ├── ArtifactCard.tsx         # Sandboxed iframe display for generated visual faces
│   ├── DottedGlowBackground.tsx# Workspace ambient visual background effects
│   ├── FloatingInput.tsx        # Floating prompt input with speech dictation & image upload
│   ├── Icons.tsx                # SVG icon library
│   ├── InfoDrawer.tsx           # Celestial Library architectural guide & documentation
│   ├── LibraryDrawer.tsx        # Saved faces library manager (IndexedDB)
│   ├── SettingsPanel.tsx        # Multi-provider API credentials & model configuration
│   └── SideDrawer.tsx           # Reusable slide-over drawer component
├── hooks/
│   ├── useGenerativeSessions.ts # State management for sessions, artifacts, variations & fusion
│   ├── useSpeechRecognition.ts  # Web Speech API speech-to-text hook
│   └── useThumbnail.ts          # Offscreen screenshot & thumbnail generation cache
├── services/
│   ├── dbService.ts             # IndexedDB persistence for saved faces
│   └── screenshotService.ts     # HTML2Canvas snapshot & screenshot export service
├── ai.ts                        # Multi-provider AI SDK bridge & SSE streaming generator
├── constants.ts                 # App skin definitions, DNA dimensions & component presets
├── index.css                    # Master workspace styles & Tailwind imports
├── index.html                   # Application HTML entry point
├── index.tsx                    # Main React application coordinator & layout
├── localization.ts             # Multi-language i18n support
├── prompts.ts                   # System prompts, style directions & template contract rules
├── templates.ts                 # Mandatory structural template contracts (Reader & Codex)
├── templates.test.ts            # Automated Vitest test suite for structural template contracts
├── types.ts                     # TypeScript interface definitions (Sessions, Artifacts, Settings)
└── utils.ts                     # Secure layout generators & UI helper utilities
```

---

## 🧑‍💻 Technical Stack & Integration

* **Runtime Framework**: React 19 + TypeScript + Vite
* **Styling Engine**: Tailwind CSS + Modern dark/light theme variables
* **Testing Suite**: Vitest (`npm test`)
* **Persistence**: IndexedDB (Saved Library) & `localStorage` (Model Settings & API keys)
* **SDKs & Libraries**: `@google/genai`, `html2canvas`, `jszip`, `react-diff-viewer-continued`, `react-syntax-highlighter`

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

*Created for **SEN Light Novels — Celestial Library**.*

