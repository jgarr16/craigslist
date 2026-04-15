# Craigslist-ish Gallery

A simple, automated gallery website for displaying Craigslist listings.

## How to Add New Items

### The Easy Way (Fully Automatic!)

1. **Add your images** to the `images/` folder following this naming pattern:
   ```
   craigslist_[category]_[number].png
   ```

   Examples:
   - `craigslist_washer_dryer_1.png`
   - `craigslist_exercise_machine_1.png`
   - `craigslist_cabinet_1.png`

2. **Run the generation script:**
   ```bash
   node generate-gallery.js
   ```

3. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Add new items"
   git push
   ```

That's it! The website will automatically update with your new items and create filter buttons for each category.

## Category Naming

- Use underscores (`_`) to separate words in category names
- The script automatically formats them nicely (e.g., `washer_dryer` → "Washer Dryer")
- Supported image formats: `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`

## Examples

```
images/craigslist_washer_dryer_1.png     → Category: Washer Dryer
images/craigslist_exercise_bike_1.png    → Category: Exercise Bike
images/craigslist_office_chair_1.png     → Category: Office Chair
```

## Files

- `index.html` - Main webpage
- `styles.css` - Styling
- `generate-gallery.js` - Script that scans images and generates gallery data
- `gallery-data.json` - Auto-generated file containing all gallery items
- `images/` - Your Craigslist listing images
- `database.rules.json` - Firebase Realtime Database security rules (used for notes and want status)

## Firebase Realtime Database Rules

The app stores category notes and want/don't-want status in Firebase. To avoid access expiring (Test Mode), set Realtime Database rules in the [Firebase Console](https://console.firebase.google.com/) → **Build** → **Realtime Database** → **Rules**. Use the contents of `database.rules.json` so only `categoryNotes` and `categoryWantStatus` are readable/writable; all other paths are denied.

## Live Site

Visit your site at: `https://jgarr16.github.io/craigslist/`

## Shareable Category URLs

Each category has its own URL that you can share directly:

- **All items**: `https://jgarr16.github.io/craigslist/` or `https://jgarr16.github.io/craigslist/#all`
- **Washer Dryer**: `https://jgarr16.github.io/craigslist/#washer_dryer`
- **Home Gym**: `https://jgarr16.github.io/craigslist/#home_gym`
- **Treadmill**: `https://jgarr16.github.io/craigslist/#treadmill`
- **Nine Foot Mirror**: `https://jgarr16.github.io/craigslist/#nine_foot_mirror`

When someone visits a category URL, the page automatically filters to show only that category. They can still navigate to other categories using the filter buttons.

The URL pattern is: `https://jgarr16.github.io/craigslist/#[category_name]`

The category name in the URL should match the category name from your image filenames (the part between `craigslist_` and `_[number]`).

## Delivered Item Workflow

Use the in-app controls to keep track of items that are already resolved:

- Select a category and click **Delivered** in the "Mark this item" controls.
- Delivered categories are hidden from the default **All** view to keep active inventory clean.
- Turn on **Show delivered items** to review resolved categories or undo a status.

This gives you a lightweight way to identify what should "go away" without deleting files immediately.

## Archive Delivered Categories (Actual Removal)

When you are ready to actually remove delivered categories from active inventory:

1. Mark categories as **Delivered** in the app.
2. Run:
   ```bash
   npm run archive-delivered
   ```
3. Commit and push.

What this script does:
- Reads `categoryWantStatus` from Firebase.
- Finds categories with status `delivered`.
- Moves matching images from `images/` to `images/archive/[category]/`.
- Regenerates `gallery-data.json` so delivered categories are no longer shown.

Helpful options:
- Preview only (no file changes): `npm run archive-delivered:dry`
- Also clear delivered statuses in Firebase after archive:
  `node archive-delivered.js --clear-status`
