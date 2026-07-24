/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { AppSkin, SkinComponentPreset, SkinDnaDimension } from './types';

export const INITIAL_PLACEHOLDERS = [
    "Celestial Starlight face for the Reader Chamber with deep obsidian & gold typography",
    "Ancient Cultivation Scroll face for the Living Codex with parchment cards & faction maps",
    "Minimalist Moonlight Reader Chamber face with warm amber night mode & serif typography",
    "Void Dynasty Codex face for character profiles, lore, beasts & cultivation realms",
    "Jade Immortal Reader face with subtle emerald atmospheric gradients & scene scoring controls",
    "Ethereal Celestial Library Codex face with multi-column lore grid & relationship maps"
];

export const SEN_READER_PRESETS: SkinComponentPreset[] = [
  { 
    id: 'reader_chamber', 
    label: 'Reader Chamber', 
    instruction: 'Design a complete visual face for the Reader Chamber reading experience. Output a whole coordinated visual theme (color palette, materials, typography, depth, motion) featuring long-form reading text layout, scene scoring & audio narration controls, atmospheric color schemes, font treatment, and responsive mobile-first typography.' 
  },
  { 
    id: 'living_codex', 
    label: 'Living Codex', 
    instruction: 'Design a complete visual face for the Living Codex lore companion. Output a whole coordinated visual theme (color palette, materials, typography, depth, motion) featuring an interactive lore encyclopedia with character profiles, artifacts, beasts, factions, locations, power systems, and world knowledge index.' 
  }
];

export const SEN_READER_DNA: SkinDnaDimension[] = [
  { key: 'theme', labelLeft: 'Dark', labelRight: 'Light', low: 'Dark', high: 'Light', defaultWeight: 20 },
  { key: 'typography', labelLeft: 'Utilitarian', labelRight: 'Editorial', low: 'Utilitarian', high: 'Editorial', defaultWeight: 80 },
  { key: 'layout', labelLeft: 'Dense', labelRight: 'Spacious', low: 'Dense', high: 'Spacious', defaultWeight: 70 },
  { key: 'vibe', labelLeft: 'Clean', labelRight: 'Mystical', low: 'Clean', high: 'Mystical', defaultWeight: 60 },
  { key: 'texture', labelLeft: 'Flat', labelRight: 'Paper/Organic', low: 'Flat', high: 'Paper/Organic', defaultWeight: 50 },
  { key: 'era', labelLeft: 'Modern', labelRight: 'Classic', low: 'Modern', high: 'Classic', defaultWeight: 60 },
];

export const DEFAULT_SEN_SKIN: AppSkin = {
  id: 'sen-reader',
  name: 'SEN Celestial Library',
  description: 'Design complete visual faces for the Reader Chamber and Living Codex.',
  systemPromptInjection: 'You are an elite UX/UI engineer specialized in designing complete visual faces for SEN Light Novels (Celestial Library). You are creating whole coordinated visual themes—color palette, materials, typography, depth, motion, and component styling—for either the Reader Chamber (long-form reading, scene scoring, audio narration, typography, controls) or the Living Codex (characters, artifacts, beasts, factions, locations, timelines). Always output a complete, fully realized, responsive visual face theme, NOT an isolated component snippet.',
  presets: SEN_READER_PRESETS,
  dnaDimensions: SEN_READER_DNA
};

export const APP_SKINS: AppSkin[] = [
  DEFAULT_SEN_SKIN
];

// Fallbacks for existing imports while refactoring
export const COMPONENT_PRESETS = SEN_READER_PRESETS;
export const DNA_DIMENSIONS = SEN_READER_DNA;
