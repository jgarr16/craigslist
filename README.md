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
