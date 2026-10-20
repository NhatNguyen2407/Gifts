# 20-10-2026 Family

This is a separate copy of my Tiny 20/10 website. I made it so I can work on a version for my family without changing the original gift.

The animations, responsive layout, scene transitions, and music timing are copied from `20-10-2026`. I still need to rewrite the messages in `index.html` for my family before sharing the page.

## What I kept

- Tiny's expressions and click-to-advance scenes.
- Animated backgrounds, the cat pictures, the Rem GIF, and the four-leaf clover.
- The audio intro, fade, pause, and resume timing.
- The lyric display that starts at the side-eye cat scene and follows the audio timestamp.
- The desktop and mobile layout adjustments.

## Running locally

- Open `index.html` with Live Server or Live Preview in VS Code.
- Keep any audio I am allowed to use in `assets/shiori.mp3`.
- The public `js/02-lyrics.js` is intentionally empty. My local version can hold my own timed captions.
- No installation or build step is needed.

## Deploying to Vercel

- Import the `Gifts` repository as a new Vercel project.
- Set Root Directory to `20-10-2026-family`.
- Use the static/Other framework with no custom build command.
- Test a preview deployment before sharing the URL with my family.

Git-based deployments only include files that are actually in the repository. My local `assets/shiori.mp3` is excluded by `.gitignore`, so the Git-connected Vercel deployment will not contain it.

I do not commit or publicly deploy a commercial recording unless I have permission to distribute it. If I use audio I own or have permission to host, I can put that file in `assets/` and deploy it with the project. A public Vercel audio URL remains accessible to visitors, even when the MP3 is absent from GitHub. I cannot keep an audio file secret while also serving it directly to every browser.

## Before sharing

- Rewrite `text-1` through `text-13` in `index.html` for my family.
- Change the page title and any personal names from the original.
- Decide which images and GIF fit the new message.
- Select audio I have the right to publish and update the lyric timing if the song changes.
- Check the full story on both desktop and mobile.

## Notes

This is a personal greeting project. Some character designs, images, and outside media belong to their original creators. Keeping the source in a public repository does not make those assets free to reuse.
