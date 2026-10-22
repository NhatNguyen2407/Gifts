# Gifts - Timeline album Style B

- 53 selected JPG photos from the original ZIP, sorted according to the Zalo chat screenshots.
- No Zalo screenshots included in this package, to avoid accidentally publishing chat content.
- Each chapter uses the layout: month title + short note + photo grid.
- No event title, location or exact photo date is invented.
- Chapter 1: Zalo group "tháng 10" 2025 (photos 1-5, including the first five photos before the label).
- Chapter 2-11: groups November 2025 through August 2026 respectively.
- Chapter 12: Zalo groups "tháng 9" and "tháng 10" 2026, combined to keep the original 12 anniversary chapters.
- Note: Screenshot labels denote calendar months; the exact date of each selected photo is unknown. The displayed anniversary date windows (24th to 23rd) are different from calendar-month groups. This grouping is provisional if the exact shoot dates should later be enforced.

## Add to GitHub

1. Extract this ZIP to the ROOT of the existing local `Gifts` repository. Preserve the `1-year_anni_gift/virtual-os/src/assets/images/timeline/month-XX` directories.
2. Use GitHub Desktop: Review changes -> Commit to main -> Push origin.
3. Vercel then deploys the latest `main`. Open TIMELINE.EXE. The project code imports `month-XX/photo-YY.jpg` automatically.
4. Images are personal and the GitHub repository is PUBLIC; be sure you are comfortable publishing before pushing. To keep photos private, change repo/deployment access before pushing.

## Verify
- Run `npm run lint` and `npm run build` in `1-year_anni_gift/virtual-os`.
- Open chapters 1 through 12. Check each image, lightbox next/previous/Escape, resizing and mobile scrolling.
- `photo_manifest.csv` lists every picture's filename and month grouping.
