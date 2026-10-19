# Customization notes

These are the parts I usually change when I want to adjust the greeting without touching the rest of the animation.

## Messages and scenes

- Edit `text-1` through `text-13` in `index.html` to change the messages.
- The click sequence lives in `chuyenCanh()` in `js/02-story.js`.
- The final scene stays on screen after the last transition.

## Music and lyrics

- I use the `<audio id="tiny-soundtrack">` element in `index.html`.
- I keep `assets/shiori.mp3` locally. The `.gitignore` rule `assets/*.mp3` stops Git from tracking it, so removing the song from the repository does not remove my local copy.
- I keep the music start, fade, pause, and volume values near the top of `js/02-story.js`.
- `js/02-lyrics.js` accepts a timestamped LRC string through `window.TINY_SHIORI_LRC`. Its public version is intentionally empty.
- Each LRC timestamp is the time from the start of the audio file, for example `[00:43.52]A line of my own text`.
- Lyrics become visible from the side-eye cat scene, follow the soundtrack across scenes, and fade during instrumental breaks.
- Without the MP3, clicking through the story still works, but music and timed captions are unavailable.

## Images

- `assets/cat-side-eye.png` is the cat in the 20/10 scene.
- `assets/cat-like.png` appears in the next greeting.
- The Rem animation is a Tenor embed in `index.html`; it requires Internet access.
- Size and position are controlled in `style.css`. I use the existing CSS overrides at the end of that file for the larger cat and GIF layouts.

## Checking changes

- Run the page in a browser and go from the first message to the final one.
- Check desktop and narrow mobile widths so neither the text nor Tiny's face gets covered.
- Check audio start and resume if the local audio file is available.
- If the GIF does not load, confirm that Tenor is reachable.
- Check the browser console for missing local assets after renaming files.
