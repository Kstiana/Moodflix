document.addEventListener('DOMContentLoaded', () => {
    initializeWatchLater();
});

function initializeWatchLater() {

    loadWatchLaterList();

    document.addEventListener('watchLaterUpdated', () => {
        loadWatchLaterList();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeWatchLaterSidebar();
        }
    });
}

function loadWatchLaterList() {
    const watchLaterList = document.getElementById('watchLaterList');
    if (!watchLaterList) return;
    
    const watchLater = JSON.parse(localStorage.getItem('watchLater')) || [];
    
    if (watchLater.length === 0) {
        watchLaterList.innerHTML = `
            <div class="text-center text-gray-400 py-8">
                <i class="far fa-clock text-5xl mb-4 opacity-50"></i>
                <p class="text-lg font-medium">Your watch later list is empty</p>
                <p class="text-sm mt-2">Add movies or TV shows from the streaming page</p>
                <button id="browseMoviesBtn" class="mt-6 bg-netflix-red text-white px-6 py-2 rounded-md hover:bg-red-700 transition">
                    Browse Movies
                </button>
            </div>
        `;
        
        const browseBtn = document.getElementById('browseMoviesBtn');
        if (browseBtn) {
            browseBtn.addEventListener('click', () => {
                closeWatchLaterSidebar();
                switchPage('movies');
            });
        }
        
        return;
    }
    
    let html = '';
    
    watchLater.forEach((item, index) => {
        const posterUrl = item.poster_path 
            ? `${TMDB_IMAGE_BASE}/w185${item.poster_path}`
            : 'https://via.placeholder.com/185x278?text=No+Poster';
        
        const addedDate = new Date(item.addedAt);
        const formattedDate = addedDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        html += `
            <div class="watch-later-item bg-gray-800 rounded-lg overflow-hidden mb-4 flex animate__animated animate__fadeIn" data-id="${item.id}" data-type="${item.media_type || 'movie'}">
                <!-- Poster -->
                <div class="w-20 h-28 flex-shrink-0 bg-gray-700 cursor-pointer watch-later-poster">
                    <img src="${posterUrl}" 
                         alt="${item.title}" 
                         class="w-full h-full object-cover"
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/185x278?text=No+Poster'">
                </div>
                
                <!-- Info -->
                <div class="flex-1 p-3 flex flex-col justify-between">
                    <div>
                        <h4 class="font-bold text-sm md:text-base line-clamp-2 cursor-pointer watch-later-title hover:text-netflix-red transition">
                            ${item.title}
                        </h4>
                        <p class="text-xs text-gray-400 mt-1">
                            <i class="far fa-calendar-alt mr-1"></i>
                            Added: ${formattedDate}
                        </p>
                        <span class="inline-block mt-2 text-xs bg-gray-700 px-2 py-1 rounded">
                            ${item.media_type === 'tv' ? 'TV Series' : 'Movie'}
                        </span>
                    </div>
                    
                    <div class="flex justify-between items-center mt-2">
                        <button class="watch-now-btn text-xs bg-netflix-red text-white px-3 py-1.5 rounded hover:bg-red-700 transition flex items-center">
                            <i class="fas fa-play mr-1"></i> Watch Now
                        </button>
                        <button class="remove-watchlater text-gray-400 hover:text-netflix-red transition p-1" title="Remove from Watch Later">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    if (watchLater.length > 0) {
        html += `
            <div class="mt-6 pt-4 border-t border-gray-700">
                <button id="clearAllWatchLater" class="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600 transition flex items-center justify-center">
                    <i class="fas fa-trash mr-2"></i> Clear All
                </button>
            </div>
        `;
    }
    
    watchLaterList.innerHTML = html;
    
    attachWatchLaterItemEvents();
}

function attachWatchLaterItemEvents() {
    const watchLaterList = document.getElementById('watchLaterList');
    if (!watchLaterList) return;
    
    watchLaterList.querySelectorAll('.watch-now-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = e.target.closest('.watch-later-item');
            if (!item) return;
            
            const movieId = item.dataset.id;
            const mediaType = item.dataset.type || 'movie';
            
            const watchLater = JSON.parse(localStorage.getItem('watchLater')) || [];
            const movie = watchLater.find(m => m.id == movieId);
            
            if (movie) {
                closeWatchLaterSidebar();
                
                const movieData = {
                    id: movie.id,
                    title: movie.title,
                    name: movie.title,
                    poster_path: movie.poster_path,
                    media_type: mediaType
                };
                openStreamingPlayer(movieData, mediaType);
            }
        });
    });
    
    watchLaterList.querySelectorAll('.remove-watchlater').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = e.target.closest('.watch-later-item');
            if (!item) return;
            
            const movieId = item.dataset.id;
            
            item.classList.add('animate__fadeOut');
            
            setTimeout(() => {
                removeFromWatchLater(parseInt(movieId));
            }, 300);
        });
    });
    
    watchLaterList.querySelectorAll('.watch-later-poster, .watch-later-title').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = e.target.closest('.watch-later-item');
            if (!item) return;
            
            const movieId = item.dataset.id;
            const mediaType = item.dataset.type || 'movie';
            
            closeWatchLaterSidebar();
            

            fetchMovieDetails(movieId, mediaType).then(movie => {
                if (movie) {
          
                    movie.media_type = mediaType;
                    openMovieModal(movieId, mediaType);
                }
            });
        });
    });
    
    const clearAllBtn = document.getElementById('clearAllWatchLater');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            
            if (confirm('Are you sure you want to remove all items from Watch Later?')) {
                clearAllWatchLater();
            }
        });
    }
}

function clearAllWatchLater() {
    state.watchLater = [];
    localStorage.setItem('watchLater', JSON.stringify([]));
    updateWatchLaterBadge();
    loadWatchLaterList();
    showToast('Watch Later list cleared', 'removed');
    
    document.dispatchEvent(new CustomEvent('watchLaterUpdated'));
}

function removeFromWatchLater(movieId) {
    if (!movieId) return;
    
    const index = state.watchLater.findIndex(m => m.id === movieId);
    
    if (index !== -1) {
        const removedMovie = state.watchLater[index];
        state.watchLater.splice(index, 1);
        localStorage.setItem('watchLater', JSON.stringify(state.watchLater));
        
        updateWatchLaterBadge();
        
        const toast = document.getElementById('watchLaterToast');
        if (toast) {
            const toastText = toast.querySelector('p:first-child');
            const toastIcon = toast.querySelector('i');
            
            toastText.textContent = `"${removedMovie.title}" removed from Watch Later`;
            toastIcon.className = 'fas fa-trash mr-3 text-xl';
            toast.classList.remove('bg-green-600');
            toast.classList.add('bg-red-600');
            
            toast.classList.remove('hidden', 'translate-x-full');
            toast.classList.add('translate-x-0');
            
            setTimeout(() => {
                toast.classList.remove('translate-x-0');
                toast.classList.add('translate-x-full');
                setTimeout(() => toast.classList.add('hidden'), 300);
            }, 3000);
        }
        
        document.dispatchEvent(new CustomEvent('watchLaterUpdated'));
    }
}

function isInWatchLater(movieId) {
    return state.watchLater.some(m => m.id === movieId);
}

function getWatchLaterCount() {
    return state.watchLater.length;
}

window.removeFromWatchLater = removeFromWatchLater;
window.clearAllWatchLater = clearAllWatchLater;
window.isInWatchLater = isInWatchLater;
window.getWatchLaterCount = getWatchLaterCount;
window.loadWatchLaterList = loadWatchLaterList;


function openWatchLaterSidebar() {
    const sidebar = document.getElementById('watchLaterSidebar');
    const overlay = document.getElementById('mobileOverlay');
    
    if (sidebar) {
        
        loadWatchLaterList();
        
        sidebar.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        if (overlay) {
            overlay.classList.add('active');
        }
    }
}

function closeWatchLaterSidebar() {
    const sidebar = document.getElementById('watchLaterSidebar');
    const overlay = document.getElementById('mobileOverlay');
    
    if (sidebar) {
        sidebar.classList.remove('open');
        document.body.style.overflow = 'auto';
        
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
}

if (typeof window.openWatchLaterSidebar === 'undefined') {
    window.openWatchLaterSidebar = openWatchLaterSidebar;
    window.closeWatchLaterSidebar = closeWatchLaterSidebar;
}


function addWatchLaterButtonToModal(movie, modalContent) {
    if (!movie || !modalContent) return;
    
    const watchLaterBtn = modalContent.querySelector('.watch-later-modal-btn');
    if (watchLaterBtn) {
      
        if (isInWatchLater(movie.id)) {
            watchLaterBtn.innerHTML = '<i class="fas fa-check mr-3"></i> In Watch Later';
            watchLaterBtn.classList.remove('bg-gray-800', 'hover:bg-gray-700');
            watchLaterBtn.classList.add('bg-green-600', 'hover:bg-green-700');
            watchLaterBtn.disabled = true;
        } else {
            watchLaterBtn.innerHTML = '<i class="far fa-clock mr-3"></i> Watch Later';
            watchLaterBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
            watchLaterBtn.classList.add('bg-gray-800', 'hover:bg-gray-700');
            watchLaterBtn.disabled = false;
            
            watchLaterBtn.addEventListener('click', () => {
                addToWatchLater(movie);
                
               
                watchLaterBtn.innerHTML = '<i class="fas fa-check mr-3"></i> In Watch Later';
                watchLaterBtn.classList.remove('bg-gray-800', 'hover:bg-gray-700');
                watchLaterBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                watchLaterBtn.disabled = true;
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
  
    document.addEventListener('watchLaterUpdated', () => {
  
        const modal = document.getElementById('movieModal');
        if (modal && !modal.classList.contains('hidden')) {
            const modalContent = document.getElementById('modalContent');
            const movieId = modalContent?.querySelector('[data-movie-id]')?.dataset.movieId;
            
            if (movieId) {

                fetchMovieDetails(movieId).then(movie => {
                    if (movie) {
                        const watchLaterBtn = modalContent.querySelector('.watch-later-modal-btn');
                        if (watchLaterBtn) {
                            if (isInWatchLater(movie.id)) {
                                watchLaterBtn.innerHTML = '<i class="fas fa-check mr-3"></i> In Watch Later';
                                watchLaterBtn.classList.remove('bg-gray-800', 'hover:bg-gray-700');
                                watchLaterBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                                watchLaterBtn.disabled = true;
                            }
                        }
                    }
                });
            }
        }
    });
});
