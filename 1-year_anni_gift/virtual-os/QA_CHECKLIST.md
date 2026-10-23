# Virtual OS - Regression QA

These are **manual tests**, not claims that they have been executed. Run after every significant deployment; record PASS/FAIL and browser/device details.

## Entry / navigation
- [ ] Boot screen advances through loading and login to desktop.
- [ ] Incorrect password is rejected; authorized code unlocks.
- [ ] Start toggles on first/second click and closes on outside click.
- [ ] About opens from Start, closes with its controls, and does not disappear immediately.
- [ ] Clicking a pinned app opens one window, not duplicate windows.
- [ ] Desktop icon double-click opens app on mouse; one tap opens on touch; context menu, rename and properties work.

## Window manager / taskbar
- [ ] Drag windows in all four directions; title bar remains reachable.
- [ ] Resize in all eight directions; minimums and viewport bounds respected.
- [ ] Mouse drag/resize works on desktop. On phones, windows fit above the taskbar and use close/minimize instead of touch drag/resize.
- [ ] Maximize, restore, minimize, taskbar restore, and close behave correctly.
- [ ] Show Desktop minimizes all visible windows; second click restores.
- [ ] Volume and mute sync with media; time displays; unsupported battery shows unknown.
- [ ] Check 320px, 375px, 390px, 768px, 1024px, and desktop widths, including landscape and short viewports.

- [ ] On mobile, desktop icons form a grid, widgets scroll below, and Start/taskbar stay visible without horizontal overflow.

## Applications
- [ ] Gallery: narrow window sidebar becomes top tabs; thumbnails, lightbox and close remain usable.
- [ ] Music: playlist switches to one column in narrow windows; play/pause and switching tracks work.
- [ ] Music: changing Our Melody ↔ Gu Nhạc Ngày Xưa does not interrupt playback.
- [ ] Music: playback completes and resets progress; mute/volume work.
- [ ] Letter: typewriter runs; Show full letter skips typing; scrolling works.
- [ ] MemoryMatch: match eight pairs, finish, restart and achievement unlock.
- [ ] Terminal: help, ls, clear, history, and secret commands work.
- [ ] Timeline: verified milestone shown with no placeholder dates.
- [ ] Quiz: known question, correct/wrong feedback, results and retry.
- [ ] Achievements: unlock persists across refresh; toast and view render.

## Desktop extras
- [ ] Sticky note shows message, drag and dismiss work.
- [ ] Pet click/feed, affection persistence.
- [ ] Countdown increments; special-day banner appears on relevant calendar date.
- [ ] Theme changing, screensaver and prank BSOD/shutdown flow.
- [ ] Desktop positions remain reachable after browser resize.
- [ ] Favicon, linked assets, image/music files load without 404.

## Six-month site (separate entrypoint)
- [ ] Intro envelope, password, choices, menu navigation and ending.
- [ ] Music pauses when navigating away; album art and gallery images load.
- [ ] Layout at 375px/768px/desktop has no horizontal clipping.

## Checks
- [ ] Run `npm install` then `npm run lint` in `1-year_anni_gift/virtual-os`.
- [ ] Run `npm run build` and review errors/warnings.
- [ ] Inspect console errors and failed network requests in deployed site.
- [ ] Repeat the manual test grid in Chrome desktop and a mobile browser.

**Earlier check (2026-10-15):** GitHub Vercel commit status: SUCCESS. Source checks of key application wiring passed. Full browser E2E tests, lint and local build are **not executed** because Vercel account scope returned 403 and repository clone is network-blocked in this environment. These tests must remain unchecked until verified.

**Responsive source pass (2026-10-23):** Updated phone/tablet layout and interactions on a feature branch. GitHub Vercel Preview build reported SUCCESS for the branch. The Vercel team API returned 403, and local repository cloning is network-blocked. Manual viewport inspection, touch-device testing, local lint and local build were not performed; checklist items above remain unchecked until verified.
