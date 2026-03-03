🎵 Beyond Binary Music Player - Complete Project Specification
Last Updated: February 8, 2025

Table of Contents

Project Vision
Tech Stack
Design System
User Flows
Component Architecture
File Structure
Getting Started
State Management Strategy
Next Steps


<a name="vision"></a>
1. Project Vision
Problem
Tired of Spotify ads and subscription costs. Need a personal, ad-free music player for local files.
Solution
Desktop music player built with React + Electron that plays local music files with a beautiful, club-inspired interface.
Success Criteria

Play local music without ads or subscriptions
Beautiful, polished UI (portfolio-worthy)
Learning experience (audio APIs, Electron, desktop apps)
Daily driver that replaces Spotify for local music

Development Approach

Phase 1 (Weeks 1-2): Web-based React player
Phase 2 (Week 3): Wrap in Electron
Phase 3 (Future): Optional streaming features


<a name="tech-stack"></a>
2. Tech Stack
Frontend

React - UI framework (you know this!)
Tailwind CSS - Styling
Lucide React - Icons

Desktop

Electron - Desktop app wrapper (Phase 2)

Audio

HTML5 Audio API - Playback
Web Audio API - Visualizer (frequency analysis)
music-metadata - Read MP3 tags, album art

State Management

React Context or Zustand - Global state
Manages: current track, queue, playlists, library

Storage

