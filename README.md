# Music Player

A browser-based music player built with React and Vite. Users can import local audio files or entire folders, browse their library by albums, artists, or genres, manage playlists, and control playback - all without a backend.

## Tech Stack
- **`React 19`** - UI and state management via Context API
- **`Vite 7`** -  dev server and build tool
- **`Tailwind CSS 3`** - utility first styling
- **`music-metadata-browser`** - reads ID3/metadata tags from audio files in the browser
- **`lucide-react`** - icon library

[![My Skills](https://skillicons.dev/icons?i=react,vite,tailwind,vscode,npm,git,github)](https://skillicons.dev)

---

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 (http://localhost:5173) and use the **`Import Music`** button in the Albums view to load your local audio files.

*Available Scripts:*
| Script | Decription |
| :--- | :--- |
| npm run dev | Start the Vite dev server with HMR |
| npm run build | Production build to dist/ |
| npm run preview | Serve the production build locally |
| npm run lint | Run ESLint |
---

*Supported Audio Formats:*
<br>
| .mp3 | .flac | .wav | .m4a | .ogg | .aac |

---

## File Structure

```
music-player/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── assets/
    │   └── react.svg
    ├── context/  
    │   ├── MusicContext.jsx
    │   └── PlayerContext.jsx
    ├── utilities/
    │   └── fileScanner.js
    └── components/
        ├── layout/
        │   ├── TopBar.jsx
        │   ├── Sidebar.jsx
        │   ├── MainContent.jsx
        │   └── PlaybackBar.jsx
        ├── views/
        │   ├── AlbumsView.jsx
        │   ├── AlbumDetailView.jsx
        │   ├── ArtistsView.jsx
        │   ├── ArtistDetailView.jsx
        │   ├── GenresView.jsx
        │   ├── PlaylistView.jsx
        │   └── SearchResultsView.jsx
        └── ui/
            ├── ContextMenu.jsx
            └── Toast.jsx
```

---

**`music-player/ (root)`**
| File | Purpose |
| :--- | :--- |
| index.html | App entry point; mounts the React root. |
| vite.config.js | Vite configuration; registers the @vitejs/plugin-react plugin. |
| tailwind.config.js | Tailwind theme; defines custom colors (primary-purple, bg-dark, etc.) and fonts. |
| postcss.config.js | PostCSS config; wires Tailwind and Autoprefixer into the CSS pipeline. |
| eslint.config.js | ESLint rules for React hooks and fast-refresh. |
| package.json | Project dependencies and npm scripts (dev, build, lint, preview). |

---

**`src/`**
| File | Purpose |
| :--- | :--- |
| main.jsx | React entry point; wraps <App> in MusicProvider then PlayerProvider. |
| App.jsx | Root layout; composes TopBar, Sidebar, MainContent, and PlaybackBar. |
| index.css | Global styles; Tailwind directives, gradient CSS variables, and Inter font import. |
| App.css | Minimal base styles, largely superseded by Tailwind. |

---

**`src/assets/`**
| File | Purpose |
| :--- | :--- |
| react.svg | Default Vite/React logo asset; not used in the production UI. |

---

**`src/context/`**
| File | Purpose |
| :--- | :--- |
| MusicContext.jsx | Holds the song library, derived albums and artists lists, playlists, current view, and search query. Exposes library management helpers. Consumed via useMusic(). |
| PlayerContext.jsx | Owns the HTML Audio element and all playback state - current track, queue, seek position, volume, shuffle, and repeat mode. Consumed via usePlayer(). |

---

**`src/utilities/`**
| File | Purpose |
| :--- | :--- |
| fileScanner.js | Audio file ingestion; parses metadata tags with music-metadata-browser, extracts album art as object URLs, and returns structured song objects. Also provides pickMusicFolder() and pickAudioFiles() for triggering the browser file/folder pickers. |

---

**`src/components/layout/`**
| File | Purpose |
| :--- | :--- |
| TopBar.jsx | Fixed top bar; contains the search input. Submitting sets currentView to 'search'; clearing resets it to 'albums'. |
| Sidebar.jsx | Left navigation panel; links to Albums, Artists, and Genres views and lists user playlists. Right-clicking a playlist opens a context menu for rename/delete. |
| MainContent.jsx | Scrollable content area; reads currentView from MusicContext and renders the matching view component. Also displays the "Now Playing" card at the top. |
| PlaybackBar.jsx | Fixed bottom bar; renders transport controls (shuffle, previous, play/paus, next, repeat), a clickable progress bar, and a volume slider. |

---

**`src/components/views`**
| File | Purpose |
| :--- | :--- |
| AlbumsView.jsx | Grid of album cards built from MusicContext.albums. Includes the folder import button that triggers fileScanner and adds songs to the library. |
| AlbumDetailView.jsx | Song list for a single album. Clicking a song plays it with the full album as the queue. Right-click menu allows adding songs or the whole album to a playlist. |
| ArtistsView.jsx | Grid of artist cards built from MusicContext.artists. Clicking navigates to the artist detail view. |
| ArtistDetailView.jsx | Song list for a single artist. Same play/queue and playlist-add behavior as AlbumDetailView. |
| GenresView.jsx | Placeholder view for the Genres section; not yet fully implemented. |
| PlaylistView.jsx | Song list for a user-created playlist. Supports playing individual tracks, removing songs, and playing the full playlist as a queue. |
| SearchResultsView.jsx | Displays songs, albums, and artists matching MusicContext.searchQuery. Clicking a result plays the track or navigates to the relevant detail view. |

---

**`src/components/ui/`**
| File | Purpose |
| :--- | :--- |
| ContextMenu.jsx | Floating right-click menu; closes on outside click or Escape. Exports ContextMenu, ContextMenuItem, and ContextMenuDivider. |
| Toast.jsx | Temporary notification banner; auto-dismissed after a timeout. Used by Sidebar to confirm playlist rename and delete actions. |

---