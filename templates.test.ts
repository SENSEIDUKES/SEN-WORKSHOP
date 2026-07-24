/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { FIXED_FACE_TEMPLATES, getTemplateForPreset } from './templates';
import { getGenerateArtifactPrompt } from './prompts';
import { DEFAULT_SEN_SKIN } from './constants';

describe('SEN Fixed Face Templates Structure & Contract', () => {

  it('should define the Reader Chamber template with required structural sections', () => {
    const template = FIXED_FACE_TEMPLATES.reader_chamber;
    expect(template).toBeDefined();
    expect(template.presetId).toBe('reader_chamber');

    // Check all required structural sections exist
    const sectionIds = template.sections.map(s => s.id);
    expect(sectionIds).toContain('header');
    expect(sectionIds).toContain('viewport');
    expect(sectionIds).toContain('preferences_panel');
    expect(sectionIds).toContain('bookmarks_panel');
    expect(sectionIds).toContain('bottom_controls');

    // Verify required elements exist in the actual HTML string
    for (const section of template.sections) {
      for (const reqEl of section.requiredElements) {
        if (reqEl.startsWith('#')) {
          const id = reqEl.substring(1);
          expect(template.html).toContain(`id="${id}"`);
        } else if (reqEl.startsWith('.')) {
          const className = reqEl.substring(1);
          expect(template.html).toContain(className);
        }
      }
    }
  });

  it('should define the Living Codex template with required structural sections', () => {
    const template = FIXED_FACE_TEMPLATES.living_codex;
    expect(template).toBeDefined();
    expect(template.presetId).toBe('living_codex');

    // Check all required structural sections exist
    const sectionIds = template.sections.map(s => s.id);
    expect(sectionIds).toContain('shell_header');
    expect(sectionIds).toContain('tab_bar');
    expect(sectionIds).toContain('portraits_section');
    expect(sectionIds).toContain('karma_section');
    expect(sectionIds).toContain('power_section');
    expect(sectionIds).toContain('artifacts_section');
    expect(sectionIds).toContain('fate_section');
    expect(sectionIds).toContain('lore_section');

    // Verify required elements exist in the actual HTML string
    for (const section of template.sections) {
      for (const reqEl of section.requiredElements) {
        if (reqEl.startsWith('#')) {
          const id = reqEl.substring(1);
          expect(template.html).toContain(`id="${id}"`);
        } else if (reqEl.startsWith('.')) {
          if (reqEl.includes('[')) {
            const className = reqEl.substring(1, reqEl.indexOf('['));
            const attr = reqEl.substring(reqEl.indexOf('[') + 1, reqEl.indexOf(']'));
            expect(template.html).toContain(className);
            expect(template.html).toContain(attr);
          } else {
            const className = reqEl.substring(1);
            expect(template.html).toContain(className);
          }
        }
      }
    }
  });

  it('should resolve presets correctly via getTemplateForPreset', () => {
    expect(getTemplateForPreset('reader_chamber').presetId).toBe('reader_chamber');
    expect(getTemplateForPreset('Reader Chamber').presetId).toBe('reader_chamber');
    expect(getTemplateForPreset('living_codex').presetId).toBe('living_codex');
    expect(getTemplateForPreset('Living Codex').presetId).toBe('living_codex');
  });

  it('should pass fixed templates into getGenerateArtifactPrompt', () => {
    const prompt = getGenerateArtifactPrompt(
      'Celestial Starlight theme',
      'Reader Chamber',
      'Design a reader chamber',
      'Starlight theme',
      '',
      DEFAULT_SEN_SKIN
    );

    expect(prompt).toContain('MANDATORY FIXED TEMPLATE STRUCTURE CONTRACT');
    expect(prompt).toContain('Reader Chamber');
    expect(prompt).toContain('#reader-header');
    expect(prompt).toContain('#reader-controls');
    expect(prompt).toContain('#panel-preferences');
  });

});
