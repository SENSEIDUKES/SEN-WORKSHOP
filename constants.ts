/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { AppSkin, SkinComponentPreset, SkinDnaDimension } from './types';

export const INITIAL_PLACEHOLDERS = [
    "Celestial Starlight Face Family with deep obsidian & gold typography across Reader & Codex",
    "Ancient Cultivation Scroll Face Family with parchment cards, reading viewport & faction maps",
    "Minimalist Moonlight Reader Chamber face with warm amber night mode & serif typography",
    "Void Dynasty Codex face for character profiles, lore, beasts & cultivation realms",
    "Jade Immortal Face Family with emerald atmospheric gradients, scene scoring & lore index",
    "Ethereal Celestial Library Face Family with coordinated reading chamber & world codex"
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
  },
  { 
    id: 'face_family', 
    label: 'Face Family', 
    instruction: 'Design three complete visual Face Family directions. Each direction must contain one coordinated Reader Chamber face and one coordinated Living Codex face created from the same shared visual DNA, so they feel like a single unified theme across both surfaces.' 
  }
];

export const SEN_READER_DNA: SkinDnaDimension[] = [
  { key: 'theme', labelLeft: 'Dark', labelRight: 'Light', low: 'Dark', high: 'Light', defaultWeight: 0 },
  { key: 'era', labelLeft: 'Traditional', labelRight: 'Modern', low: 'Traditional', high: 'Modern', defaultWeight: 0 },
  { key: 'immersion', labelLeft: 'Restrained', labelRight: 'Immersive', low: 'Restrained', high: 'Immersive', defaultWeight: 0 },
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
