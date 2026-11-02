# AI Assistant Guide & Context (GEMINI.md)

Welcome to **Gamma**, a modern music streaming and playlist web application. This file provides architectural context, coding rules, and development guidelines for AI assistants working in this repository.

---

## 1. Project Overview & Architecture

Gamma is built with **Next.js (App Router)**, **React 19**, and **TypeScript**, focused on delivering a rich, accessible audio player experience.

### Key Directories

- **`src/app/`**: Next.js App Router pages and layouts (`/music`, `/playlist`, etc.).
- **`src/modules/player/`**: Core player module containing playback state, React context, queue management, audio controls, and player-specific UI features.
- **`src/components/`**: Modular, reusable UI components (`Card`, `Headings`, `PageControls`, `Slider`, `Tooltip`, `buttons/`, `layout/`, etc.).
- **`src/lib/`**: Shared routing definitions (`ROUTES`), helper utilities, and app configurations.
- **`src/theme/`**: Theme tokens and styling definitions.
- **`tests/`**: Unit tests using Node.js's native test runner (`node:test`).
- **`content-collections.ts`**: Static content metadata configuration for music items.

---

## 2. Technology Stack & Key Libraries

- **Framework**: Next.js 16 (App Router) & React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4, `clsx`, `tailwind-merge` (`cn` helper)
- **UI Primitives**: Radix UI, Shadcn UI patterns, FontAwesome icons
- **Drag & Drop**: `@dnd-kit` (sortable queues and playlists)
- **Audio & Media**: `react-player` and native HTML5 Audio
- **Content Management**: Content Collections (`@content-collections/core`)
- **Testing**: Node.js native test runner (`node --test`)
- **Linting & Formatting**: ESLint 9 + Prettier

---

## 3. Standard Development Commands

When suggesting or executing commands, use these standard project scripts:

```bash
# Start local development server
npm run dev

# TypeScript type checking
npm run tsc

# Linting and automatic fixing
npm run lint
npm run lint:fix

# Code formatting
npm run format
npm run format:fix

# Run unit tests
npm run test

# Production build
npm run build
```

---

## 4. Coding Conventions & AI Directives

1. **TypeScript First**:
   - Provide explicit types/interfaces for component props, player actions, and state.
   - Avoid `any` where possible.
2. **Component Architecture**:
   - Keep components modular. Separate pure UI display from player business logic.
   - Domain-specific features belong inside `src/modules/<feature>/`, while generic UI belongs in `src/components/`.
3. **Styling**:
   - Use Tailwind CSS utility classes. Combine conditional classes using `cn(...)` (`clsx` + `tailwind-merge`).
4. **Accessibility (a11y)**:
   - Ensure interactive controls (play/pause, sliders, drag handles) have appropriate ARIA attributes, semantic roles, and keyboard navigation support.
5. **Quality Checks**:
   - Always verify that new or modified files pass `npm run tsc` or `npm run lint`.
6. **Dependencies**:
   - Do not install new third-party npm packages without checking with the user first.

---

## 5. Roadmap & Wishlist (Long-term Development Goals)

Use this section to track upcoming features, architectural ideas, and long-term polish items. Check them off as they are completed.

### Audio & Playback Features

- [ ] Implement browser Media Session API (lockscreen controls, notifications, artwork metadata)
- [ ] Add persistent player state across sessions / browser refreshes (e.g. `localStorage` queue sync)
- [ ] Keyboard shortcuts for global playback (Space to play/pause, arrows to skip/seek, M to mute)
- [ ] Audio visualizer / waveform display

### Playlists & Library Management

- [ ] Enhanced playlist drag-and-drop reordering with animations
- [ ] Custom user-created playlists and local export/import (JSON / M3U)
- [ ] Search, filter, and sorting options for the music library index page
- [ ] Track lyrics or liner notes viewer

### UI & Polish

- [ ] Mini-player floating bar when scrolling away from main player view
- [ ] Smooth page transitions and optimistic playback state updates
- [ ] Expanded dark/light mode accents and customizable player color themes

---

_(Feel free to edit, add, or remove items from the wishlist above at any time.)_
