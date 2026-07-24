import { AppSkin } from './types';
import { getTemplateForPreset } from './templates';

export const getEditPrompt = (
  input: string,
  htmlCode: string,
  styleName: string,
  skin: AppSkin,
  componentType: string = 'Reader Chamber'
) => {
  const templateContract = getTemplateForPreset(componentType);

  return `
You are SEN Workshop, an expert UI designer for the SEN Light Novels Celestial Library.
Your task is to modify the provided visual face based on this request: "${input}"

Target Face Preset: ${componentType}
Design Direction: ${styleName}

Current HTML:
\`\`\`html
${htmlCode}
\`\`\`

**MANDATORY CELESTIAL LIBRARY TEMPLATE CONTRACT:**
You MUST preserve all required structural sections, required element IDs/classes, interactive buttons, navigation, audio narration controls, scene scoring, inline lore indicators, and accessibility attributes completely intact:
${templateContract.sections.map(s => `- ${s.name}: [${s.requiredElements.join(', ')}]`).join('\n')}

**EDITING RULES:**
1. **PRESERVE UNCHANGED SECTIONS & CHOICES**: Preserve everything the user did NOT ask to change. Do NOT redesign unrelated sections, break existing color systems, or replace successful design choices that were not mentioned in the request.
2. **TARGETED MODIFICATIONS**: Apply the requested changes precisely to the relevant colors, materials, typography, borders, shadows, spacing, or controls.
3. **CELESTIAL LIBRARY INTEGRITY**: Keep the Celestial Library's existing structure, required elements, functionality, accessibility, reading behavior, and data intact.
4. SKIN CONTEXT: ${skin.systemPromptInjection}
5. Output ONLY the new raw, self-contained HTML/CSS. No markdown fences. No explanation.
`.trim();
};

export const getStylePrompt = (
  input: string,
  componentType: string,
  dnaContext: string,
  skin: AppSkin
) => `
You are SEN Workshop, the primary visual face designer for the Celestial Library.
Generate 3 RADICALLY DISTINCT, complete design directions for the visual face "${componentType}" matching: "${input}".

${dnaContext}

**SKIN CONTEXT:**
${skin.systemPromptInjection}

**GOAL:**
Create 3 meaningfully different visual design directions for this face system. Do NOT generate abstract style names or single-phrase labels (e.g., do NOT return "Option A" or "Primary Pigment Gridwork").

Instead, give each output a short but clear design direction describing how it should actually look and feel (including palette, typography, materials, borders, depth, controls, cards, motion, and interaction states).

Each of the 3 directions MUST take a distinct visual system approach (e.g., one deep dark obsidian with gold accents and glowing depth, one rich parchment cultivation scroll with calligraphic typography, one sleek modern celestial glass with silver/indigo accents).

Return ONLY a raw JSON array of 3 distinct design direction strings, where each string contains a concise title followed by a clear description of how it looks and feels, for example:
[
  "Obsidian Void & Gold: High-contrast deep dark obsidian canvas paired with warm glowing gold typography, frosted glass card surfaces, refined hairline borders, elevated card depth, and polished touch controls with smooth amber hover states.",
  "Ethereal Jade & Silk Scroll: Calming deep emerald jade atmosphere with silky parchment cards, elegant serif typography, subtle bamboo/silk borders, tactile depth, and smooth responsive interaction states.",
  "Celestial Starlight & Silver: Luminous deep indigo night-sky theme with silver filigree lines, modern high-contrast typography, translucent frosted panels, crisp controls, and subtle glowing motion effects on active elements."
]
`.trim();

