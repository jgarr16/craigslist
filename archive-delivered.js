#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFileSync } = require('child_process');

const DATABASE_URL = 'https://craigslist-gallery-default-rtdb.firebaseio.com';
const STATUS_PATH = '/categoryWantStatus.json';
const IMAGES_DIR = path.join(__dirname, 'images');
const ARCHIVE_BASE_DIR = path.join(IMAGES_DIR, 'archive');
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

const args = new Set(process.argv.slice(2));
const isDryRun = args.has('--dry-run');
const shouldClearDeliveredStatus = args.has('--clear-status');

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https
            .get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    if (res.statusCode < 200 || res.statusCode >= 300) {
                        reject(new Error(`HTTP ${res.statusCode} fetching ${url}`));
                        return;
                    }
                    try {
                        resolve(JSON.parse(data || 'null'));
                    } catch (error) {
                        reject(new Error(`Invalid JSON from Firebase: ${error.message}`));
                    }
                });
            })
            .on('error', (error) => reject(error));
    });
}

function writeJson(url, payload) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(payload);
        const request = https.request(
            url,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(body)
                }
            },
            (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    if (res.statusCode < 200 || res.statusCode >= 300) {
                        reject(new Error(`HTTP ${res.statusCode} updating ${url}: ${data}`));
                        return;
                    }
                    resolve(data);
                });
            }
        );

        request.on('error', (error) => reject(error));
        request.write(body);
        request.end();
    });
}

function safeRename(src, dest) {
    try {
        fs.renameSync(src, dest);
    } catch (error) {
        if (error.code === 'EXDEV') {
            fs.copyFileSync(src, dest);
            fs.unlinkSync(src);
            return;
        }
        throw error;
    }
}

function moveCategoryFiles(category) {
    if (!fs.existsSync(IMAGES_DIR)) {
        throw new Error(`Images directory not found: ${IMAGES_DIR}`);
    }

    const archiveDir = path.join(ARCHIVE_BASE_DIR, category);
    const files = fs.readdirSync(IMAGES_DIR);
    const prefix = `craigslist_${category}_`;

    const matchingFiles = files.filter((file) => {
        if (!file.startsWith(prefix)) {
            return false;
        }
        const ext = path.extname(file).toLowerCase();
        return IMAGE_EXTENSIONS.includes(ext);
    });

    if (matchingFiles.length === 0) {
        return [];
    }

    if (!isDryRun) {
        fs.mkdirSync(archiveDir, { recursive: true });
    }

    const moved = [];
    matchingFiles.forEach((file) => {
        const sourcePath = path.join(IMAGES_DIR, file);
        const destinationPath = path.join(archiveDir, file);
        moved.push({ file, sourcePath, destinationPath });

        if (!isDryRun) {
            safeRename(sourcePath, destinationPath);
        }
    });

    return moved;
}

async function main() {
    console.log('📦 Delivered Item Archiver');
    console.log('==========================\n');

    if (isDryRun) {
        console.log('Running in DRY RUN mode. No files will be moved.\n');
    }

    const statusUrl = `${DATABASE_URL}${STATUS_PATH}`;
    const statusData = (await fetchJson(statusUrl)) || {};
    const deliveredCategories = Object.entries(statusData)
        .filter(([, status]) => status === 'delivered')
        .map(([category]) => category)
        .sort();

    if (deliveredCategories.length === 0) {
        console.log('No delivered categories found in Firebase.');
        return;
    }

    console.log(`Found ${deliveredCategories.length} delivered categor${deliveredCategories.length === 1 ? 'y' : 'ies'}:`);
    deliveredCategories.forEach((category) => {
        console.log(`  - ${category}`);
    });
    console.log('');

    let totalMoved = 0;
    deliveredCategories.forEach((category) => {
        const movedFiles = moveCategoryFiles(category);
        if (movedFiles.length === 0) {
            console.log(`⚠️  ${category}: no matching image files found in images/`);
            return;
        }

        console.log(`✅ ${category}: ${movedFiles.length} file(s) ${isDryRun ? 'would be moved' : 'moved'} to images/archive/${category}/`);
        totalMoved += movedFiles.length;
    });

    console.log(`\n${isDryRun ? 'Would archive' : 'Archived'} ${totalMoved} file(s) total.`);

    if (!isDryRun) {
        console.log('\n🔄 Regenerating gallery-data.json...');
        const galleryScriptPath = path.join(__dirname, 'generate-gallery.js');
        execFileSync(process.execPath, [galleryScriptPath], {
            stdio: 'inherit',
            cwd: __dirname
        });
    }

    if (shouldClearDeliveredStatus) {
        const nextStatusData = { ...statusData };
        deliveredCategories.forEach((category) => {
            if (nextStatusData[category] === 'delivered') {
                delete nextStatusData[category];
            }
        });

        if (isDryRun) {
            console.log('\nDRY RUN: Would clear delivered status entries in Firebase.');
        } else {
            await writeJson(statusUrl, nextStatusData);
            console.log('\n🧹 Cleared delivered status entries in Firebase.');
        }
    }

    console.log('\n✨ Done.');
}

main().catch((error) => {
    console.error('\n❌ Archive failed:', error.message);
    process.exit(1);
});
