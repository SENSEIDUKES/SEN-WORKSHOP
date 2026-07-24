/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { buildDnaPrompt, getDnaTitle, getDnaMeaning, getDnaStatusText } from './dnaUtils';
import { APP_SKINS, DEFAULT_SEN_SKIN } from './constants';

describe('Style DNA Panel Sliders', () => {

  it('should return empty string for zero sliders and build directional guidance for non-zero sliders', () => {
    const zeroDna = { theme: 0, era: 0, immersion: 0 };
    const nonZeroDna = { theme: -50, era: 75, immersion: 30 };

    expect(buildDnaPrompt(zeroDna)).toBe('');
    const prompt = buildDnaPrompt(nonZeroDna);
    expect(prompt).toContain('STYLE DNA SLIDER GUIDANCE');
    expect(prompt).toContain('Palette Darkness');
    expect(prompt).toContain('contemporary/modern');
    expect(prompt).toContain('immersive');
  });

  describe('Slider Titles', () => {
    it('should return correct display titles for the three dimensions', () => {
      expect(getDnaTitle('theme')).toBe('Dark to Light');
      expect(getDnaTitle('era')).toBe('Traditional to Modern');
      expect(getDnaTitle('immersion')).toBe('Restrained to Immersive');
    });
  });

  describe('Slider Meanings', () => {
    it('should return exact value meanings requested', () => {
      expect(getDnaMeaning('theme')).toBe('overall brightness direction');
      expect(getDnaMeaning('era')).toBe('classical versus contemporary design direction');
      expect(getDnaMeaning('immersion')).toBe('subtle versus strongly transformed presentation');
    });
  });

  describe('Status Badges', () => {
    it('should return No Preference for 0', () => {
      expect(getDnaStatusText('theme', 0)).toBe('No Preference');
      expect(getDnaStatusText('era', 0)).toBe('No Preference');
      expect(getDnaStatusText('immersion', 0)).toBe('No Preference');
    });

    it('should return directional labels for non-zero values', () => {
      expect(getDnaStatusText('theme', 50)).toBe('Light Direction');
      expect(getDnaStatusText('theme', -70)).toBe('Deep Dark');
      expect(getDnaStatusText('era', 60)).toBe('Contemporary');
      expect(getDnaStatusText('era', -40)).toBe('Traditional Direction');
      expect(getDnaStatusText('immersion', 80)).toBe('Deep Immersion');
      expect(getDnaStatusText('immersion', -30)).toBe('Restrained Direction');
    });
  });

  describe('App Skins Configuration', () => {
    it('should include DEFAULT_SEN_SKIN in APP_SKINS list', () => {
      expect(APP_SKINS.length).toBeGreaterThan(0);
      expect(APP_SKINS[0].id).toBe(DEFAULT_SEN_SKIN.id);
      expect(APP_SKINS[0].presets.length).toBeGreaterThan(0);
    });

    it('should have valid system prompt injection and presets for SEN Celestial Library', () => {
      const defaultSkin = APP_SKINS.find(s => s.id === 'sen-reader');
      expect(defaultSkin).toBeDefined();
      expect(defaultSkin?.name).toBe('SEN Celestial Library');
      expect(defaultSkin?.presets.map(p => p.id)).toContain('reader_chamber');
      expect(defaultSkin?.presets.map(p => p.id)).toContain('living_codex');
    });
  });

});
