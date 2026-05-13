document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMovieModal();
    });
});

async function openMovieModal(movieId, mediaType = 'movie') {
    const modal = document.getElementById('movieModal');
    const modalContent = document.getElementById('modalContent');
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
        <div class="flex flex-col items-center justify-center py-16">
            <div class="animate-spin rounded-full h-14 w-14 border-4 border-t-transparent mb-4" style="border-color:var(--netflix-red);border-top-color:transparent"></div>
            <p class="text-gray-400 text-sm">Loading details...</p>
        </div>
    `;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    try {
        const details = await fetchMovieDetails(movieId, mediaType);
        if (details) {
            details.media_type = mediaType;
            if (typeof addToRecentlyViewed === 'function') addToRecentlyViewed(details, mediaType);
            renderMovieModal(details);
        } else {
            modalContent.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
                    <h3 class="text-xl font-bold mb-2">Not Found</h3>
                    <p class="text-gray-400 mb-6">Sorry, we couldn't load the details.</p>
                    <button onclick="closeMovieModal()" class="text-white px-6 py-2 rounded-md hover:opacity-80 transition" style="background:var(--netflix-red)">Close</button>
                </div>
            `;
        }
    } catch {
        modalContent.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
                <h3 class="text-xl font-bold mb-2">Failed to Load</h3>
                <p class="text-gray-400 mb-6">Something went wrong. Please try again.</p>
                <button onclick="closeMovieModal()" class="text-white px-6 py-2 rounded-md hover:opacity-80 transition" style="background:var(--netflix-red)">Close</button>
            </div>
        `;
    }
}

function renderMovieModal(item) {
    const modalContent = document.getElementById('modalContent');
    if (!modalContent) return;

    const isMovie = item.media_type === 'movie';
    const title = item.title || item.name;
    const originalTitle = item.original_title || item.original_name;
    const releaseDate = item.release_date || item.first_air_date;
    const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';
    const runtime = item.runtime ? formatRuntime(item.runtime) : null;
    const seasons = item.number_of_seasons;
    const episodes = item.number_of_episodes;
    const trailer = item.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    const director = isMovie ? item.credits?.crew?.find(p => p.job === 'Director') : null;
    const creators = !isMovie ? item.created_by?.slice(0, 2) : null;
    const cast = item.credits?.cast?.slice(0, 6) || [];
    const genres = item.genres?.map(g => g.name) || [];
    const companies = item.production_companies?.slice(0, 3) || [];
    const inWatchLater = typeof window.isInWatchLater === 'function' ? window.isInWatchLater(item.id) : false;

    const posterUrl = item.poster_path
        ? `${TMDB_IMAGE_BASE}/w500${item.poster_path}`
        : 'https://placehold.co/500x750/1a1a1a/666?text=No+Poster';

    const backdropUrl = item.backdrop_path
        ? `${TMDB_IMAGE_BASE}/original${item.backdrop_path}`
        : null;

    modalContent.innerHTML = `
        <div class="relative" data-movie-id="${item.id}" data-media-type="${item.media_type}">
            ${backdropUrl ? `
                <div class="absolute inset-0 opacity-15 pointer-events-none overflow-hidden rounded-xl">
                    <img src="${backdropUrl}" alt="" class="w-full h-48 object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                </div>
            ` : ''}

            <button id="closeModal" class="absolute right-0 top-0 text-white text-2xl z-20 hover:text-red-500 transition p-1">
                <i class="fas fa-times"></i>
            </button>

            <div class="relative z-10">
                <div class="mb-5 pr-8">
                    <h2 class="text-2xl md:text-4xl font-black mb-1 leading-tight">${title}</h2>
                    ${originalTitle && originalTitle !== title ? `<p class="text-gray-400 text-sm mb-1">${originalTitle}</p>` : ''}
                    ${item.tagline ? `<p class="italic text-sm md:text-base" style="color:var(--netflix-red)">"${item.tagline}"</p>` : ''}
                </div>

                <div class="grid md:grid-cols-3 gap-5 md:gap-8">
                    <div class="md:col-span-1">
                        <div class="rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                            <img src="${posterUrl}" alt="${title}" class="w-full h-auto" onerror="this.src='https://placehold.co/500x750/1a1a1a/666?text=No+Poster'">
                        </div>

                        <div class="mt-4 bg-gray-800 rounded-xl p-4">
                            <div class="grid grid-cols-2 gap-3 text-center">
                                <div>
                                    <div class="text-xl font-bold text-yellow-400">${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</div>
                                    <div class="text-xs text-gray-400">Rating</div>
                                </div>
                                <div>
                                    <div class="text-xl font-bold">${isMovie ? (runtime || 'N/A') : (seasons ? seasons + (seasons === 1 ? ' Season' : ' Seasons') : 'N/A')}</div>
                                    <div class="text-xs text-gray-400">${isMovie ? 'Runtime' : 'Seasons'}</div>
                                </div>
                                <div>
                                    <div class="text-xl font-bold">${year}</div>
                                    <div class="text-xs text-gray-400">Year</div>
                                </div>
                                <div>
                                    <div class="text-xl font-bold">${item.popularity ? Math.round(item.popularity) : 'N/A'}</div>
                                    <div class="text-xs text-gray-400">Popularity</div>
                                </div>
                            </div>
                            ${!isMovie && episodes ? `<div class="mt-3 pt-3 border-t border-gray-700 text-center text-xs text-gray-400">${episodes} Episodes</div>` : ''}
                        </div>

                        ${item.status || companies.length > 0 ? `
                            <div class="mt-3 bg-gray-800 rounded-xl p-4">
                                ${item.status ? `
                                    <div class="mb-3">
                                        <p class="text-gray-400 text-xs uppercase tracking-wider">Status</p>
                                        <p class="font-medium text-sm mt-0.5">${item.status}</p>
                                    </div>
                                ` : ''}
                                ${companies.length > 0 ? `
                                    <div>
                                        <p class="text-gray-400 text-xs uppercase tracking-wider mb-2">Production</p>
                                        <div class="flex flex-wrap gap-1">
                                            ${companies.map(c => `<span class="bg-gray-700 px-2 py-0.5 rounded text-xs">${c.name}</span>`).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>

                    <div class="md:col-span-2">
                        ${genres.length > 0 ? `
                            <div class="flex flex-wrap gap-2 mb-5">
                                ${genres.map(g => `<span class="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs border border-gray-700">${g}</span>`).join('')}
                            </div>
                        ` : ''}

                        <div class="mb-6">
                            <h3 class="text-lg font-bold mb-2 flex items-center gap-2">
                                <i class="fas fa-align-left text-sm" style="color:var(--netflix-red)"></i> Synopsis
                            </h3>
                            <div class="bg-gray-800 rounded-xl p-4">
                                <p class="text-gray-300 leading-relaxed text-sm">${item.overview || 'No synopsis available.'}</p>
                            </div>
                        </div>

                        ${cast.length > 0 ? `
                            <div class="mb-6">
                                <h3 class="text-lg font-bold mb-3 flex items-center gap-2">
                                    <i class="fas fa-users text-sm" style="color:var(--netflix-red)"></i> Cast
                                </h3>
                                <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
                                    ${cast.map(actor => `
                                        <div class="text-center cursor-pointer cast-card" onclick="openPersonModal(${actor.id})">
                                            <div class="aspect-square w-full max-w-20 mx-auto rounded-full overflow-hidden bg-gray-700 border-2 border-transparent hover:border-red-500 transition-all">
                                                <img src="${actor.profile_path ? TMDB_IMAGE_BASE + '/w185' + actor.profile_path : 'https://placehold.co/185x185/1a1a1a/666?text=No'}"
                                                     alt="${actor.name}"
                                                     class="w-full h-full object-cover"
                                                     loading="lazy"
                                                     onerror="this.src='https://placehold.co/185x185/1a1a1a/666?text=No'">
                                            </div>
                                            <p class="text-xs font-medium mt-1 truncate">${actor.name}</p>
                                            <p class="text-xs text-gray-400 truncate">${actor.character || ''}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}

                        ${director || (creators && creators.length > 0) ? `
                            <div class="mb-6">
                                <h3 class="text-lg font-bold mb-3 flex items-center gap-2">
                                    <i class="fas fa-video text-sm" style="color:var(--netflix-red)"></i>
                                    ${isMovie ? 'Director' : 'Creator' + (creators?.length > 1 ? 's' : '')}
                                </h3>
                                <div class="flex flex-wrap gap-3">
                                    ${isMovie && director ? `
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                                                <img src="${director.profile_path ? TMDB_IMAGE_BASE + '/w185' + director.profile_path : 'https://placehold.co/185x185/1a1a1a/666?text=No'}"
                                                     alt="${director.name}" class="w-full h-full object-cover"
                                                     onerror="this.src='https://placehold.co/185x185/1a1a1a/666?text=No'">
                                            </div>
                                            <div>
                                                <p class="font-medium text-sm">${director.name}</p>
                                                <p class="text-xs text-gray-400">Director</p>
                                            </div>
                                        </div>
                                    ` : ''}
                                    ${!isMovie && creators ? creators.map(creator => `
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                                                <img src="${creator.profile_path ? TMDB_IMAGE_BASE + '/w185' + creator.profile_path : 'https://placehold.co/185x185/1a1a1a/666?text=No'}"
                                                     alt="${creator.name}" class="w-full h-full object-cover"
                                                     onerror="this.src='https://placehold.co/185x185/1a1a1a/666?text=No'">
                                            </div>
                                            <div>
                                                <p class="font-medium text-sm">${creator.name}</p>
                                                <p class="text-xs text-gray-400">Creator</p>
                                            </div>
                                        </div>
                                    `).join('') : ''}
                                </div>
                            </div>
                        ` : ''}

                        <div class="flex flex-wrap gap-3 mb-4">
                            <button class="stream-modal-btn flex items-center gap-2 text-white px-5 md:px-7 py-3 rounded-lg font-bold hover:opacity-80 transition text-sm md:text-base" style="background:var(--netflix-red)">
                                <i class="fas fa-play text-xs"></i> Stream Now
                            </button>
                            <button class="watch-later-modal-btn flex items-center gap-2 text-white px-5 py-3 rounded-lg font-bold transition text-sm ${inWatchLater ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-800 hover:bg-gray-700'}">
                                <i class="${inWatchLater ? 'fas fa-check' : 'far fa-clock'} text-xs"></i>
                                ${inWatchLater ? 'In Watch Later' : 'Watch Later'}
                            </button>
                            ${trailer ? `
                                <button class="trailer-btn flex items-center gap-2 bg-gray-800 text-white px-5 py-3 rounded-lg font-bold hover:bg-gray-700 transition text-sm">
                                    <i class="fab fa-youtube text-red-500 text-xs"></i> Trailer
                                </button>
                            ` : ''}
                        </div>

                        <div class="p-3 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 mb-4">
                            <p class="text-xs text-gray-300 flex items-start gap-2">
                                <i class="fas fa-info-circle flex-shrink-0 mt-0.5" style="color:var(--netflix-red)"></i>
                                If the stream doesn't load immediately, wait a moment or click Stream Now again.
                                ${!isMovie ? ' For TV series, you can pick Low Ads (S1E1) or Full Control (any episode).' : ''}
                            </p>
                        </div>

                        ${trailer ? `
                            <div id="trailerContainer" class="hidden">
                                <div style="position:relative;padding-bottom:56.25%">
                                    <iframe id="trailerPlayer"
                                            src="https://www.youtube.com/embed/${trailer.key}?rel=0"
                                            frameborder="0"
                                            allowfullscreen
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px">
                                    </iframe>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

    attachModalEventListeners(item);
}

function attachModalEventListeners(item) {
    const modal = document.getElementById('movieModal');
    const modalContent = document.getElementById('modalContent');

    const closeBtn = document.getElementById('closeModal');
    if (closeBtn) closeBtn.addEventListener('click', closeMovieModal);

    modal.onclick = e => { if (e.target === modal) closeMovieModal(); };

    const streamBtn = modalContent.querySelector('.stream-modal-btn');
    if (streamBtn) {
        streamBtn.addEventListener('click', () => {
            closeMovieModal();
            setTimeout(() => openStreamingPlayer(item, item.media_type), 100);
        });
    }

    const watchLaterBtn = modalContent.querySelector('.watch-later-modal-btn');
    if (watchLaterBtn) {
        watchLaterBtn.addEventListener('click', () => {
            const inList = typeof window.isInWatchLater === 'function' && window.isInWatchLater(item.id);
            if (inList) {
                window.removeFromWatchLater(item.id);
                watchLaterBtn.innerHTML = '<i class="far fa-clock text-xs"></i> Watch Later';
                watchLaterBtn.className = watchLaterBtn.className.replace('bg-green-600 hover:bg-green-700', 'bg-gray-800 hover:bg-gray-700');
            } else {
                window.addToWatchLater({
                    id: item.id,
                    title: item.title || item.name,
                    poster_path: item.poster_path,
                    media_type: item.media_type,
                    addedAt: new Date().toISOString()
                });
                watchLaterBtn.innerHTML = '<i class="fas fa-check text-xs"></i> In Watch Later';
                watchLaterBtn.className = watchLaterBtn.className.replace('bg-gray-800 hover:bg-gray-700', 'bg-green-600 hover:bg-green-700');
            }
        });
    }

    const trailerBtn = modalContent.querySelector('.trailer-btn');
    const trailerContainer = document.getElementById('trailerContainer');
    if (trailerBtn && trailerContainer) {
        trailerBtn.addEventListener('click', () => {
            const hidden = trailerContainer.classList.contains('hidden');
            trailerContainer.classList.toggle('hidden', !hidden);
            trailerBtn.innerHTML = hidden
                ? '<i class="fas fa-times text-xs"></i> Hide Trailer'
                : '<i class="fab fa-youtube text-red-500 text-xs"></i> Trailer';
            if (!hidden) {
                const player = document.getElementById('trailerPlayer');
                if (player) { const s = player.src; player.src = ''; player.src = s; }
            }
        });
    }
}

function closeMovieModal() {
    const modal = document.getElementById('movieModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
        const trailerPlayer = document.getElementById('trailerPlayer');
        if (trailerPlayer) trailerPlayer.src = '';
    }
}

function formatRuntime(minutes) {
    if (!minutes) return 'N/A';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
}

window.openMovieModal = openMovieModal;
window.closeMovieModal = closeMovieModal;
