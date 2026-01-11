#!/usr/bin/env node

/**
 * Script to reduce padding in icon images by scaling up the icon content
 * This makes the icon appear larger on iPhone home screens
 * 
 * Usage: node fix-icon-padding.js
 * 
 * Requirements: npm install sharp
 */

const fs = require('fs');
const path = require('path');

console.log('📱 Icon Padding Fixer');
console.log('====================\n');

// Check if sharp is available
let sharp;
try {
    sharp = require('sharp');
} catch (e) {
    console.error('❌ Error: "sharp" package not found.');
    console.error('   Please install it first: npm install sharp');
    console.error('\n   Or use: npx sharp-cli (if available)');
    process.exit(1);
}

const ICON_FILES = [
    'my-favicon/apple-touch-icon.png',
    'my-favicon/web-app-manifest-192x192.png',
    'my-favicon/web-app-manifest-512x512.png'
];

async function processIcon(filePath) {
    try {
        const fullPath = path.join(__dirname, filePath);
        
        if (!fs.existsSync(fullPath)) {
            console.log(`⚠️  Skipping ${filePath} (not found)`);
            return;
        }

        console.log(`Processing ${filePath}...`);
        
        // Read the image
        const image = sharp(fullPath);
        const metadata = await image.metadata();
        
        // Scale factor: 2.5x means we zoom in 150% more, making the icon content much larger
        // This significantly reduces the visual padding effect
        const scaleFactor = 2.5;
        const scaledWidth = Math.round(metadata.width * scaleFactor);
        const scaledHeight = Math.round(metadata.height * scaleFactor);
        
        // Create a backup
        const backupPath = fullPath + '.backup';
        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(fullPath, backupPath);
            console.log(`   ✓ Backup created: ${backupPath}`);
        } else {
            console.log(`   ℹ️  Backup already exists: ${backupPath}`);
        }
        
        // Strategy: Scale up the image, then extract the center portion
        // This effectively zooms in on the icon content
        const extractLeft = Math.round((scaledWidth - metadata.width) / 2);
        const extractTop = Math.round((scaledHeight - metadata.height) / 2);
        
        // Write to temporary file first (sharp can't write to same file)
        const tempPath = fullPath + '.tmp';
        
        await image
            .resize(scaledWidth, scaledHeight, {
                kernel: sharp.kernel.lanczos3 // High quality scaling
            })
            .extract({
                left: extractLeft,
                top: extractTop,
                width: metadata.width,
                height: metadata.height
            })
            .toFile(tempPath);
        
        // Replace original with processed version
        fs.renameSync(tempPath, fullPath);
        
        console.log(`   ✓ Zoomed in icon content (${scaleFactor}x scale)`);
        console.log(`   ✓ Output: ${metadata.width}x${metadata.height}`);
        
    } catch (error) {
        console.error(`   ❌ Error processing ${filePath}:`, error.message);
        throw error;
    }
}

async function main() {
    console.log('This script will zoom in on the icon content to reduce padding.\n');
    console.log('It scales up the icon by 2.5x and crops to center, making the');
    console.log('icon design appear much larger on iPhone home screens.\n');
    
    try {
        for (const file of ICON_FILES) {
            await processIcon(file);
        }
        
        console.log('\n✅ Done!');
        console.log('\nNext steps:');
        console.log('1. Review the updated icons in my-favicon/');
        console.log('2. If satisfied, delete the .backup files');
        console.log('3. Commit and push the changes');
        console.log('4. Delete and re-add the icon to your iPhone home screen');
        console.log('\nTo restore originals: Restore from .backup files');
    } catch (error) {
        console.error('\n❌ Script failed:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);
