document.addEventListener('DOMContentLoaded', () => {
    initializeModal();
});

function initializeModal() {

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMovieModal();
        }
    });
}

async function openMovieModal(movieId, mediaType = 'movie') {
    const modal = document.getElementById('movieModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) return;
    
    modalContent.innerHTML = `
        <div class="flex flex-col items-center justify-center py-16">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-netflix-red border-t-transparent mb-4"></div>
            <p class="text-gray-400">Loading ${mediaType === 'movie' ? 'movie' : 'series'} details...</p>
        </div>
    `;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    
    try {

        const details = await fetchMovieDetails(movieId, mediaType);
        
        if (details) {
            details.media_type = mediaType;
            renderMovieModal(details);
        } else {
            modalContent.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-exclamation-triangle text-5xl text-yellow-500 mb-4"></i>
                    <h3 class="text-xl font-bold mb-2">Not Found</h3>
                    <p class="text-gray-400 mb-6">Sorry, we couldn't load the ${mediaType} details.</p>
                    <button onclick="closeMovieModal()" class="bg-netflix-red text-white px-6 py-2 rounded-md hover:bg-red-700 transition">
                        Close
                    </button>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error opening modal:', error);
        modalContent.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-triangle text-5xl text-yellow-500 mb-4"></i>
                <h3 class="text-xl font-bold mb-2">Failed to Load</h3>
                <p class="text-gray-400 mb-6">Something went wrong. Please try again.</p>
                <button onclick="closeMovieModal()" class="bg-netflix-red text-white px-6 py-2 rounded-md hover:bg-red-700 transition">
                    Close
                </button>
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
    const episodeRunTime = item.episode_run_time ? item.episode_run_time[0] : null;
    const seasons = item.number_of_seasons;
    const episodes = item.number_of_episodes;
    
    const trailer = item.videos?.results?.find(v => 
        v.type === 'Trailer' && v.site === 'YouTube'
    );
    
    const director = !isMovie ? null : item.credits?.crew?.find(person => 
        person.job === 'Director'
    );
    
    const creators = isMovie ? null : item.created_by?.slice(0, 2);
    
    const cast = item.credits?.cast?.slice(0, 6) || [];
    
    const genres = item.genres?.map(g => g.name) || [];
    
    const companies = item.production_companies?.slice(0, 3) || [];
    
    const isInWatchLater = window.isInWatchLater ? window.isInWatchLater(item.id) : false;
    
    const posterPath = item.poster_path 
        ? `${TMDB_IMAGE_BASE}/w500${item.poster_path}`
        : 'https://via.placeholder.com/500x750/333/666?text=No+Poster';
    
    const backdropPath = item.backdrop_path 
        ? `${TMDB_IMAGE_BASE}/original${item.backdrop_path}`
        : null;
    
    modalContent.innerHTML = `
        <div class="relative" data-movie-id="${item.id}" data-media-type="${item.media_type}">

            ${backdropPath ? `
                <div class="absolute inset-0 opacity-20 pointer-events-none">
                    <img src="${backdropPath}" alt="" class="w-full h-64 object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                </div>
            ` : ''}
            
            <button id="closeModal" class="absolute right-4 top-4 text-white text-3xl z-20 hover:text-netflix-red transition-colors">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="relative z-10">
                <!-- Title Section -->
                <div class="mb-6 pr-12">
                    <h2 class="text-3xl md:text-4xl font-bold mb-2">${title}</h2>
                    ${originalTitle !== title ? `<p class="text-gray-400 text-sm mb-2">${originalTitle}</p>` : ''}
                    ${item.tagline ? `<p class="text-netflix-red italic text-sm md:text-base">"${item.tagline}"</p>` : ''}
                </div>
                
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Left Column - Poster -->
                    <div class="md:col-span-1">
                        <div class="rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                            <img src="${posterPath}" 
                                 alt="${title}" 
                                 class="w-full h-auto"
                                 onerror="this.src='https://via.placeholder.com/500x750/333/666?text=No+Poster'">
                        </div>
                        
                        <div class="mt-6 bg-gray-800 rounded-xl p-5">
                            <div class="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div class="text-2xl font-bold text-yellow-400">
                                        ${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
                                    </div>
                                    <div class="text-xs text-gray-400">Rating</div>
                                </div>
                                <div>
                                    <div class="text-2xl font-bold">
                                        ${isMovie ? (runtime || 'N/A') : (seasons || 'N/A')}
                                    </div>
                                    <div class="text-xs text-gray-400">
                                        ${isMovie ? 'Minutes' : 'Seasons'}
                                    </div>
                                </div>
                                <div>
                                    <div class="text-2xl font-bold">${year}</div>
                                    <div class="text-xs text-gray-400">Year</div>
                                </div>
                                <div>
                                    <div class="text-2xl font-bold">
                                        ${item.popularity ? Math.round(item.popularity) : 'N/A'}
                                    </div>
                                    <div class="text-xs text-gray-400">Popularity</div>
                                </div>
                            </div>
                            
                            ${!isMovie && episodes ? `
                                <div class="mt-4 pt-4 border-t border-gray-700 text-center">
                                    <span class="text-sm text-gray-400">${episodes} Episodes</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="mt-4 bg-gray-800 rounded-xl p-5">
                            ${item.status ? `
                                <div class="mb-3">
                                    <p class="text-gray-400 text-xs uppercase tracking-wider">Status</p>
                                    <p class="font-medium">${item.status}</p>
                                </div>
                            ` : ''}
                            
                            ${companies.length > 0 ? `
                                <div>
                                    <p class="text-gray-400 text-xs uppercase tracking-wider">Production</p>
                                    <div class="flex flex-wrap gap-2 mt-2">
                                        ${companies.map(company => `
                                            <span class="bg-gray-700 px-2 py-1 rounded text-xs">
                                                ${company.name}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="md:col-span-2">
                        <!-- Genres -->
                        ${genres.length > 0 ? `
                            <div class="flex flex-wrap gap-2 mb-6">
                                ${genres.map(genre => `
                                    <span class="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-full text-xs md:text-sm border border-gray-700">
                                        ${genre}
                                    </span>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        <div class="mb-8">
                            <h3 class="text-xl font-bold mb-3 flex items-center">
                                <i class="fas fa-align-left text-netflix-red mr-2"></i>
                                Synopsis
                            </h3>
                            <div class="bg-gray-800 rounded-xl p-5">
                                <p class="text-gray-300 leading-relaxed text-sm md:text-base">
                                    ${item.overview || 'No synopsis available.'}
                                </p>
                            </div>
                        </div>
                        
                       ${cast.length > 0 ? `
    <div class="mb-8">
        <h3 class="text-xl font-bold mb-3 flex items-center">
            <i class="fas fa-users text-netflix-red mr-2"></i>
            Cast
        </h3>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            ${cast.map(actor => `
                <div class="text-center cursor-pointer cast-card"
                     onclick="openPersonModal(${actor.id})">
                    <div class="aspect-square w-full max-w-[100px] mx-auto rounded-full overflow-hidden bg-gray-700 border-2 border-transparent hover:border-netflix-red transition-all">
                        <img src="${actor.profile_path ? TMDB_IMAGE_BASE + '/w185' + actor.profile_path : 'https://via.placeholder.com/185x278/333/666?text=No+Image'}" 
                             alt="${actor.name}"
                             class="w-full h-full object-cover"
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/185x278/333/666?text=No+Image'">
                    </div>
                    <p class="text-xs font-medium mt-2 truncate">${actor.name}</p>
                    <p class="text-xs text-gray-400 truncate">${actor.character || ''}</p>
                </div>
            `).join('')}
        </div>
    </div>
` : ''}
                        
                        ${director || creators ? `
                            <div class="mb-8">
                                <h3 class="text-xl font-bold mb-3 flex items-center">
                                    <i class="fas fa-video text-netflix-red mr-2"></i>
                                    ${isMovie ? 'Director' : 'Creators'}
                                </h3>
                                <div class="flex flex-wrap gap-4">
                                    ${isMovie && director ? `
                                        <div class="flex items-center">
                                            <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-700 mr-3">
                                                <img src="${director.profile_path ? TMDB_IMAGE_BASE + '/w185' + director.profile_path : 'https://via.placeholder.com/185x278/333/666?text=No+Image'}" 
                                                     alt="${director.name}"
                                                     class="w-full h-full object-cover"
                                                     onerror="this.src='https://via.placeholder.com/185x278/333/666?text=No+Image'">
                                            </div>
                                            <div>
                                                <p class="font-medium">${director.name}</p>
                                                <p class="text-xs text-gray-400">Director</p>
                                            </div>
                                        </div>
                                    ` : ''}
                                    
                                    ${!isMovie && creators ? creators.map(creator => `
                                        <div class="flex items-center">
                                            <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-700 mr-3">
                                                <img src="${creator.profile_path ? TMDB_IMAGE_BASE + '/w185' + creator.profile_path : 'https://via.placeholder.com/185x278/333/666?text=No+Image'}" 
                                                     alt="${creator.name}"
                                                     class="w-full h-full object-cover"
                                                     onerror="this.src='https://via.placeholder.com/185x278/333/666?text=No+Image'">
                                            </div>
                                            <div>
                                                <p class="font-medium">${creator.name}</p>
                                                <p class="text-xs text-gray-400">Creator</p>
                                            </div>
                                        </div>
                                    `).join('') : ''}
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="flex flex-wrap gap-3">
                            <button class="stream-modal-btn bg-netflix-red text-white px-6 md:px-8 py-3 rounded-md font-bold hover:bg-red-700 transition flex items-center">
                                <i class="fas fa-play mr-2"></i> 
                                Stream Now
                            </button>
                            
                            <button class="watch-later-modal-btn ${isInWatchLater ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-800 hover:bg-gray-700'} text-white px-5 md:px-6 py-3 rounded-md font-bold transition flex items-center" ${isInWatchLater ? 'disabled' : ''}>
                                <i class="${isInWatchLater ? 'fas fa-check' : 'far fa-clock'} mr-2"></i>
                                ${isInWatchLater ? 'In Watch Later' : 'Watch Later'}
                            </button>
                            
                            ${trailer ? `
                                <button class="trailer-btn bg-gray-800 text-white px-5 md:px-6 py-3 rounded-md font-bold hover:bg-gray-700 transition flex items-center">
                                    <i class="fab fa-youtube mr-2 text-red-500"></i>
                                    Trailer
                                </button>
                            ` : ''}
                        </div>
                        
                        <div class="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
                            <p class="text-xs md:text-sm text-gray-300 flex items-start">
                                <i class="fas fa-info-circle text-netflix-red mt-0.5 mr-2 flex-shrink-0"></i>
                                <span>
                                    If the stream doesn't load, try again or click Stream Now once more.
                                    ${!isMovie ? ' For TV series, this will play the first episode.' : ''}
                                </span>
                            </p>
                        </div>
                        
                       
                        ${trailer ? `
                            <div id="trailerContainer" class="mt-6 hidden">
                                <div class="aspect-w-16 aspect-h-9">
                                    <iframe id="trailerPlayer" 
                                            src="https://www.youtube.com/embed/${trailer.key}?autoplay=0&rel=0" 
                                            frameborder="0" 
                                            allowfullscreen
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            class="w-full h-64 md:h-80 rounded-lg">
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
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMovieModal);
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeMovieModal();
        }
    });
    
    const streamBtn = modalContent.querySelector('.stream-modal-btn');
    if (streamBtn) {
        streamBtn.addEventListener('click', () => {
            closeMovieModal();
            
            setTimeout(() => {
                openStreamingPlayer(item, item.media_type);
            }, 100);
        });
    }
    
    const watchLaterBtn = modalContent.querySelector('.watch-later-modal-btn');
    if (watchLaterBtn) {
        watchLaterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (window.isInWatchLater && window.isInWatchLater(item.id)) {
                
                window.removeFromWatchLater(item.id);
                
                watchLaterBtn.innerHTML = '<i class="far fa-clock mr-2"></i> Watch Later';
                watchLaterBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                watchLaterBtn.classList.add('bg-gray-800', 'hover:bg-gray-700');
                watchLaterBtn.disabled = false;
            } else {
                
                const watchLaterItem = {
                    id: item.id,
                    title: item.title || item.name,
                    poster_path: item.poster_path,
                    media_type: item.media_type,
                    addedAt: new Date().toISOString()
                };
                
                window.addToWatchLater(watchLaterItem);
                
                watchLaterBtn.innerHTML = '<i class="fas fa-check mr-2"></i> In Watch Later';
                watchLaterBtn.classList.remove('bg-gray-800', 'hover:bg-gray-700');
                watchLaterBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                watchLaterBtn.disabled = false;
            }
        });
    }
    
    const trailerBtn = modalContent.querySelector('.trailer-btn');
    const trailerContainer = document.getElementById('trailerContainer');
    
    if (trailerBtn && trailerContainer) {
        trailerBtn.addEventListener('click', () => {
            const isHidden = trailerContainer.classList.contains('hidden');
            
            if (isHidden) {
                trailerContainer.classList.remove('hidden');
                trailerBtn.innerHTML = '<i class="fas fa-times mr-2"></i> Hide Trailer';
            } else {
                trailerContainer.classList.add('hidden');
                trailerBtn.innerHTML = '<i class="fab fa-youtube mr-2 text-red-500"></i> Trailer';
                
                const trailerPlayer = document.getElementById('trailerPlayer');
                if (trailerPlayer) {
                    const src = trailerPlayer.src;
                    trailerPlayer.src = src; 
                }
            }
        });
    }
    
    const castCards = modalContent.querySelectorAll('.cast-card');
    castCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            
        });
    });
}

function closeMovieModal() {
    const modal = document.getElementById('movieModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
        
        const trailerPlayer = document.getElementById('trailerPlayer');
        if (trailerPlayer) {
            trailerPlayer.src = '';
        }
    }
}

function formatRuntime(minutes) {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
        return `${mins}m`;
    } else if (mins === 0) {
        return `${hours}h`;
    } else {
        return `${hours}h ${mins}m`;
    }
}

window.openMovieModal = openMovieModal;
window.closeMovieModal = closeMovieModal;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeModal);
} else {
    initializeModal();
}
