# Fauxlist Gallery

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
