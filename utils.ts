/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import JSZip from 'jszip';

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const exportToZip = async (sourceHtml: string, name: string) => {
    let styles = '';
    let scripts = '';
    
    // Extract styles
    let htmlContent = sourceHtml.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, p1) => {
        styles += p1 + '\n';
        return '';
    });

    // Extract inline scripts
    htmlContent = htmlContent.replace(/<script([^>]*)>([\s\S]*?)<\/script>/gi, (match, attrs, content) => {
        if (/src\s*=/i.test(attrs)) {
            return match; // keep external scripts
        }
        scripts += content + '\n';
        return '';
    });

    // Inject links
    if (!/<html/i.test(htmlContent)) {
        htmlContent = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${name}</title>\n<link rel="stylesheet" href="styles.css">\n</head>\n<body>\n${htmlContent}\n<script src="script.js"></script>\n</body>\n</html>`;
    } else {
        htmlContent = htmlContent.replace(/<\/head>/i, '  <link rel="stylesheet" href="styles.css">\n</head>');
        htmlContent = htmlContent.replace(/<\/body>/i, '  <script src="script.js"></script>\n</body>');
    }

    const zip = new JSZip();
    zip.file('index.html', htmlContent);
    zip.file('styles.css', styles.trim());
    zip.file('script.js', scripts.trim());

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.zip`;
    a.click();
    URL.revokeObjectURL(url);
};

export const extractHtmlFromMarkdown = (text: string): string => {
    if (!text) return '';
    let cleanText = text.trim();
    const htmlMatch = cleanText.match(/```(?:html|xml)?\n([\s\S]*?)```/);
    if (htmlMatch) {
         return htmlMatch[1].trim();
    }
    // Fallback manual checks
    if (cleanText.startsWith('```html')) cleanText = cleanText.substring(7).trimStart();
    if (cleanText.startsWith('```')) cleanText = cleanText.substring(3).trimStart();
    if (cleanText.endsWith('```')) cleanText = cleanText.substring(0, cleanText.length - 3).trimEnd();
    return cleanText.trim();
};

export interface DominantColor {
    hex: string;
    rgb: string;
    name: string;
}

export function extractDominantColor(html?: string, prompt?: string, styleName?: string): DominantColor {
    const combinedText = `${styleName || ''} ${prompt || ''} ${html ? html.slice(0, 3000) : ''}`.toLowerCase();

    // 1. Keyword check for explicit face themes
    if (combinedText.includes('jade') || combinedText.includes('emerald') || combinedText.includes('forest')) {
        return { hex: '#10b981', rgb: '16, 185, 129', name: 'Jade Immortal' };
    }
    if (combinedText.includes('gold') || combinedText.includes('amber') || combinedText.includes('cultivation') || combinedText.includes('parchment') || combinedText.includes('sun')) {
        return { hex: '#f59e0b', rgb: '245, 158, 11', name: 'Golden Cultivation' };
    }
    if (combinedText.includes('void') || combinedText.includes('violet') || combinedText.includes('purple') || combinedText.includes('amethyst') || combinedText.includes('mystic')) {
        return { hex: '#8b5cf6', rgb: '139, 92, 246', name: 'Void Dynasty' };
    }
    if (combinedText.includes('crimson') || combinedText.includes('rose') || combinedText.includes('ruby') || combinedText.includes('scarlet') || combinedText.includes('blood')) {
        return { hex: '#f43f5e', rgb: '244, 63, 94', name: 'Crimson Realm' };
    }
    if (combinedText.includes('frost') || combinedText.includes('moonlight') || combinedText.includes('silver') || combinedText.includes('ice') || combinedText.includes('sky')) {
        return { hex: '#38bdf8', rgb: '56, 189, 248', name: 'Moonlight Frost' };
    }

    // 2. Extract hex color codes directly from HTML
    if (html) {
        const hexMatches = html.match(/#([0-9a-fA-F]{6})/g);
        if (hexMatches) {
            for (const rawHex of hexMatches) {
                const hex = rawHex.toLowerCase();
                // Filter out standard neutral dark/light colors
                if (['#000000', '#09090b', '#111827', '#18181b', '#1f2937', '#ffffff', '#fafafa', '#f3f4f6', '#e5e7eb', '#374151', '#4b5563', '#6b7280', '#9ca3af', '#27272a'].includes(hex)) {
                    continue;
                }

                // Parse R, G, B
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);

                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const delta = max - min;
                const saturation = max === 0 ? 0 : delta / max;
                const lightness = (max + min) / (2 * 255);

                // We want vibrant, saturated accent colors
                if (saturation > 0.3 && lightness > 0.15 && lightness < 0.85) {
                    return {
                        hex,
                        rgb: `${r}, ${g}, ${b}`,
                        name: 'Synchronized Palette'
                    };
                }
            }
        }
    }

    // Default Celestial Cyan
    return { hex: '#04acff', rgb: '4, 172, 255', name: 'Celestial Starlight' };
}

