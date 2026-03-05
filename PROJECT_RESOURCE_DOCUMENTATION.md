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

*`Problem`* - 
Tired of Spotify ads and subscription costs. Need a personal, ad-free music player for local files.

*`Solution`* - 
Desktop music player built with React + Electron that plays local music files with a beautiful, club-inspired interface.

*`Success Criteria`* - Play local music without ads or subscriptions.Beautiful, polished UI (portfolio-worthy). Learning experience (audio APIs, Electron, desktop apps). Daily driver that replaces Spotify for local music.

*`Development Approach`*
- Phase 1 - (Weeks 1-2): Web-based React player
- Phase 2 - (Week 3): Wrap in Electron
- Phase 3 - (Future): Optional streaming features

---

### [Tech Stack](#tech-stack)

#### Frontend:
*`React`* - 
UI framework

*`JavaScript`* - 
Programming language

*`Tailwind CSS`* - 
Styling

*`Lucide React`* - 
Icons

#### Desktop:
*`Electron`* - 
Desktop app wrapper (Phase 2)


#### Audio:
*`HTML 5 Audio API`* - 
Playback

*`Web Audio API`* - 
VIsualizer (frequency analysis)

*`music-metadata`* - 
Read MP3 tags, album art

#### State Management:
*`React Context or Zustand`* - 
Global state

*`Manages:`* - 
current track, queue, playlists, library

#### Storage:
*`JSON files`* - 
Store library metadata, playlists

*`File system references:`* - 
Point to music files (don't copy them)

#### Development Tools:
*`Vite`* - 
Fast dev server

*`Node.js v22+`* - 
Runtime

*`VS Code`* - 
Editor

##### <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" height="40"/><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="40" height="40"/><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="40" height="40"/><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/electron/electron-original.svg" width="40" height="40"/><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/zustand/zustand-original.svg" width="40" height="40"/><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/json/json-plain.svg" width="40" height="40"/><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" width="40" height="40"/><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" width="40" height="40"/><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg" width="40" height="40"/><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" width="40" height="40"/>

---

### [Design System](#design-system)

