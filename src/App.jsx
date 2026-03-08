import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';
import PlaybackBar from './components/layout/PlaybackBar';

function App() {
  return (
    <div className='h-screen flex flex-col bg-bg-dark text-cream-text'>
      <TopBar />
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar />
        <MainContent />
      </div>
      <PlaybackBar />
    </div>
  )
}

export default App;