export const getGenerateArtifactPrompt = (
  input: string,
  componentType: string,
  componentInstruction: string,
  styleInstruction: string,
  dnaContext: string,
  skin: AppSkin
) => {
  const templateContract = getTemplateForPreset(componentType);

  return `
You are SEN Workshop, the primary visual face designer for SEN Light Novels (Celestial Library).
Create a complete visual face system for: "${input}".

**FACE TARGET:** ${componentType}
**FACE TYPE INSTRUCTIONS:** ${componentInstruction}
**DESIGN DIRECTION (LOOK & FEEL):** ${styleInstruction}
${dnaContext}

**MANDATORY CELESTIAL LIBRARY TEMPLATE CONTRACT:**
Below is the mandatory structural HTML layout for this face (${templateContract.name}).
You MUST preserve all required structural sections, required element IDs, classes, required controls, interactive buttons, navigation, chapter selection, audio narration controls, scene scoring, inline lore indicators, and accessibility attributes intact from the base template below.

REQUIRED SECTIONS & ELEMENTS TO PRESERVE INTACT:
${templateContract.sections.map(s => `- ${s.name}: required IDs/classes [${s.requiredElements.join(', ')}]`).join('\n')}

BASE TEMPLATE STRUCTURE:
\`\`\`html
${templateContract.html}
\`\`\`

**SKIN CONTEXT:**
${skin.systemPromptInjection}

**CRITICAL DESIGN SYSTEM REQUIREMENTS:**
1. **MEANINGFUL SYSTEM DIVERSITY**: Ensure this result is a complete, distinct visual face system built around the specified design direction ("${styleInstruction}"). You must thoroughly define and unify all visual layers:
   - **Palette**: Harmonious background, body text, accent, highlight, and alert colors with strong WCAG contrast and legibility.
   - **Typography**: Thoughtful font pairings, font weights, line-heights, letter-spacing, and clear reading hierarchy.
   - **Materials & Surfaces**: Background textures, glassmorphism, parchment, silk, gradient fills, or solid surfaces.
   - **Borders & Framing**: Crisp borders, subtle hairlines, filigree accents, or clean padding boundaries.
   - **Depth & Layers**: Elevated card shadows, inset glows, drop shadows, and clear spatial hierarchy.
   - **Controls & Cards**: Touch-friendly buttons, toggles, slider tracks, active pill states, and card containers.
   - **Motion & Interactions**: CSS transitions, subtle hover/focus effects, active press animations, and loading states.
2. **CELESTIAL LIBRARY INTEGRITY**: Keep the Celestial Library's existing layout structure, required elements, functionality, accessibility, reading behavior, audio narration/scene scoring controls, and data completely intact.
3. **STYLE DNA SLIDERS**: Let any active Style DNA preferences guide aesthetic details without overriding the user's primary prompt request.
4. Output self-contained, valid HTML with embedded CSS (<style>). No markdown code fences. No explanatory commentary.
`.trim();
};

export const getFusionPrompt = (
  input: string,
  componentType: string,
  htmlA: string,
  htmlB: string,
  fusionMode: string = 'Best Of',
  skin: AppSkin
) => {
  const templateContract = getTemplateForPreset(componentType);

  return `
You are SEN Workshop, an expert UI designer for SEN Light Novels.
Your task is to review two different visual face implementations for the following request and fuse them into a single Master Visual Face.

Request: "${input}"
Face Target: ${componentType}
Fusion Mode: ${fusionMode}

**Implementation A:**
\`\`\`html
${htmlA}
\`\`\`

**Implementation B:**
\`\`\`html
${htmlB}
\`\`\`

**MANDATORY TEMPLATE CONTRACT:**
You MUST preserve all required structural sections and mandatory element IDs/classes:
${templateContract.sections.map(s => `- ${s.name}: [${s.requiredElements.join(', ')}]`).join('\n')}

**RULES FOR FUSION MODE: ${fusionMode}**
${fusionMode === 'Best Of' ? 'Combine the strongest functional and visual setup pieces from both Implementation A and Implementation B.' : ''}
${fusionMode === 'A Look + B Structure' ? 'Apply the visual style, colors, and textures of Implementation A onto the structural layout and elements of Implementation B.' : ''}
${fusionMode === 'B Look + A Structure' ? 'Apply the visual style, colors, and textures of Implementation B onto the structural layout and elements of Implementation A.' : ''}
${fusionMode === 'Cleaner / Production' ? 'Simplify the combined designs. Remove messy, bloated, or overly complex CSS. Ensure it looks like a clean, production-ready visual face.' : ''}

**GENERAL RULES:**
1. Ensure the final fused result is a single, cohesive, high-fidelity visual face theme.
2. Preserve all mandatory controls, IDs, and section contracts listed above.
3. SKIN CONTEXT: ${skin.systemPromptInjection}
4. Output ONLY the new raw, self-contained HTML/CSS. No markdown fences. No explanation.
`.trim();
};

