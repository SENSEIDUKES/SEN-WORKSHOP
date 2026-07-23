/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { AppSkin, SkinComponentPreset, SkinDnaDimension } from './types';

export const INITIAL_PLACEHOLDERS = [
    "Design an immersive reader view with adjustable typography",
    "Create a 'Living Codex' index for fantasy lore",
    "Design a book cover gallery view",
    "Create a clean chapter navigation menu",
    "Design a reading progress tracker",
    "Make an elegant bookmarking component",
    "Create a mystical character profile card",
    "Design a typography settings panel for the reader"
];

export const SEN_READER_PRESETS: SkinComponentPreset[] = [
  { id: 'freeform', label: 'Freeform', instruction: 'Freeform Component. Generate based directly on the user request.' },
  { id: 'reader_chamber', label: 'Reader Chamber', instruction: 'Design an immersive reading layout for a light novel. Focus on typography, line height, and readability.' },
  { id: 'living_codex', label: 'Living Codex', instruction: 'Design an interactive encyclopedia, index, or lore component for characters, places, or magic systems.' },
  { id: 'book_cover', label: 'Book Gallery', instruction: 'Make a visually striking layout for browsing book covers or chapter illustrations.' },
  { id: 'chapter_nav', label: 'Chapter Navigation', instruction: 'Make an elegant navigation menu or table of contents.' },
  { id: 'reading_progress', label: 'Reading Progress', instruction: 'Make a visual indicator of reading progress, such as a timeline or progress bar.' },
  { id: 'bookmark', label: 'Bookmark / Notes', instruction: 'Design a component for saving bookmarks or taking notes on specific passages.' },
  { id: 'typography_settings', label: 'Typography Panel', instruction: 'Make a compact settings panel for adjusting font size, theme, and line spacing.' }
];

export const SEN_READER_DNA: SkinDnaDimension[] = [
  { key: 'theme', labelLeft: 'Dark', labelRight: 'Light', low: 'Dark', high: 'Light', defaultWeight: 50 },
  { key: 'typography', labelLeft: 'Utilitarian', labelRight: 'Editorial', low: 'Utilitarian', high: 'Editorial', defaultWeight: 80 },
  { key: 'layout', labelLeft: 'Dense', labelRight: 'Spacious', low: 'Dense', high: 'Spacious', defaultWeight: 70 },
  { key: 'vibe', labelLeft: 'Clean', labelRight: 'Mystical', low: 'Clean', high: 'Mystical', defaultWeight: 40 },
  { key: 'texture', labelLeft: 'Flat', labelRight: 'Paper/Organic', low: 'Flat', high: 'Paper/Organic', defaultWeight: 50 },
  { key: 'era', labelLeft: 'Modern', labelRight: 'Classic', low: 'Modern', high: 'Classic', defaultWeight: 60 },
];

export const DEFAULT_SEN_SKIN: AppSkin = {
  id: 'sen-reader',
  name: 'SEN Reader Core',
  description: 'Design premium reading components and light novel UI.',
  systemPromptInjection: 'You are an elite UX/UI engineer specialized in designing premium reading interfaces and digital books. Keep styling elegant, highly readable, and immersive. Use beautiful typography pairings and thoughtful whitespace.',
  presets: SEN_READER_PRESETS,
  dnaDimensions: SEN_READER_DNA
};

export const PORTAL_DNA: SkinDnaDimension[] = [
  { key: 'immersion', labelLeft: 'Flat', labelRight: 'Deep', low: 'Flat', high: 'Deep', defaultWeight: 80 },
  { key: 'motion', labelLeft: 'Static', labelRight: 'Fluid', low: 'Static', high: 'Fluid', defaultWeight: 75 },
  { key: 'texture', labelLeft: 'Clean', labelRight: 'Grainy', low: 'Clean', high: 'Grainy', defaultWeight: 60 }
];

export const PORTAL_PRESETS: SkinComponentPreset[] = [
  { id: 'freeform', label: 'Freeform', instruction: 'Generate an immersive, ambient 3D-like webGL or heavy CSS portal UI based on the user request.' },
  { id: 'entry_gate', label: 'Entry Gate', instruction: 'Design a single focal-point entry gate, like an interactive story cover.' }
];

export const ARC_NOTES_DNA: SkinDnaDimension[] = [
  { key: 'layout', labelLeft: 'Dense', labelRight: 'Spacious', low: 'Dense', high: 'Spacious', defaultWeight: 40 },
  { key: 'typography', labelLeft: 'Utilitarian', labelRight: 'Editorial', low: 'Utilitarian', high: 'Editorial', defaultWeight: 60 },
  { key: 'structure', labelLeft: 'Grid', labelRight: 'Freeform', low: 'Grid', high: 'Freeform', defaultWeight: 50 }
];

export const ARC_NOTES_PRESETS: SkinComponentPreset[] = [
  { id: 'freeform', label: 'Freeform', instruction: 'Design an editorial, structured Arc Notes text or documentation component.' },
  { id: 'text_block', label: 'Text Block', instruction: 'Design a beautifully structured text block for notes or lyrics.' }
];

export const APP_SKINS: AppSkin[] = [
  DEFAULT_SEN_SKIN,
  {
    id: 'portal',
    name: 'Portal',
    description: 'Immersive, ambient story worlds.',
    systemPromptInjection: 'You are an elite creative developer. You are no longer building standard UI controls. You are building an immersive, ambient entry portal for a fantasy story. Prioritize 3D-like effects, ambient motion, atmospheric styling, and zero UI clutter.',
    presets: PORTAL_PRESETS,
    dnaDimensions: PORTAL_DNA
  },
  {
    id: 'arc-notes',
    name: 'Arc Notes',
    description: 'Editorial layouts for documentation and text.',
    systemPromptInjection: 'You are an elite editorial designer. Design for the Arc Notes skin. Prioritize pristine typography, structured reading layouts, subtle borders, and elegant use of whitespace. Build clean documentation or lore viewing contexts.',
    presets: ARC_NOTES_PRESETS,
    dnaDimensions: ARC_NOTES_DNA
  }
];

// Fallbacks for existing imports while refactoring
export const COMPONENT_PRESETS = SEN_READER_PRESETS;
export const DNA_DIMENSIONS = SEN_READER_DNA;
