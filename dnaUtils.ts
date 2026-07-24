/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Builds a prompt guidance snippet based on Style DNA slider values.
 * Sliders set to 0 produce no output and have no effect.
 */
export function buildDnaPrompt(styleDna: Record<string, number>): string {
  if (!styleDna) return '';

  const instructions: string[] = [];

  const theme = styleDna.theme ?? 0;
  if (theme !== 0) {
    if (theme > 0) {
      instructions.push(`- Palette Lightness: Lean towards a lighter palette direction (weight: +${theme}/100).`);
    } else {
      instructions.push(`- Palette Darkness: Lean towards a deeper dark palette direction (weight: ${theme}/100).`);
    }
  }

  const era = styleDna.era ?? 0;
  if (era !== 0) {
    if (era > 0) {
      instructions.push(`- Era / Style: Lean towards a contemporary/modern design direction with sleek grid structure and modern typography (weight: +${era}/100).`);
    } else {
      instructions.push(`- Era / Style: Lean towards a classical/traditional cultivation scroll design direction with classical typography and parchment/ornate motifs (weight: ${era}/100).`);
    }
  }

  const immersion = styleDna.immersion ?? 0;
  if (immersion !== 0) {
    if (immersion > 0) {
      instructions.push(`- Immersion: Lean towards an atmospheric, highly immersive visual presentation with ambient glow, translucent materials, and depth layers (weight: +${immersion}/100).`);
    } else {
      instructions.push(`- Immersion: Lean towards a restrained, distraction-free, ultra-clean presentation focused on high contrast readability (weight: ${immersion}/100).`);
    }
  }

  if (instructions.length === 0) return '';

  return `
**STYLE DNA SLIDER GUIDANCE:**
Let the following Style DNA preferences guide the aesthetic nuances without overriding the user's primary prompt request:
${instructions.join('\n')}
*(Note: Sliders at zero have no effect. Non-zero sliders guide visual details without overriding the main user prompt).*
`.trim();
}

/**
 * Display title for each Style DNA dimension
 */
export function getDnaTitle(key: string): string {
  if (key === 'theme') return 'Dark to Light';
  if (key === 'era') return 'Traditional to Modern';
  if (key === 'immersion') return 'Restrained to Immersive';
  return key;
}

/**
 * Value meaning description for each Style DNA dimension
 */
export function getDnaMeaning(key: string): string {
  if (key === 'theme') return 'overall brightness direction';
  if (key === 'era') return 'classical versus contemporary design direction';
  if (key === 'immersion') return 'subtle versus strongly transformed presentation';
  return '';
}

/**
 * Returns a human-readable badge label for slider status in the UI.
 */
export function getDnaStatusText(key: string, val: number): string {
  if (val === 0) return 'No Preference';

  if (key === 'theme') {
    if (val > 0) return val > 50 ? 'Bright Light' : 'Light Direction';
    return val < -50 ? 'Deep Dark' : 'Dark Direction';
  }

  if (key === 'era') {
    if (val > 0) return val > 50 ? 'Contemporary' : 'Modern Direction';
    return val < -50 ? 'Classical' : 'Traditional Direction';
  }

  if (key === 'immersion') {
    if (val > 0) return val > 50 ? 'Deep Immersion' : 'Immersive Direction';
    return val < -50 ? 'Ultra Restrained' : 'Restrained Direction';
  }

  return 'Custom';
}

