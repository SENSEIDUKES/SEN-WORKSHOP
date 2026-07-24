/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { LOCALIZATION_DICTS } from './localization';

describe('Header Brand & Logo Configuration', () => {
  const logoUrl = 'https://pub-e482c2dbbb984c3c87ecdd8ae3a92183.r2.dev/LIBRARY/images/CELESTIAL%20LIBRARY%20ICON.jpg';

  it('should have correct title "SEN Workshop" in localization dicts', () => {
    expect(LOCALIZATION_DICTS.en.app_title).toBe('SEN Workshop');
    expect(LOCALIZATION_DICTS.es.app_title).toBe('SEN Workshop');
    expect(LOCALIZATION_DICTS.ja.app_title).toBe('SEN Workshop');
    expect(LOCALIZATION_DICTS.fr.app_title).toBe('SEN Workshop');
    expect(LOCALIZATION_DICTS.pt.app_title).toBe('SEN Workshop');
  });

  it('should have Celestial Library icon and "SEN Workshop" title in index.html', () => {
    const indexPath = path.join(process.cwd(), 'index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf-8');

    expect(indexContent).toContain('<title>SEN Workshop</title>');
    expect(indexContent).toContain(logoUrl);
  });

  it('should have "SEN Workshop" name in metadata.json', () => {
    const metadataPath = path.join(process.cwd(), 'metadata.json');
    const metadataContent = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

    expect(metadataContent.name).toBe('SEN Workshop');
  });

  it('should have "SEN Workshop" name and logo icon in manifest.json', () => {
    const manifestPath = path.join(process.cwd(), 'manifest.json');
    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    expect(manifestContent.name).toBe('SEN Workshop');
    expect(manifestContent.short_name).toBe('SEN Workshop');
    expect(manifestContent.icons[0].src).toBe(logoUrl);
  });

  it('should render the header brand element in index.tsx with correct logo URL', () => {
    const indexTsxPath = path.join(process.cwd(), 'index.tsx');
    const indexTsxContent = fs.readFileSync(indexTsxPath, 'utf-8');

    expect(indexTsxContent).toContain('className="app-header-brand"');
    expect(indexTsxContent).toContain(logoUrl);
    expect(indexTsxContent).toContain('referrerPolicy="no-referrer"');
  });
});
