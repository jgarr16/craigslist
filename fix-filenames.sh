#!/bin/bash

# Script to rename image files to match the expected pattern
# Changes "craigslist_category - number.ext" to "craigslist_category_number.ext"

cd images

echo "🔧 Renaming files to match pattern..."

# Rename all files that have " - " in the name
for file in craigslist_*" - "*.png; do
    # Skip if no files match
    [ -e "$file" ] || continue

    # Replace " - " with "_"
    newfile="${file// - /_}"

    echo "   $file → $newfile"
    mv "$file" "$newfile"
done

echo "✅ Done! All files renamed."