export const getElementEditPrompt = (
  instruction: string,
  htmlCode: string,
  elementHtml: string,
  elementName: string,
  skin: AppSkin,
  componentType: string = 'Reader Chamber'
) => {
  const templateContract = getTemplateForPreset(componentType);

  return `
You are SEN Workshop, an expert UI designer for SEN Light Novels.
Your task is to modify a SPECIFIC element within the provided visual face based on this request: "${instruction}"

Face Target: ${componentType}
Selected Element: ${elementName}
Selected Element HTML Snapshot:
\`\`\`html
${elementHtml}
\`\`\`

Full Visual Face HTML:
\`\`\`html
${htmlCode}
\`\`\`

**MANDATORY TEMPLATE CONTRACT:**
You MUST preserve all required structural sections and mandatory element IDs/classes in the full HTML:
${templateContract.sections.map(s => `- ${s.name}: [${s.requiredElements.join(', ')}]`).join('\n')}

**RULES:**
1. Keep the same creative direction and layout, but apply the requested changes strictly to the selected element.
2. If the user asks to modify the element, you MUST update the element in the context of the full visual face block.
3. Preserve all mandatory controls, IDs, and section contracts.
4. SKIN CONTEXT: ${skin.systemPromptInjection}
5. Output ONLY the new raw, self-contained FULL HTML/CSS for the entire visual face. No markdown fences. No explanation.
`.trim();
};

export const getReactExportPrompt = (htmlCode: string, skin: AppSkin) => `
You are an expert Frontend Engineer. Convert the following HTML/CSS visual face into a clean, modular React component.
Use standard CSS (not Tailwind) and functional hooks where appropriate.

HTML/CSS:
\`\`\`html
${htmlCode}
\`\`\`

**SKIN CONTEXT:**
${skin.systemPromptInjection}

**PROPS STANDARDIZATION:**
Review the Skin Context. Export the component expecting standard props that fit the specific domain of the Skin context.

Return ONLY the raw string of the React component code with no markdown formatting.
`.trim();

export const getReactTailwindExportPrompt = (htmlCode: string, skin: AppSkin) => `
You are an expert Frontend Engineer. Convert the following HTML/CSS visual face into a clean, modular React component using functional hooks and Tailwind CSS.
Do not use external CSS files, only Tailwind classes.

HTML/CSS:
\`\`\`html
${htmlCode}
\`\`\`

**SKIN CONTEXT:**
${skin.systemPromptInjection}

**PROPS STANDARDIZATION:**
Review the Skin Context. Export the component expecting standard props that fit the specific domain of the Skin context.

Return ONLY the raw string of the React component code with no markdown formatting.
`.trim();

export const getGenerateVariationsPrompt = (
  promptOriginal: string,
  componentType: string,
  skin: AppSkin
) => {
  const templateContract = getTemplateForPreset(componentType);

  return `
Generate 3 RADICAL CONCEPTUAL VARIATIONS of: "${promptOriginal}".

**FACE TARGET:** ${componentType || 'Reader Chamber'}

**MANDATORY TEMPLATE CONTRACT:**
You MUST preserve all required structural sections and mandatory element IDs/classes:
${templateContract.sections.map(s => `- ${s.name}: [${s.requiredElements.join(', ')}]`).join('\n')}

**SKIN CONTEXT:**
${skin.systemPromptInjection}

**YOUR TASK:**
For EACH variation:
- Invent a unique design direction name.
- Rewrite the prompt to fully adopt that metaphor's visual language.
- Generate high-fidelity HTML/CSS representing a complete visual face layout adhering strictly to the template contract above.
- Make controls touch-friendly and mobile-first.
- Output self-contained HTML/CSS.

Required JSON Output Format (stream ONE object per line):
\`{ "name": "Persona Name", "html": "..." }\`
`.trim();
};
