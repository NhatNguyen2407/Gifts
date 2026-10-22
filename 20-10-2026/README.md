# 20-10-2026

A small interactive 20/10 greeting I customized around Tiny, an animated robot. The page moves through a series of messages, changing expressions, backgrounds, and little animations before ending with a short final note.

This version lives in my `Gifts` collection. I kept it as a plain HTML, CSS, and JavaScript project so I can edit it without a build setup.

## What's inside

- Tiny's eyes and expressions change as I click or tap through the story.
- The scenes include two cat pictures, a Rem GIF from Tenor, a four-leaf clover, and the final message.
- The music player supports an intro, a short fade and pause, and a resume at the next scene.
- Lyrics can follow the MP3 timeline, starting from the side-eye cat scene and continuing through the ending.
- The layout has separate adjustments for desktop and smaller screens.

## Run locally

- Open this folder with VS Code and use Live Server or Live Preview on `index.html`.
- Click or tap on the page to move to the next scene.
- The page works without any package installation.
- The Rem GIF is embedded from Tenor, so it needs an Internet connection.

I keep the commercial recording `assets/shiori.mp3` on my computer rather than committing it to GitHub. I can use it locally, but I do not have permission to redistribute the recording in a public repository. The `.gitignore` rule `assets/*.mp3` keeps that file out of future commits without deleting it from my local project.

The public source also leaves out the complete song lyrics. For my local preview, I add an audio file I am allowed to use at `assets/shiori.mp3` and put my locally used timestamped LRC data in `js/02-lyrics.js`. The paths and timing are already configured. Without these files, the visual story can still be viewed and clicked through.

## Project structure

- `index.html` - Story text, scene elements, and asset references.
- `style.css` - Layout, animation, and responsive styles.
- `js/02-story.js` - Scene transitions and audio/lyric synchronization.
- `js/02-lyrics.js` - Local LRC data entry point; the public copy is empty.
- `js/` - Extra motion effects and mobile/desktop performance handling.
- `assets/` - Cat images and the optional local soundtrack.
- `docs/CUSTOMIZATION.md` - My notes on updating the greeting.

## Music timing

These values are in `js/02-story.js` and refer to the MP3 timeline, not the number of clicks.

```js
const MUSIC_START_TIME = 32.0;
const MUSIC_HOLD_TIME = MUSIC_START_TIME + 11.6;
const MUSIC_FADE_START = MUSIC_HOLD_TIME - 1.4;
const MUSIC_VOLUME = 0.67;
```

The intro starts at 00:32.00, fades from 00:42.20, and pauses at 00:43.60. Music then resumes as the story moves forward. Lyric timing uses `audio.currentTime`; it does not restart on each scene.

## Notes

- I adapted this from a reference website and changed the story, characters, media, timing, and ending for my own use. This repository is not a claim of ownership over the reference site or third-party media.
- The Tenor embed and cat images may be subject to their creators' rights. Please check permissions before reusing or redistributing those assets.
- This is a personal gift project, not a commercial product.
