#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = './images';
const OUTPUT_FILE = './gallery-data.json';

console.log('🔍 Scanning images directory...');

// Read all files from images directory
const files = fs.readdirSync(IMAGES_DIR);

// Filter for image files that match the pattern: craigslist_[category]_[number].ext
const imagePattern = /^craigslist_(.+)_(\d+)\.(png|jpg|jpeg|webp|gif)$/i;
const galleryData = [];
const skippedFiles = [];

files.forEach(file => {
    // Skip system files
    if (file.startsWith('.')) {
        return;
    }

    // Check if it's an image file
    const isImage = /\.(png|jpg|jpeg|webp|gif)$/i.test(file);
    if (!isImage) {
        return;
    }

    // Check if it matches our pattern
    const match = file.match(imagePattern);
    if (match) {
        const category = match[1]; // e.g., "washer_dryer" or "exercise_machine"
        const number = match[2];
        const extension = match[3];

        galleryData.push({
            filename: file,
            category: category,
            number: parseInt(number),
            alt: category.split('_').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ') + ' ' + number
        });
    } else if (file.startsWith('craigslist_')) {
        // It starts with craigslist_ but doesn't match the pattern
        skippedFiles.push(file);
    }
});

// Sort by category, then by number
galleryData.sort((a, b) => {
    if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
    }
    return a.number - b.number;
});

// Write to JSON file
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(galleryData, null, 2));

console.log(`✅ Found ${galleryData.length} images`);
console.log(`📁 Generated ${OUTPUT_FILE}`);

// Display summary by category
const categoryCounts = {};
galleryData.forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
});

console.log('\n📊 Summary by category:');
Object.entries(categoryCounts).forEach(([category, count]) => {
    const displayName = category.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    console.log(`   ${displayName}: ${count} image(s)`);
});

// Show skipped files if any
if (skippedFiles.length > 0) {
    console.log('\n⚠️  WARNING: The following files do NOT match the expected pattern:');
    console.log('   Expected pattern: craigslist_[category]_[number].ext');
    console.log('   Example: craigslist_washer_dryer_1.png\n');
    skippedFiles.forEach(file => {
        console.log(`   ❌ ${file}`);
    });
    console.log('\n   Please rename these files to match the pattern.');
    process.exit(1); // Exit with error code
}

console.log('\n✨ Done! Now commit and push to GitHub.');
