function Sidebar() {
    return (
        <div className="w-60 bg-surface-dark border-r border-graphite flex flex-col">

            {/* Logo */}
            <div className="p-6 border-b border-graphite">
                <h1 className="font-bitcount text-2xl bg-gradient-hero bg-clip-text text-transparent">
                    BB
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <div className="space-y-2">
                    <div className="px-4 py-2 text-primary-purple bg-primary-purple/10 rounded-lg cursor-pointer">
                        🏠 Library
                    </div>
                    <div className="px-4 py-2 text-muted-text hover:text-cream-text rounded-lg cursor-pointer transition">
                        🎵 Genres
                    </div>
                </div>

                {/* Playlists Section */}
                <div className="mt-8">
                    <h3 className="px-4 text-xs font-semibold text-muted-text uppercase tracking-wider mb-2">
                        Playlists
                    </h3>
                    <div className="space-y-1">
                        <div className="px-4 py-2 text-muted-text hover:text-cream-text rounded-lg cursor-pointer transition">
                            Chill Vibes
                        </div>
                        <div className="px-4 py-2 text-muted-text hover:text-cream-text rounded-lg cursor-pointer transition">
                            Anthology 4
                        </div>
                        <button className="w-full px-4 py-2 text-left text-muted-text hover:text-primary-purple transition">
                            + New Playlist
                        </button>
                    </div>
                </div>

            </nav>

        </div>
    )
}

export default Sidebar;