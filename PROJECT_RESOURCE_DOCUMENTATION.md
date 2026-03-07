# 🎵 Music Player - Project Documentation
`Last Updated: March 4, 2026`

## Table of Contents

1. [Project Vision](#project-vision)
2. [Tech Stack](#tech-stack)
3. [Design System](#design-system)
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

### [User Flows](#user-flows)

> Flow 1: First-Time User - Adding Music

1. User opens app (empty state)
2. User sees all UI elements (sidebar, top bar, main content area, playback bar) 
   - Main content area shows: "Add Music to Get Started" prompt
3. User clicks "Add Music Folder" button
4. OS file picker opens (select folder with music)
5. App scans folder, reads metadata (music-metadata library)
6. Shows progress: "Scanning... Found 47 songs"
7. Library populates in main content area (album art grid)
8. Success! Sidebar shows "Library" is now active

**`Key Points:`**
- User can add more music anytime via settings or "+ Add Music" button
- Music files stay in original locations (app stores files paths)
- Initial scan reads: title, artists, album, artwork, duration

<br>

> Flow 2: Daily Use - Playing Music

1. User opens app (library already loaded)
2. Main content area shows library (album art grid)
3. Two interaction paths:
   - Path A - Browse & Click:
     - User scrolls library grid in main content area
     - Clicks album cover
     - Playback bar loads song info
     - Now Playing card updates in main content area
     - Album art displays, music plays
     - Queue builds (rest of album continues)
   - Path B: Search:
     - User types in top search bar
     - Main content area filters results in real-time
     - User clicks song from filtered results
     - Playback bar loads, Now Playing updates
     - Song plays, search results remain visible

**`Key Points:`**
- Sidebar (library, genres, playlists) click: Main content area changes
- Main content area (song, album) click: Playback bar updates
- Playback bar: Tracks what's playing, what's next in queue
- Search is instant - no submit button or onClick handling needed

<br>

> Flow 3: Creating a Playlist

1. User finds song they want to save
2. Clicks three-dot menu (⋮) on album card
3. Context menu appears
   - Add to Playlist
   - Go to Album
   - View Artist
4. Clicks "Add to Playlist"
5. Submenu shows:
   - Existing playlists: "Chill", "Rage"
   - "+ Create New Playlist"
6. Clicks existing playlist:
   - Song added toast notification - "Added to Study Sessions ✓"
7. Clicks "+ Create New Playlist":
   - Modal Appears: "Name your playlist"
   - Types "Study Sessions", clicks Create
   - New playlist appears in sidebar
   - Song added to new playlist

**`Key Points:`**
- Right-click OR three-dot menu (⋮)
- Quick add to existing playlist
- Easy playlist creation
- Visual feedback (toast notifications)

<br>

> Flow 4: Visualizer

1. Song playing in playback bar
2. Frequency orb visible in Now PLaying card (pulsing to beat)
3. User clicks orb
4. Fullscreen visualizer overlay fades in
5. Immersive animation (purple/teal/orange/gold waves)
6. User presses ESC or clicks background
7. Returns to normal view, orb still pulsing

---

### [Component Architecture](#component-architecture)

> App Structure

```
javascript

<App>
    <TopBar />
    <div className="main-layout">
        <Sidebar />
        <MainContent />
    </div>
    <PlaybackBar />
    {showVisualizer && <Visualizer />}
</App>
```

> Component Breakdown

#### TopBar.jsx

```
javascript

<TopBar>
    <SearchBar
        value={searchQuery}
        onChange={handleSearch}
    />
    <SettingsButton
        onClick={openSettings}
    />
<TopBar />
```
**`Responsibilities:`**
- Search input (filters library in real-time)
- Settings access
- Always visible

#### Sidebar.jsx

```
javascript

<SideBar>
    <Logo /> {/* Beyond binary BB Logo */}
    <Navigation>
        <NavItem
            icon="home"
            label="Library"
            active={view === 'library'}
        />
        <NavItem
            icon="music"
            label="Genres"
            active={view === 'genres'}
        />
    </Navigation>
    <Divider />
    <PlaylistSection>
        <h4>Playlists</h4>
        {playlists.map(playlist => (
            <PlaylistItem
                key={playlist.id} {...playlist}
            />
            <Button
                onClick={createPlaylist}>+ New Playlist
            </Button>
        ))}
    </PlaylistSection>
</SideBar>
```
**`Props:`**
- currentView (string: 'library', 'genres', 'playlist')
- playlists (array)
- onNavigate (function)

**`Responsibilities:`**
- Navigate between views
- Show playlists
- Create new playlists

#### MainContent.jsx

```
javascript

<MainContent view={currentView}>
    <NowPlaying track={currentTrack} isPlaying={isPlaying} />
    {view === 'library' && <LibraryView songs={filteredSongs} />}
    {view === 'genres' && <GenresView />}
    {view === 'playlist' && <PlaylistView playlist={activePlaylist} />}
    {view === 'search' && <SearchResults results= {searchResults} />}
</MainContent>
```
**`Responsibilities:`**
- Display appropriate view based on sidebar navigation
- Always show Now Playing card at top
- Render content grid/list below

#### NowPlaying.jsx

```
javascript

<NowPlaying track={currentTrack} isPlaying={isPlaying}>
    <div className="album-art-container">
        <AlbumArt src={track.artwork} size="large" />
        {isPlaying && <FrequencyOrb audioData={frequencyData} />}
    </div>
    <TrackInfo>
        <h2 className="font-bitcount">{track.title}</h2>
        <p>{track.artist}</p>
        <p className="muted">{track.album}</p>
    </TrackInfo>
</NowPlaying>
```
**`Features:`**
- Large album art (300x300px)
- Frequency orb overlay when playing
- Gradient border (purple → teal)
- Click orb → Fullscreen visualizer

#### LibraryView.jsx

```
javascript

<LibraryView songs={songs}>
    <ViewToggle mode={viewMode} onChange={setViewMode} />
    {viewMode === 'grid' ? (
        <AlbumGrid songs={songs} onPlay={handlePlay} />
    ) : (
        <SongList songs={songs} onPlay={handlePlay} />
    )}
</LibraryView>
```
**`Grid View:`**
- 5 columns of album art
- 180x180px thumbnails
- Hover: Ornage glow,lift effect

#### AlbumCard.jsx (reusable)

```
javascript

<AlbumCard song={song} onClick={handlePlay}>
    <AlbumArt src={song.artwork} size="medium" />
    <SongInfo>
        <h4>{song.title}<h4>
        <p>{song.artist}</p>
        <p classname="muted">{song.title}</p>
    </SongInfo>
    <ContextMenuButton onClick={openMenu} />
</AlbumCard>
```
**`Hover Effects:`**
- Orange border glow
- Slight elevation
- Play button overlay


#### Playbackbar.jsx

```
javascript

<PlaybackBar>
    <TrackThumbnail src={currentTrack.artwork} />
    <Trackinfo mini>
        {currentTrack.title } • {currentTrack.artist}
    </TrackInfo>
    <Controls>
        <Button icon="skip-back" onClick={previousTrack} />
        <Button icon={isPlaying ? "pause" : "play"} onClick-{togglePlay} />
        <Button icon="skip-forward" onClick={nextTrack} />
    </Controls>
    <ProgressBar current={currentTime} duration={duration} onChange={seek} />
    <VolumeControl value={volume} onChange={setVolume} />
    <VisualizerToggle onClick={toggleFullscreenVisualizer} />
</Playbackbar>
```
**`Responsibilities:`**
- Playback controls
- Progress tracking
- Volume
- Queue Management (internal)
- Visualizer toggle

#### Visualizer.jsx

```
javascript

<Visualizer isActive={showFullscreen} audioElement={audioRef.current} onClose={handleClose}>
    <Canvas draw={drawFrequencyOrb} audioData={frequencyData} />
</Visualizer>
```

**`Technical Implementation`**
- HTML5 Canvas
- Web Audio API `AnalyserNode`
- Reads frequency data from playing audio
- Draws animated orb with waves
- Purple/teal/orange/gold gradient
- Pulsates with beat

---

### [File Structure](#file-structure)

```
music-player/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── App.jsx
│   │   │   ├── TopBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MainContent.jsx
│   │   │   └── PlaybackBar.jsx
│   │   ├── music/
│   │   │   ├── NowPlaying.jsx
│   │   │   ├── LibraryView.jsx
│   │   │   ├── AlbumCard.jsx
│   │   │   ├── AlbumGrid.jsx
│   │   │   └── SongList.jsx
│   │   ├── player/
│   │   │   ├── Controls.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── VolumeControl.jsx
│   │   │   └── Visualizer.jsx
│   │   └── ui/
│   │       ├── Modal.jsx
│   │       ├── ContextMenu.jsx
│   │       ├── Button.jsx
│   │       └── EmptyState.jsx
│   ├── hooks/
│   │   ├── useAudio.js        # Audio playback logic
│   │   ├── useLibrary.js      # Load/scan music files
│   │   ├── usePlaylists.js    # Playlist management
│   │   └── useVisualizer.js   # Audio analysis
│   ├── context/
│   │   ├── MusicContext.jsx   # Global music state
│   │   └── PlayerContext.jsx  # Playback state
│   ├── utils/
│   │   ├── fileScanner.js     # Scan folders for music
│   │   ├── metadata.js        # Read MP3 tags
│   │   └── storage.js         # Save/load JSON data
│   ├── styles/
│   │   └── globals.css        # Tailwind + custom CSS
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── fonts/
│       ├── Bitcount.woff2
│       └── Inter.woff2
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

### [Getting Started](#getting-started)

> Initial Setup

```
bash# Create React app with Vite
npm create vite@latest music-player -- --template react
```

cd music-player

> Install Dependencies

```
npm install
```

> Install additional packages

```
npm install music-metadata lucide-react
```

> Install Tailwind CSS

```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

> Run dev server

```
npm run dev
```

> Tailwind Configuration

```
javascript
//tailwind.config.js
    export default {
        content: [
            "./index.html",
            "./src.**/*.{js,ts,jsx,tsx}",
        ],
        theme: {
            extend: {
                colors: {
                    'primary-purple': '#8B5CF6',
                    'dark-purple': '#6D28D9',
                    'secondary-teal': '#14B8A6',
                    'accent-orange': '#F97316',
                    'bg-dark': '#0F0F0F',
                    'surface-dark': '#1A1A1A',
                    'graphite': '#2D2D2D',
                },
                fontFamily: {
                    'bitcount': ['Bitcount Mono Pixel', 'monospace'],
                    'sans': ['Inter', 'sans-serif'],
                },
            },
        },
        plugins: [],
    }
```

> Import Fonts

```
css
/* src/styles/global.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Pixelify+sans:wght@400;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
    --gradient-hero: linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%);
    -gradient-accent: linear-gradient(90deg, #F97316 0%, #F59E0B 100%);
}

body {
    background-color: #0F0F0F;
    color: #F5F5F5;
    font-family: 'Inter', sans-serif;
}
```

---

### [State Management Strategy](#state-management-strategy)

*`Global State (React Context)`*

Here's how to share state across components:

```
export function MusicProvider({children}) {

    const [library, setLibrary] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [currentView, setCurrentView] = useState('library');
    const [searchQuery, setSearchQuery] = useState('');

    // Filtered songs based on search
    const filteredSongs = library.filter(song => 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) || song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <MusicContext.Provider value={{
            library,
            setLibrary,
            playlists,
            setPlaylists,
            currentView,
            setCurrentView,
            serachQuery,
            setSearchQuery,
            filteredSongs,
        }}>
            {children}
        </MusicContext.Provider>
    );
}

export const useMusic = () => useContext(MusicContext);
```

Usage in components:

```
javascript

function LibraryView() {
    const { filteredSongs } = useMusic();

    return (
        <div>
            {filteredSongs.map(song => (
                <AlbumCard key={song.id} song={song} />
            ))}
        </div>
    );
}
```

PlayerContext.jsx - Playback State

```
javascript

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
    const audioRef = useRef(newAudion());
    const [currentTrack, setCurrentTrack] = uSeState(null);
    const [isPlaying, setIsPLaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [volume, setVolume] = useState(75);

    const play = (track) => {
        audioRef.current.src = track.filePath;
        audioRef.current.play();
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const pause = () => {
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const togglePlay = () => {
        if (isPlaying) pause();
        else audioRef.current.play();
    };

    return (
        <PlayerContext.provider value={{
            currentTrack,
            isPlaying,
            queue,
            volume,
            play,
            pause,
            togglePlay,
            audioref,
        }}>
            {children}
        </PlayerContext.Provider>
    );
}

export const useplayer = () => useContext(PlayerContext);
```

Usage:

```
javascript

function AlbumCard({ song }) {
    const { play } = usePlayer();

    return (
        <div onClick={() => play(song)}>
            {/* Card content */}
        </div>
    );
}
```

> State Flow Diagram

*`Sideabar click`* → *`MusicContext.setCurrentView`* → *`MainContent re-renders`*

*`Search input`* → *`MusicContext.setSearchQuery`* → *`filteresSongs updates`* → *`LibraryView re-renders`*

*`AlbumCard click`* → *`PlayerContext.play(song)`* → *`PlaybarBar updates`* → *`NowPlaying updates`*

**`Key Principles:`**
- State flows from parent contexts down to child components via hooks.

---

### [Next Steps](#next-steps)

> Week 1: Core Structure

- Day 1-2: Setup & Layout
  - Create Vite React app
  - Set up Tailwind CSS
  - Create Basic Layout (TopBar, Sidebar, MainContent, PlaybackBar)
  - Add placeholder content

- Day 3-4: Context & State
  - Implement MusicContext
  - Implement PlayerContext
  - Wire up navigation (sidebar → main content)

- Day 5-7: Library & Playback
  - Build file scanner (select folder, read music files)
  - Use music-metadata to read MP3 tags
  - Display Library grid
  - Implement basic audio playback (HTML5 Audio)

>Week 2: Features & Polish

- Day 8-10: Search & Playlists
  - Real-time search filtering
  - Create playlist functionality
  - Context menu (add to playlist)
  - Playlist view

- Day 11-12: UI Polish
  - Gradients, hover effects
  - Album art display
  - Empty states
  - Loading states

- Day 13-14: Playback Controls
  - Progress bar (seek)
  - Volume Control
  - Next/previous track
  - Queue management

> Week 3: Electron Wrapper

- Day 15-17: Desktop App
  - Install Electron
  - Configure Electron main process
  - Package web app for desktop
  - Add native file picker (instead of web input)

- Day 18-19: Testing & Bug Fixes
  - Test on Mac
  - Fix edge cases
  - Performance optimization

- Day 20-12: Polish & Documentation
  - Final UI tweaks
  - Write README
  - Polish Github repository
  - First release!

> Phase 2 (Future): Visualizer

- Implement Web Audio API AnalyserNode
- Create Canvas-based frequency orb
- Fullscreen visualizer mode
- Purple/teal/orange/gold gradients

> Phase 3 (Optional) Streaming

- Research Youtube streaming integration
- Implement as optional toggle
- Keep local playback as primary

---

**`Resources:`**

> Documentation

```
React: https://react.dev
Tailwind CSS: https://tailwindcss.com
Electron: https://electronjs.org
Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
```

> Libraries

```
music-metadata: https://github.come/homebrew/borewit/music-metadata
lucide-react: https://lucide.dev
```