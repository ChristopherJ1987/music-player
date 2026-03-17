import { useMusic } from '../../context/MusicContext';
import { Search, Settings } from 'lucide-react';

function TopBar() {
    const { searchQuery, setSearchQuery } = useMusic();

    return (
        <div className="h-16 bg-surface-dark border-b border-graphite flex items-center justify-between px-6">
            {/* Left: Search placeholder */}
            <div className="flex-1 max-w-2xl">
                <div className='relative'>
                    <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-text'>
                        <Search size={20} />
                    </div>
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder='Search for songs, artists, albums...'
                        className='w-full bg-surface-dark text-cream-text pl-10 pr-4 py-2 rounded-lg border border-graphite focus:border-primary-purple focus:outline-none'
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-text hover:text-cream-text transition'
                        >
                            x
                        </button>
                    )}
                </div>
            </div>

            {/* Right: Settings placeholder */}
            <div className="flex items-center gap-4">
                <button className='p-2 text-muted-text hover:text-cream-text transition'>
                    <Settings size={24} />
                </button>
            </div>

        </div>
    )
}

export default TopBar;