JSON files - Store library metadata, playlists
File system references - Point to music files (don't copy them)

Development Tools

Vite - Fast dev server
Node.js v22+ - Runtime
VS Code - Editor


<a name="design-system"></a>
3. Design System
Brand: Beyond Binary
Philosophy: Moving beyond binary thinking, exploring nuanced spaces between extremes
Visual Direction: Bold, gradient-heavy, club flyer energy, geometric structure

Color Palette
css/* Primary - Purple Spectrum */
--primary-purple: #8B5CF6;
--dark-purple: #6D28D9;
--light-purple: #A78BFA;

/* Secondary - Teal/Cyan */
--secondary-teal: #14B8A6;
--cyan-accent: #06B6D4;

/* Accent - Orange/Gold */
--accent-orange: #F97316;
--gold-accent: #F59E0B;

/* Neutrals */
--bg-dark: #0F0F0F;
--surface-dark: #1A1A1A;
--graphite: #2D2D2D;
--cream-text: #F5F5F5;
--muted-text: #A0A0A0;

/* Gradients */
--gradient-hero: linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%);
--gradient-accent: linear-gradient(90deg, #F97316 0%, #F59E0B 100%);

Typography
css/* Display/Headers */
font-family: 'Bitcount', sans-serif; /* Club flyer vibe */

/* Body/UI */
font-family: 'Inter', sans-serif; /* Clean, readable */

/* Scale */
H1: Bitcount, 48px, Bold
H2: Bitcount, 32px, Bold
H3: Inter, 24px, Semibold
Body: Inter, 16px, Regular
Small: Inter, 14px, Regular
```

**Google Fonts:**
- Bitcount (Mono Pixel): https://fonts.google.com/specimen/Bitcount+Mono+Pixel
- Inter: https://fonts.google.com/specimen/Inter

---

### **Layout Structure**
```
┌────────────────────────────────────────────────┐
│  [🔍 Search...]              [Settings ⚙️]    │ ← Top Bar (60px)
├──────────┬─────────────────────────────────────┤
│ SIDEBAR  │  MAIN CONTENT                       │
│ (240px)  │                                      │
│          │  ╔════════════════════╗             │
│ Library  │  ║ NOW PLAYING        ║             │
│ Genres   │  ║ [Album Art 300px]  ║             │
│ Playlist │  ║ Song • Artist      ║             │
│          │  ╚════════════════════╝             │
│          │                                      │
│          │  [LIBRARY GRID]                     │
│          │  🎵 🎵 🎵 🎵 🎵                      │
│          │                                      │
└──────────┴─────────────────────────────────────┘
│ [◀][▶] ●══════○ [🔊] [Orb]                    │ ← Playback (80px)
└────────────────────────────────────────────────┘
```

---

### **Logo Concepts**

**Beyond Binary Logo:**
- Gradient **BB** (purple → teal)
- Frequency wave elements
- Geometric structure
- *To be refined later*

---

<a name="user-flows"></a>
## **4. User Flows**

### **Flow 1: First-Time User - Adding Music**
```
1. User opens app (empty state)
   ↓
2. Sees all UI elements (sidebar, top bar, main content, playback bar)
   Main content shows: "Add Music to Get Started" prompt
   ↓
3. Clicks "Add Music Folder" button
   ↓
4. OS file picker opens (select folder with MP3s)
   ↓
5. App scans folder, reads metadata (music-metadata library)
   ↓
6. Shows progress: "Scanning... Found 47 songs"
   ↓
7. Library populates in main content (album art grid)
   ↓
8. Success! Sidebar shows "Library" is now active
```

**Key Points:**
- User can add MORE music anytime via Settings or "+ Add Music" button
- Music files stay in original location (app stores file paths)
- Initial scan reads: title, artist, album, artwork, duration

---

### **Flow 2: Daily Use - Playing Music**
```
1. User opens app (library already loaded)
   ↓
2. Main content shows Library (album art grid)
   ↓
3. Two interaction paths:

PATH A - Browse & Click:
   ↓
3a. User scrolls library grid in main content
   ↓
4a. Clicks album cover
   ↓
5a. Playback bar loads song info
   ↓
6a. Now Playing card updates in main content
   ↓
7a. Album art displays, music plays
   ↓
8a. Queue builds (rest of album continues)

PATH B - Search:
   ↓
3b. User types in top search bar
   ↓
4b. Main content filters results in real-time
   ↓
5b. User clicks song from filtered results
   ↓
6b. Playback bar loads, Now Playing updates
   ↓
7b. Song plays, search results remain visible
```

**Key Interactions:**
- **Sidebar click** (Library/Genres/Playlist) → Main content changes
- **Main content click** (song/album) → Playback bar updates
- **Playback bar** → Tracks what's playing, what's next in queue
- Search is instant (no submit button needed)

---

### **Flow 3: Creating a Playlist**
```
1. User finds song they want to save
   ↓
2. Clicks three-dot menu (⋮) on album card
   ↓
3. Context menu appears:
   - Add to Playlist
   - Go to Album
   - View Artist
   ↓
4. Clicks "Add to Playlist"
   ↓
5. Submenu shows:
   - Existing playlists: "Workout", "Chill"
   - "+ Create New Playlist"
   ↓
6a. Clicks existing playlist → Song added
    Toast notification: "Added to Workout ✓"
    
6b. Clicks "+ Create New Playlist"
    ↓
    Modal appears: "Name your playlist"
    ↓
    Types "Study Sessions", clicks Create
    ↓
    New playlist appears in sidebar
    ↓
    Song added to new playlist
```

**Spotify-style interaction:**
- Right-click OR three-dot menu
- Quick add to existing playlist
- Easy playlist creation
- Visual feedback (toast notifications)

---

### **Bonus Flow: Visualizer**
```
1. Song playing in playback bar
   ↓
2. Frequency orb visible in Now Playing card (pulsing to beat)
   ↓
3. User clicks orb
   ↓
4. Fullscreen visualizer overlay fades in
   ↓
5. Immersive animation (purple/teal/orange waves)
   ↓
6. User presses ESC or clicks background
   ↓
7. Returns to normal view, orb still pulsing

<a name="components"></a>
5. Component Architecture
App Structure
javascript<App>
  <TopBar />
  <div className="main-layout">
    <Sidebar />
    <MainContent />
  </div>
  <PlaybackBar />
  {showVisualizer && <Visualizer />}
</App>

Component Breakdown
TopBar.jsx
javascript<TopBar>
  <SearchBar 
    value={searchQuery}
    onChange={handleSearch}
  />
  <SettingsButton onClick={openSettings} />
</TopBar>
Responsibilities:

Search input (filters library in real-time)
Settings access
Always visible


Sidebar.jsx
javascript<Sidebar>
  <Logo /> {/* Beyond Binary BB logo */}
  
  <Navigation>
    <NavItem icon="home" label="Library" active={view === 'library'} />
    <NavItem icon="music" label="Genres" active={view === 'genres'} />
  </Navigation>
  
  <Divider />
  
  <PlaylistSection>
    <h4>PLAYLISTS</h4>
    {playlists.map(playlist => (
      <PlaylistItem key={playlist.id} {...playlist} />
    ))}
    <Button onClick={createPlaylist}>+ New Playlist</Button>
  </PlaylistSection>
</Sidebar>
Props:

currentView (string: 'library', 'genres', 'playlist')
playlists (array)
onNavigate (function)

Responsibilities:

Navigate between views
Show playlists
Create new playlists


MainContent.jsx
javascript<MainContent view={currentView}>
  <NowPlaying track={currentTrack} isPlaying={isPlaying} />
  
  {view === 'library' && <LibraryView songs={filteredSongs} />}
  {view === 'genres' && <GenresView />}
  {view === 'playlist' && <PlaylistView playlist={activePlaylist} />}
  {view === 'search' && <SearchResults results={searchResults} />}
</MainContent>
Responsibilities:

Display appropriate view based on sidebar navigation
Always show Now Playing card at top
Render content grid/list below


NowPlaying.jsx
javascript<NowPlaying track={currentTrack} isPlaying={isPlaying}>
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
Features:

Large album art (300x300px)
Frequency orb overlay when playing
Gradient border (purple → teal)
Click orb → Fullscreen visualizer


LibraryView.jsx
javascript<LibraryView songs={songs}>
  <ViewToggle mode={viewMode} onChange={setViewMode} />
  
  {viewMode === 'grid' ? (
    <AlbumGrid songs={songs} onPlay={handlePlay} />
  ) : (
    <SongList songs={songs} onPlay={handlePlay} />
  )}
</LibraryView>
Grid View:

5 columns of album art
180x180px thumbnails
Hover: Orange glow, lift effect


AlbumCard.jsx (Reusable)
javascript<AlbumCard song={song} onClick={handlePlay}>
  <AlbumArt src={song.artwork} size="medium" />
  
  <SongInfo>
    <h4>{song.title}</h4>
    <p>{song.artist}</p>
    <p className="muted">{song.album}</p>
  </SongInfo>
  
  <ContextMenuButton onClick={openMenu} />
</AlbumCard>
Hover Effects:

Orange border glow
Slight elevation
Play button overlay


PlaybackBar.jsx
javascript<PlaybackBar>
  <TrackThumbnail src={currentTrack.artwork} />
  <TrackInfo mini>
    {currentTrack.title} • {currentTrack.artist}
  </TrackInfo>
  
  <Controls>
    <Button icon="skip-back" onClick={previousTrack} />
    <Button icon={isPlaying ? "pause" : "play"} onClick={togglePlay} />
    <Button icon="skip-forward" onClick={nextTrack} />
  </Controls>
  
  <ProgressBar 
    current={currentTime}
    duration={duration}
    onChange={seek}
  />
  
  <VolumeControl value={volume} onChange={setVolume} />
  <VisualizerToggle onClick={toggleFullscreenVisualizer} />
</PlaybackBar>
Responsibilities:

Playback controls
Progress tracking
Volume
Queue management (internal)
Visualizer toggle


Visualizer.jsx (Special Feature!)
javascript<Visualizer 
  isActive={showFullscreen}
  audioElement={audioRef.current}
  onClose={handleClose}
>
  <Canvas
    draw={drawFrequencyOrb}
    audioData={frequencyData}
  />
</Visualizer>
```

**Technical Implementation:**
- HTML5 Canvas
- Web Audio API `AnalyserNode`
- Reads frequency data from playing audio
- Draws animated orb with waves
- Purple/teal/orange gradient
- Pulsates with beat

---

<a name="file-structure"></a>
## **6. File Structure**
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

<a name="getting-started"></a>
7. Getting Started
Initial Setup
bash# Create React app with Vite
npm create vite@latest beyond-binary-music-player -- --template react

cd beyond-binary-music-player

# Install dependencies
npm install

# Install additional packages
npm install music-metadata lucide-react

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Run dev server
npm run dev

Tailwind Config
javascript// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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

Import Fonts
css/* src/styles/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --gradient-hero: linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%);
  --gradient-accent: linear-gradient(90deg, #F97316 0%, #F59E0B 100%);
}

body {
  background-color: #0F0F0F;
  color: #F5F5F5;
  font-family: 'Inter', sans-serif;
}

<a name="state-management"></a>
8. State Management Strategy
Global State (React Context)
You'll need to share state across components. Here's how:

MusicContext.jsx - Library & Playlists
javascriptconst MusicContext = createContext();

export function MusicProvider({ children }) {
  const [library, setLibrary] = useState([]); // All songs
  const [playlists, setPlaylists] = useState([]);
  const [currentView, setCurrentView] = useState('library');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered songs based on search
  const filteredSongs = library.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MusicContext.Provider value={{
      library,
      setLibrary,
      playlists,
      setPlaylists,
      currentView,
      setCurrentView,
      searchQuery,
      setSearchQuery,
      filteredSongs,
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
Usage in components:
javascriptfunction LibraryView() {
  const { filteredSongs } = useMusic();
  
  return (
    <div>
      {filteredSongs.map(song => (
        <AlbumCard key={song.id} song={song} />
      ))}
    </div>
  );
}

PlayerContext.jsx - Playback State
javascriptconst PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      queue,
      volume,
      play,
      pause,
      togglePlay,
      audioRef,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
Usage:
javascriptfunction AlbumCard({ song }) {
  const { play } = usePlayer();
  
  return (
    <div onClick={() => play(song)}>
      {/* Card content */}
    </div>
  );
}
```

---

### **State Flow Diagram**
```
Sidebar click → MusicContext.setCurrentView → MainContent re-renders

Search input → MusicContext.setSearchQuery → filteredSongs updates → LibraryView re-renders

AlbumCard click → PlayerContext.play(song) → PlaybackBar updates → NowPlaying updates
Key Principle: State flows from parent contexts down to child components via hooks.

<a name="next-steps"></a>
9. Next Steps
Week 1: Core Structure
Day 1-2: Setup & Layout

 Create Vite React app
 Set up Tailwind CSS
 Create basic layout (TopBar, Sidebar, MainContent, PlaybackBar)
 Add placeholder content

Day 3-4: Context & State

 Implement MusicContext
 Implement PlayerContext
 Wire up navigation (sidebar → main content)

Day 5-7: Library & Playback

 Build file scanner (select folder, read music files)
 Use music-metadata to read MP3 tags
 Display library grid
 Implement basic audio playback (HTML5 Audio)


Week 2: Features & Polish
Day 8-10: Search & Playlists

 Real-time search filtering
 Create playlist functionality
 Context menu (add to playlist)
 Playlist view

Day 11-12: UI Polish

 Gradients, hover effects
 Album art display
 Empty states
 Loading states

Day 13-14: Playback Controls

 Progress bar (seek)
 Volume control
 Next/previous track
 Queue management


Week 3: Electron Wrapper
Day 15-17: Desktop App

 Install Electron
 Configure Electron main process
 Package web app for desktop
 Add native file picker (instead of web input)

Day 18-19: Testing & Bug Fixes

 Test on Mac
 Fix edge cases
 Performance optimization

Day 20-21: Polish & Documentation

 Final UI tweaks
 Write README
 Create GitHub repository
 First release!


Phase 2 (Future): Visualizer

 Implement Web Audio API AnalyserNode
 Create Canvas-based frequency orb
 Fullscreen visualizer mode
 Purple/teal/orange gradients


Phase 3 (Optional): Streaming

 Research YouTube streaming integration
 Implement as optional toggle
 Keep local playback as primary


Resources
Documentation

React: https://react.dev
Tailwind CSS: https://tailwindcss.com
Electron (Phase 2): https://electronjs.org
Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

Libraries

music-metadata: https://github.com/borewit/music-metadata
lucide-react: https://lucide.dev

Design Inspiration

Spotify Desktop
Apple Music
Doppler (Mac app)


GitHub Repository Setup
bash# Initialize git
git init

# Create .gitignore
echo "node_modules
dist
.DS_Store
*.log" > .gitignore

# Create repository on GitHub
# Then:
git remote add origin git@github.com:ChristopherJ1987/beyond-binary-music-player.git
git add .
git commit -m "Initial commit: Beyond Binary Music Player project setup"
git push -u origin main

# Add as submodule to Beyond Binary repo (later)
cd ~/Workspace/Beyond-Binary
git submodule add git@github.com:ChristopherJ1987/beyond-binary-music-player.git personal_projects/beyond-binary-music-player

Contact & Notes
Project Name: Beyond Binary Music Player
Repository: https://github.com/ChristopherJ1987/beyond-binary-music-player
Parent Repo: Beyond Binary (with submodules)
Start Date: February 2025
Target Completion: 3 weeks (MVP)
Remember:

Start simple, iterate
Commit often
Test in browser first, Electron later
Focus on learning, not perfection
This is YOUR daily driver - make it yours!