function MainContent() {
    return (
        <div className="flex-1 bg-bg-dark overflow-y-auto">
            <div className="p-6">

                {/* Now Playing Card */}
                <div className="bg-surface-dark border-2 border-primary-purple rounded-xl p-8 mb-8">
                    <div className="flex items-center gap-6">

                        {/* Album Art Placeholder */}
                        <div className="w-72 h-72 bg-gradient-hero rounded-lg flex items-center justify-center">
                            <span className="text-6xl">...</span>
                        </div>

                        {/* Track Info */}
                        <div className="flex-1">
                            <h2 className="font-bitcount text-4xl text-cream-text mb-2">
                                Song Title
                            </h2>
                            <p className="text-xl text-muted-text mb-1">Artist Name</p>
                            <p className="text-lg text-muted-text">Album Name</p>
                        </div>

                    </div>
                </div>

                {/* Library grid */}
                <h3 className="text-2xl font-semibold text-cream-text mb-4">Library</h3>
                <div className="grid grid-cols-5 gap-4">

                    {/* Placeholder Album Cards */}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                        <div
                            key={i}
                            className="bg-surface-dark p-4 rounded-lg hover:bg-graphite transition cursor-pointer">
                                <div className="aspect-square bg-gradient-accent rounded-lg mb-3 flex items-center justify-center">
                                    <span className="text-4xl">...</span>
                                </div>
                                <h4 className="text-sm font-semibold text-cream-text truncate">
                                    Song Title {i}
                                </h4>
                                <p className="text-sm text-muted-text truncate">Artist Name</p>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    )
}

export default MainContent;