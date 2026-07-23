# SEN Workshop 📖⚡

**SEN Workshop** is an advanced, high-fidelity interactive playground for creating complete visual faces and interfaces for the SEN Light Novels app. It allows users to rapidly generate, preview, customize, and export stunning web components and reading layouts utilizing advanced generative AI models. 

Designed like a professional creative instrument, it keeps AI focus tight on beautiful, product-useful reading UI elements (such as the Reader Chamber and Living Codex) rather than drifting into sprawling, generic dashboard containers.

---

## 🚀 Key Architectural Upgrades

### 1. Component Type Presets (Creative Constraints) 📖
Instead of working with a blank canvas prone to model drift, users can tap specialized component mode presets:
*   **Reader Chamber**: Immersive reading layouts, typography systems, and content presentation.
*   **Living Codex**: Dynamic library views, indexes, book covers, and lore exploration elements.
*   **Navigation / Bookmarks**: Tools for moving through stories and saving progress.
*   **Freeform**: Unstructured prompt-to-component rendering.

### 2. Style DNA Panel 🔬
An interactive visual configuration desk let users shape the "DNA" of the component prior to triggering model execution:
*   **Theme**: Dark ↔ Light
*   **Typography**: Utilitarian ↔ Editorial
*   **Layout**: Dense ↔ Spacious
*   **Vibe**: Clean ↔ Mystical
*   **Texture**: Flat ↔ Paper/Organic
*   **Era**: Modern ↔ Classic

The app translates these sliders into structured attributes parsed by the generation prompts to yield highly precise aesthetic directions.

### 3. Cline-Inspired Model Fetching & API System 📡
A robust API backend system with streamlined key entry:
*   **Dynamic Discovery**: Once a provider is chosen (e.g., Gemini or OpenRouter), entering your API key fires a debounce worker that fetches and displays the available matching model IDs in an automated dropdown select menu.
*   **Multi-Provider support**: Backed by a decoupled integration layer supporting Gemini, OpenRouter, Ollama, and LM Studio.
*   **Error Intelligence**: Real-time HTTP 401 handling blocks bad states and delivers clear model/provider debugging feedback.

---

## 🛠️ Project Structure

```bash
├── components/
│   ├── ArtifactCard.tsx           # Manages output iframe sandbox, code display copy, and variation layouts
│   ├── DottedGlowBackground.tsx   # Premium workspace background ambient aesthetics
│   ├── Icons.tsx                  # Pre-compiled high-performance SVG visual glyphs
│   ├── SettingsPanel.tsx          # Dynamic API provider setup with auto-model discovery
│   └── SideDrawer.tsx             # Interactive panel to view live HTML source
├── ai.ts                          # Unified SDK bridge & stream handling wrapper
├── constants.ts                   # Initial prompts and Component Presets configuration
├── index.css                      # Master workspace styles and animations
├── index.tsx                      # Primary App layout, dictation controller, dynamic state coordinators
├── metadata.json                  # AI Studio context registry
├── types.ts                       # Standard TypeScript type definitions (Sessions, Artifacts, Settings)
└── utils.ts                       # Secure layout generators and UI helpers
```

---

## 🧑‍💻 Technical Stack & Integration

*   **Runtime Framework**: React 19 + TypeScript + Vite.
*   **Styling Engine**: Modern high-contrast Tailwind styling combined with immersive themes.
*   **Speech Integration**: Web Speech API dictation support for touch-free command prompts.
*   **Persistence**: Secure local storage synchronization (`localStorage`) keeping keys and settings persisted across application lifecycle.

---

*Created for **SEN Light Novels**.*
