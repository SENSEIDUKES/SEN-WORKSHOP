/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { FIXED_FACE_TEMPLATES, getTemplateForPreset, validateTemplateContract } from './templates';
import { getGenerateArtifactPrompt } from './prompts';
import { DEFAULT_SEN_SKIN } from './constants';

describe('SEN Fixed Face Templates Structure & Contract', () => {

  it('should define the Reader Chamber template with required structural sections', () => {
    const template = FIXED_FACE_TEMPLATES.reader_chamber;
    expect(template).toBeDefined();
    expect(template.presetId).toBe('reader_chamber');

    const sectionIds = template.sections.map(s => s.id);
    expect(sectionIds).toContain('header');
    expect(sectionIds).toContain('viewport');
    expect(sectionIds).toContain('preferences_panel');
    expect(sectionIds).toContain('bookmarks_panel');
    expect(sectionIds).toContain('immersion_popover');
    expect(sectionIds).toContain('bottom_controls');

    const validation = validateTemplateContract(template.html, 'reader_chamber');
    expect(validation.valid).toBe(true);
    expect(validation.missingElements).toEqual([]);
    expect(validation.missingSections).toEqual([]);
  });

  it('should define the Living Codex template with required structural sections', () => {
    const template = FIXED_FACE_TEMPLATES.living_codex;
    expect(template).toBeDefined();
    expect(template.presetId).toBe('living_codex');

    const sectionIds = template.sections.map(s => s.id);
    expect(sectionIds).toContain('shell_header');
    expect(sectionIds).toContain('navigation_sidebar');
    expect(sectionIds).toContain('content_area');

    const validation = validateTemplateContract(template.html, 'living_codex');
    expect(validation.valid).toBe(true);
    expect(validation.missingElements).toEqual([]);
    expect(validation.missingSections).toEqual([]);
  });

  it('should define the Face Family template with required structural sections', () => {
    const template = FIXED_FACE_TEMPLATES.face_family;
    expect(template).toBeDefined();
    expect(template.presetId).toBe('face_family');

    const sectionIds = template.sections.map(s => s.id);
    expect(sectionIds).toContain('family_header');
    expect(sectionIds).toContain('reader_surface');
    expect(sectionIds).toContain('codex_surface');

    const validation = validateTemplateContract(template.html, 'face_family');
    expect(validation.valid).toBe(true);
    expect(validation.missingElements).toEqual([]);
    expect(validation.missingSections).toEqual([]);
  });

  it('should reject HTML that removes required template elements', () => {
    const brokenHtml = '<div id="reader-header">Broken Chamber without controls</div>';
    const validation = validateTemplateContract(brokenHtml, 'reader_chamber');
    expect(validation.valid).toBe(false);
    expect(validation.missingElements.length).toBeGreaterThan(0);
  });

  it('should resolve presets correctly via getTemplateForPreset', () => {
    expect(getTemplateForPreset('reader_chamber').presetId).toBe('reader_chamber');
    expect(getTemplateForPreset('Reader Chamber').presetId).toBe('reader_chamber');
    expect(getTemplateForPreset('living_codex').presetId).toBe('living_codex');
    expect(getTemplateForPreset('Living Codex').presetId).toBe('living_codex');
    expect(getTemplateForPreset('face_family').presetId).toBe('face_family');
    expect(getTemplateForPreset('Face Family').presetId).toBe('face_family');
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
