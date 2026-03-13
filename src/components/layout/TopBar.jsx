import { useMusic } from '../../context/MusicContext';

function TopBar() {
    const { searchQuery, setSearchQuery } = useMusic();

    return (
        <div className="h-16 bg-surface-dark border-b border-graphite flex items-center justify-between px-6">
            {/* Left: Search placeholder */}
            <div className="flex-1 max-w-md relative">
                <input
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='🔍 Search for songs, artists, albums...'
                    className='w-full bg-graphite rounded-lg px-4 py-2 pr-10 text-cream-text placeholder-muted-text focus:outline-none focus:ring-2 focus:ring-primary-purple'
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

            {/* Right: Settings placeholder */}
            <div className="flex items-center gap-4">
                <button className="text-muted-text hover:text-cream-text transition">
                    ⚙️ Settings
                </button>
            </div>

        </div>
    )
}

export default TopBar;