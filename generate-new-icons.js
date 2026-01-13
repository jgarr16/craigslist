#!/usr/bin/env node

/**
 * Generate new icon designs for Fauxlist
 * Creates PNG icons with a modern, simple design using the app's purple gradient
 * 
 * Usage: node generate-new-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICON_SIZES = [180, 192, 512, 96]; // Apple Touch Icon sizes + favicon
const OUTPUT_DIR = './my-favicon';

// App colors from styles.css
const GRADIENT_START = '#667eea';
const GRADIENT_END = '#764ba2';

console.log('🎨 Generating new Fauxlist icons...\n');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function createIcon(size) {
    const padding = Math.round(size * 0.15); // 15% padding
    const contentSize = size - (padding * 2);
    const center = size / 2;
    
    // Create SVG for the icon design
    const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${GRADIENT_START};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${GRADIENT_END};stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background circle -->
      <circle cx="${center}" cy="${center}" r="${contentSize / 2}" fill="url(#grad)"/>
      
      <!-- Letter "F" design - bold and modern -->
      <text 
        x="${center}" 
        y="${center}" 
        font-family="Arial, sans-serif" 
        font-size="${contentSize * 0.6}" 
        font-weight="900" 
        fill="white" 
        text-anchor="middle" 
        dominant-baseline="central"
        style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        F
      </text>
    </svg>
    `;
    
    // Convert SVG to PNG
    const pngBuffer = await sharp(Buffer.from(svg))
        .png()
        .toBuffer();
    
    return pngBuffer;
}

async function generateAllIcons() {
    console.log('Creating icons...\n');
    
    for (const size of ICON_SIZES) {
        try {
            console.log(`  Creating ${size}x${size} icon...`);
            const iconBuffer = await createIcon(size);
            
            let filename;
            if (size === 180) {
                filename = 'apple-touch-icon.png';
            } else if (size === 192) {
                filename = 'web-app-manifest-192x192.png';
            } else if (size === 512) {
                filename = 'web-app-manifest-512x512.png';
            } else if (size === 96) {
                filename = 'favicon-96x96.png';
            }
            
            const outputPath = path.join(OUTPUT_DIR, filename);
            
            // Backup existing file if it exists
            if (fs.existsSync(outputPath)) {
                const backupPath = outputPath + '.old';
                fs.copyFileSync(outputPath, backupPath);
                console.log(`    ✓ Backed up existing file to ${backupPath}`);
            }
            
            fs.writeFileSync(outputPath, iconBuffer);
            console.log(`    ✓ Created ${filename}`);
            
        } catch (error) {
            console.error(`    ❌ Error creating ${size}x${size} icon:`, error.message);
        }
    }
    
    console.log('\n✅ Done! New icons generated.');
    console.log('\nNext steps:');
    console.log('1. Review the new icons');
    console.log('2. If satisfied, commit and push');
    console.log('3. Delete and re-add the icon to your iPhone home screen');
    console.log('\nTo restore old icons: Restore from .old backup files');
}

generateAllIcons().catch(console.error);
