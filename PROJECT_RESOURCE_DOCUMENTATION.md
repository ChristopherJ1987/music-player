# 🎵 Music Player - Project Documentation
`Last Updated: March 4, 2026`

## Table of Contents

1. [Project Vision](#project-vision)
2. [Tech Stack](#tech-stack)
3. [Design System](#tech-stack)
4. [User Flows](#user-flows)
5. [Component Architecture](#component-architecture)
6. [File Structure](#file-structure)
7. [Getting Started](#getting-started)
8. [State Management Strategy](#state-management-strategy)
9. [Next Steps](#next-steps)

---

### [Project Vision](#project-vision)

*`Problem:`*
Tired of Spotify ads and subscription costs. Need a personal, ad-free music player for local files.

*`Solution:`*
Desktop music player built with React + Electron that plays local music files with a beautiful, club-inspired interface.

*`Success Criteria:`*
Play local music without ads or subscriptions.Beautiful, polished UI (portfolio-worthy). Learning experience (audio APIs, Electron, desktop apps). Daily driver that replaces Spotify for local music.

*`Development Approach:`*
- Phase 1 - (Weeks 1-2): Web-based React player
- Phase 2 - (Week 3): Wrap in Electron
- Phase 3 - (Future): Optional streaming features

---

### [Tech Stack](#tech-stack)

#### Frontend:
*`React:`*
UI framework

*`JavaScript:`*
Programming language

*`Tailwind CSS:`*
Styling

*`Lucide React:`*
Icons

#### Desktop:
*`Electron:`*
Desktop app wrapper (Phase 2)


#### Audio:
*`HTML 5 Audio API:`*
Playback

*`Web Audio API:`*
VIsualizer (frequency analysis)

*`music-metadata:`*
Read MP3 tags, album art

#### State Management:
*`React Context or Zustand:`*
Global state

*`Manages:`*
current track, queue, playlists, library

#### Storage:
*`JSON files:`*
Store library metadata, playlists

*`File system references:`*
Point to music files

#### Development Tools:
*`Vite:`*
Fast dev server

*`Node.js:`*
Runtime

*`VS Code:`*
Editor

[![Skills](https://skillicons.dev/icons?i=react,tailwind,html,css,js,electron,vite,nodejs,npm,vscode,git,github)](https://skillicons.dev)

---

### [Design System](#design-system)

*`Philosophy:`*
Moving beyond binary thinking, exploring nuanced spaces between extremes.

*`Visual Direction:`*
Bold, gradient-heavy, club flyer energy, geometric patterns and structure.

*`Inspiration:`*
Underground music venues, neon aesthetics, modern technical interfaces.

#### Color Palette:

##### Primary Colors - Purple Spectrum
| Color | Hex | Usage |
| ------- | ----- | ------- |
| Primary Purple | `#8B5CF6` | Main brand color,primary buttons, active states |
| Dark Purple | `#6D28D9` | Hover states, shadows, depth |
| Light Purple | `#A78BFA` | Highlights, accents, subtle emphasis |

##### Secondary Colors - Teal/Cyan
| Color | Hex | Usage |
| ------- | ----- | ------- |
| Secondary Teal | `#14B8A6` | Complementary accent, success states |
| Cyan Accent | `#06B6D4` | Interactive elements, links |

##### Accent Colors - Orange/Gold
| Color | Hex | Usage |
| ------- | ----- | ------- |
| Accent Orange | `#F97316` | Call-to-action, energy, focus |
| Gold Accent | `#F59E0B` | Warnings, highlights, warmth |

##### Neutrals
| Color | Hex | Usage |
| ------- | ----- | ------- |
|Background Dark | `#0F0F0F` | Main app background |
| Surface Dark | `#1A1A1A` | Cards, panels, elevated surfaces |
| Graphite | `#2D2D2D` | Borders, dividers, separators |
| Cream Text | `#F5F5F5` | Primary text, headings |
| Mutes Text | `#A0A0A0` | Secondary text, metadata |

##### Gradients
```
css
/* Hero Gradient (Purple → Teal) */
background: linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%);

/* Accent Gradient (Orange → Gold) */
background: linear-gradient(90deg, #F97316 0%, #F59E0B 100%);
```

#### Typography

##### Font Families

*`Display/Headers:`*
[Bitcount Mono Pixel](https://fonts.google.com/specimen/Bitcount+Mono+Pixel)
*club flyer energy, bold and distinctive*

*`Body/UI:`*
[Inter](https://fonts.google.com/specimen/Inter)
*clean, highly readbale, modern*

##### Type Scale

| Element | Font | Size | Weight | Usage |
| --------- | ------ | ------ | -------- | ------- |
| *`H1`* | Bitcount | 48px | Bold | App title, major sections |
| *`H2`* | Bitcount | 32px | Bold | Section Headers |
| *`H3`* | Inter | 24px | Semibold | Card titles, song names |
| *`Body`* | Inter | 16px | Regular | General content, descriptions |
| *`Small`* | Inter | 14px | Regular | Metadata, timestamps, captions |

##### Layout Structure
```
┌────────────────────────────────────────────────────┐
│  [🔍 Search...]          [Settings ⚙️] │ ← Top Bar (60px)
├──────────┬─────────────────────────────────────────┤
│ SIDEBAR   │  MAIN CONTENT                              │
│ (240px)   │                                            │
│           │  ╔════════════════════════════╗         │
│ Library   │  ║ NOW PLAYING                   ║         │
│ Genres    │  ║ [Album Art 300x300px]         ║         │
│ Playlist  │  ║ Song Title • Artist           ║         │
│           │  ╚════════════════════════════╝         │
│           │                                            │
│           │  [LIBRARY GRID - 5 columns]                │
│           │  🎵 🎵 🎵 🎵 🎵                             │
│           │  Album covers 180x180px                    │
│           │                                            │
└──────────┴─────────────────────────────────────────┘
│ [◀][▶] ●═══════════○ [🔊] [Orb Icon] │ ← Playback (80px)
└────────────────────────────────────────────────────┘
```

---

