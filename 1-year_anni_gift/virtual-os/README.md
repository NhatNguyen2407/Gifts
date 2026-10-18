# Virtual OS

Virtual OS is a personal interactive desktop experience built with React and Vite. I designed it around an operating-system-style interface, where visitors can unlock a desktop, open windows, explore small apps, and discover interactive details.

## Features

- Boot, loading, and login screens before the desktop experience
- Desktop icons, draggable windows, taskbar, Start menu, and context menus
- Gallery, music player, letter, memory matching, terminal, timeline, achievements, and quiz apps
- Theme selection, sound controls, cursor effects, screensaver, and decorative desktop widgets
- Local images and audio, with progress and achievement interactions

The implementation is a browser application, not a real operating system. Some content and interactions are intended for personal use.

## Technology

- React 19 and Vite 8
- JavaScript and CSS Modules
- react-draggable for draggable interactions
- Browser-managed state for parts of the interactive experience

## Run locally

From `1-year_anni_gift/virtual-os`:

```bash
npm install
npm run dev
```

Vite prints the development URL in the terminal. For linting, production build, and preview:

```bash
npm run lint
npm run build
npm run preview
```

## Project structure

| Path | Purpose |
| --- | --- |
| `src/App.jsx` | Boot-to-desktop application flow and providers |
| `src/Desktop.jsx` | Desktop layout, window handling, and application launcher |
| `src/apps/` | Eight desktop apps |
| `src/components/` | Window, taskbar, login, widgets, effects, and menus |
| `src/context/` | Achievements and sound settings |
| `src/hooks/` | Dragging, sound, and special-day behaviors |
| `src/assets/` | Local audio, illustrations, icons, and images |
| `src/styles/` | Global styling |
| `QA_CHECKLIST.md` | Manual regression checklist |

## Verification

The [QA checklist](QA_CHECKLIST.md) covers startup, navigation, window behavior, apps, responsive layout, media, and production build checks. Checklist items are planned manual checks and should not be interpreted as already passing.

The related six-month site is a separate, framework-free project in the repository root. It is not part of the Virtual OS Vite build.

## Assets

This project includes personal images, audio files, and decorative assets. Source availability is not permission to redistribute third-party music or other copyrighted material.
