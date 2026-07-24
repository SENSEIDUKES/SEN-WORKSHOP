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
Style Direction: ${styleName}

Current HTML:
\`\`\`html
${htmlCode}
\`\`\`

**MANDATORY TEMPLATE CONTRACT:**
You MUST preserve all required structural sections and mandatory element IDs/classes:
${templateContract.sections.map(s => `- ${s.name}: [${s.requiredElements.join(', ')}]`).join('\n')}

**RULES:**
1. Keep the same creative direction: ${styleName}
2. Apply the requested changes precisely to colors, materials, typography, borders, shadows, and spacing.
3. NEVER remove required structural controls, navigation, chapter buttons, audio controls, or section contracts listed above.
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
Generate 3 distinct, product-useful visual face design directions for "${componentType}" matching this description: "${input}".

${dnaContext}

**SKIN CONTEXT:**
${skin.systemPromptInjection}

**GOAL:**
Return ONLY a raw JSON array of 3 *NEW*, creative visual theme style direction names for this face (e.g. ["Option A", "Option B", "Option C"]).
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
Create a complete visual face theme for: "${input}".

**FACE TARGET:** ${componentType}
**FACE TYPE INSTRUCTIONS:** ${componentInstruction}
**CONCEPTUAL DIRECTION:** ${styleInstruction}
${dnaContext}

**MANDATORY FIXED TEMPLATE STRUCTURE CONTRACT:**
Below is the mandatory structural HTML layout for this face (${templateContract.name}).
You MAY redesign colors, materials, typography, borders, depth, shadows, motion, and component styling.
However, you MUST preserve all required structural sections, element IDs, required controls, responsive tab/control placement, element order, and interactive behavior.

REQUIRED SECTIONS & ELEMENTS TO PRESERVE:
${templateContract.sections.map(s => `- ${s.name}: required IDs/classes [${s.requiredElements.join(', ')}]`).join('\n')}

BASE TEMPLATE STRUCTURE:
\`\`\`html
${templateContract.html}
\`\`\`

**SKIN CONTEXT:**
${skin.systemPromptInjection}

**VISUAL EXECUTION RULES:**
1. Redesign the visual face theme (color scheme, materials, shadows, borders, fonts, animations) while PRESERVING the full structural hierarchy and functional controls from the base template above.
2. Make controls touch-friendly and mobile-first.
3. Ensure high legibility, elegant typography pairings, thoughtful negative space, and dark cultivation/fantasy aesthetics.
4. Output self-contained HTML/CSS. No markdown fences. No explanation.
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
