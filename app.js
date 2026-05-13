const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

const MOVIE_SOURCES = [
    { name: 'VidSrc.me', url: id => `https://vidsrc.me/embed/movie?tmdb=${id}` },
    { name: 'Embed.su', url: id => `https://embed.su/embed/movie/${id}` },
    { name: 'VidSrc.to', url: id => `https://vidsrc.to/embed/movie/${id}` }
];

const TV_SOURCES = {
    low: { name: 'MoviesAPI (Low Ads)', url: id => `https://moviesapi.club/tv/${id}` },
    full: { name: 'VidSrc.to (Full Control)', url: id => `https://vidsrc.to/embed/tv/${id}` }
};

const MOOD_GENRES = {
    happy:    { ids: [35, 10751], name: 'Comedy & Family', description: 'Light-hearted comedies and feel-good movies to lift your spirits', emoji: '😄' },
    sad:      { ids: [18, 10749], name: 'Drama & Romance', description: 'Emotional dramas and touching love stories', emoji: '😢' },
    angry:    { ids: [28, 53],   name: 'Action & Thriller', description: 'Intense action and thrilling adventures to channel your energy', emoji: '😤' },
    calm:     { ids: [16, 99],   name: 'Animation & Documentary', description: 'Peaceful animations and insightful documentaries', emoji: '😌' },
    excited:  { ids: [12, 878],  name: 'Adventure & Sci-Fi', description: 'Epic adventures and mind-bending sci-fi', emoji: '🎉' },
    romantic: { ids: [10749, 10402], name: 'Romance & Musical', description: 'Heartwarming love stories and musical delights', emoji: '❤️' }
};

let state = {
    currentMood: null,
    featuredMovie: null,
    watchLater: JSON.parse(localStorage.getItem('watchLater')) || [],
    currentStreamingMovie: null,
    currentMovieSourceIndex: 0,
    currentPage: 'home'
};

const elements = {
    heroTitle: document.getElementById('heroTitle'),
    heroDescription: document.getElementById('heroDescription'),
    heroBackground: document.getElementById('heroBackground'),
    heroYear: document.getElementById('heroYear'),
    heroRating: document.getElementById('heroRating'),
    heroGenres: document.getElementById('heroGenres'),
    movieRowsContainer: document.getElementById('movieRowsContainer'),
    loadingSkeletons: document.getElementById('loadingSkeletons'),
    selectedMoodDisplay: document.getElementById('selectedMoodDisplay'),
    currentMood: document.getElementById('currentMood'),
    moodDescription: document.getElementById('moodDescription'),
    clearMood: document.getElementById('clearMood'),
    navbar: document.getElementById('navbar'),
    searchBtn: document.getElementById('searchBtn'),
    searchBar: document.getElementById('searchBar'),
    globalSearchInput: document.getElementById('globalSearchInput'),
    moodContainer: document.getElementById('moodContainer'),
    streamingPlayer: document.getElementById('streamingPlayer'),
    streamIframe: document.getElementById('streamIframe'),
    streamingTitle: document.getElementById('streamingTitle'),
    closeStreaming: document.getElementById('closeStreaming'),
    playerLoading: document.getElementById('playerLoading'),
    heroPlayBtn: document.getElementById('heroPlayBtn'),
    heroInfoBtn: document.getElementById('heroInfoBtn'),
    streamingFullscreen: document.getElementById('streamingFullscreen'),
    hamburger: document.getElementById('hamburger'),
    mobileNav: document.getElementById('mobileNav'),
    mobileOverlay: document.getElementById('mobileOverlay'),
    mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
    navLinks: document.querySelectorAll('.nav-link'),
    pages: {
        home: document.getElementById('homePage'),
        movies: document.getElementById('moviesPage'),
        series: document.getElementById('seriesPage'),
        people: document.getElementById('peoplePage')
    },
    footer: document.getElementById('footer'),
    watchLaterCount: document.querySelectorAll('.watch-later-count'),
    mobileWatchLaterBtn: document.getElementById('mobileWatchLaterBtn'),
    watchLaterSidebar: document.getElementById('watchLaterSidebar'),
    closeWatchLater: document.getElementById('closeWatchLater'),
    watchLaterList: document.getElementById('watchLaterList'),
    recentlyViewedSection: document.getElementById('recentlyViewedSection'),
    recentlyViewedRow: document.getElementById('recentlyViewedRow'),
    clearRecentlyViewed: document.getElementById('clearRecentlyViewed')
};

async function fetchFromTMDB(endpoint) {
    try {
        const response = await fetch(`/api/tmdb?endpoint=${encodeURIComponent(endpoint)}`);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.error) return null;
        return data;
    } catch {
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    showLoadingSkeletons();
    await loadFeaturedMovie();
    await loadInitialRows();
    initializeMoodSelector();
    initializeEventListeners();
    hideLoadingSkeletons();
    initializeScrollEffect();
    updateWatchLaterBadge();
    renderRecentlyViewed();
}

function openStreamingPlayer(movie, type = 'movie') {
    if (!movie || !movie.id) return;
    state.currentStreamingMovie = movie;
    state.currentMovieSourceIndex = 0;
    elements.streamingTitle.textContent = `Now Playing: ${movie.title || movie.name}`;

    if (type === 'movie') {
        loadMovieSource(movie.id, 0);
        showPlayer();
        return;
    }

    const picker = document.createElement('div');
    picker.className = 'source-picker';
    picker.innerHTML = `
        <h3 class="text-base font-bold mb-3 flex items-center gap-2">
            <i class="fas fa-tv" style="color:var(--netflix-red)"></i>
            Choose Streaming Mode
        </h3>
        <div class="grid grid-cols-2 gap-3">
            <button id="lowAdsBtn" class="bg-green-700 hover:bg-green-600 text-white p-3 rounded-lg transition text-sm font-medium">
                <i class="fas fa-shield-alt block mb-1"></i>
                Low Ads
                <span class="block text-xs opacity-80 mt-1 font-normal">Auto S1E1</span>
            </button>
            <button id="fullControlBtn" class="bg-orange-700 hover:bg-orange-600 text-white p-3 rounded-lg transition text-sm font-medium">
                <i class="fas fa-sliders-h block mb-1"></i>
                Full Control
                <span class="block text-xs opacity-80 mt-1 font-normal">Pick episode</span>
            </button>
        </div>
        <button id="cancelSourcePicker" class="mt-3 w-full text-gray-400 hover:text-white text-xs py-1 transition">Cancel</button>
    `;
    document.body.appendChild(picker);

    const removePicker = () => picker.remove();

    document.getElementById('cancelSourcePicker').addEventListener('click', removePicker);

    document.getElementById('lowAdsBtn').addEventListener('click', () => {
        removePicker();
        elements.streamIframe.src = TV_SOURCES.low.url(movie.id);
        elements.playerLoading.querySelector('p').textContent = 'Loading low-ads stream...';
        showPlayer();
        const t = setTimeout(() => {
            if (elements.playerLoading.style.display !== 'none') {
                elements.streamIframe.src = TV_SOURCES.full.url(movie.id);
                elements.playerLoading.querySelector('p').textContent = 'Switching to backup...';
            }
        }, 22000);
        elements.streamIframe.onload = () => { clearTimeout(t); revealPlayer(); };
    });

    document.getElementById('fullControlBtn').addEventListener('click', () => {
        removePicker();
        elements.streamIframe.src = TV_SOURCES.full.url(movie.id);
        elements.playerLoading.querySelector('p').textContent = 'Loading full control stream...';
        showPlayer();
        elements.streamIframe.onload = () => revealPlayer();
    });
}

function loadMovieSource(movieId, index) {
    const src = MOVIE_SOURCES[index];
    if (!src) return;
    elements.playerLoading.querySelector('p').textContent = `Loading from ${src.name}...`;
    elements.streamIframe.style.display = 'none';
    elements.playerLoading.style.display = 'block';
    elements.streamIframe.src = src.url(movieId);

    const fallbackTimer = setTimeout(() => {
        const next = index + 1;
        if (next < MOVIE_SOURCES.length) {
            loadMovieSource(movieId, next);
        }
    }, 22000);

    elements.streamIframe.onload = () => {
        clearTimeout(fallbackTimer);
        revealPlayer();
    };
}

function revealPlayer() {
    elements.playerLoading.style.display = 'none';
    elements.streamIframe.style.display = 'block';
}

function showPlayer() {
    elements.playerLoading.style.display = 'block';
    elements.streamIframe.style.display = 'none';
    elements.streamingPlayer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeStreamingPlayer() {
    elements.streamingPlayer.style.display = 'none';
    elements.streamIframe.src = '';
    elements.streamIframe.onload = null;
    document.body.style.overflow = 'auto';
    state.currentStreamingMovie = null;
    state.currentMovieSourceIndex = 0;
}

async function loadFeaturedMovie() {
    const data = await fetchFromTMDB('/trending/movie/week');
    if (data && data.results && data.results.length > 0) {
        const pick = data.results[Math.floor(Math.random() * Math.min(data.results.length, 10))];
        state.featuredMovie = pick;
        updateHeroSection(pick);
    } else {
        state.featuredMovie = { id: 299534, title: 'Avengers: Endgame', overview: 'After the devastating events of Infinity War, the Avengers assemble once more.', backdrop_path: '/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg', vote_average: 8.3 };
        updateHeroSection(state.featuredMovie);
    }
}

function updateHeroSection(movie) {
    if (elements.heroTitle) elements.heroTitle.textContent = movie.title || movie.name;
    if (elements.heroDescription) elements.heroDescription.textContent = movie.overview || 'Discover the perfect movie for your current mood.';
    if (elements.heroBackground && movie.backdrop_path) {
        elements.heroBackground.style.backgroundImage = `url('${TMDB_IMAGE_BASE}/original${movie.backdrop_path}')`;
        elements.heroBackground.style.opacity = '0';
        requestAnimationFrame(() => {
            elements.heroBackground.style.transition = 'opacity 1s ease';
            elements.heroBackground.style.opacity = '1';
        });
    }
    if (elements.heroYear) {
        const year = (movie.release_date || movie.first_air_date || '').split('-')[0];
        elements.heroYear.textContent = year || '';
    }
    if (elements.heroRating && movie.vote_average) {
        elements.heroRating.textContent = `⭐ ${movie.vote_average.toFixed(1)}`;
    }
}

function initializeMoodSelector() {
    const moods = [
        { id: 'happy',    emoji: '😄', label: 'Happy',    color: '#ca8a04' },
        { id: 'sad',      emoji: '😢', label: 'Sad',      color: '#2563eb' },
        { id: 'angry',    emoji: '😤', label: 'Angry',    color: '#dc2626' },
        { id: 'calm',     emoji: '😌', label: 'Calm',     color: '#16a34a' },
        { id: 'excited',  emoji: '🎉', label: 'Excited',  color: '#9333ea' },
        { id: 'romantic', emoji: '❤️', label: 'Romantic', color: '#db2777' }
    ];
    if (!elements.moodContainer) return;
    elements.moodContainer.innerHTML = '';
    moods.forEach(mood => {
        const btn = document.createElement('button');
        btn.className = 'mood-btn rounded-xl text-white font-bold text-sm flex flex-col items-center justify-center gap-1 p-3';
        btn.style.cssText = `background:${mood.color};min-height:80px`;
        btn.dataset.mood = mood.id;
        btn.innerHTML = `<span style="font-size:1.8rem">${mood.emoji}</span><span>${mood.label}</span>`;
        btn.addEventListener('click', () => selectMood(mood.id));
        elements.moodContainer.appendChild(btn);
    });
}

async function selectMood(mood) {
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mood === mood);
    });
    state.currentMood = mood;
    if (elements.selectedMoodDisplay) elements.selectedMoodDisplay.classList.remove('hidden');
    if (elements.currentMood) elements.currentMood.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
    if (elements.moodDescription) elements.moodDescription.textContent = MOOD_GENRES[mood].description;
    await loadMoodMovies(mood);
}

async function loadMoodMovies(mood) {
    const rowId = `mood-${mood}`;
    const existing = document.getElementById(rowId);
    if (existing) existing.remove();
    const movies = await fetchMoviesByGenre(MOOD_GENRES[mood].ids[0], 12);
    if (movies.length > 0) {
        createMovieRow({ id: rowId, title: `Because You're ${mood.charAt(0).toUpperCase() + mood.slice(1)} ${MOOD_GENRES[mood].emoji}`, movies, isMoodRow: true }, true);
    }
}

async function loadInitialRows() {
    const rows = [
        { id: 'trending',  title: '🔥 Trending Now',  fn: fetchTrendingMovies },
        { id: 'top-rated', title: '⭐ Top Rated',      fn: fetchTopRatedMovies },
        { id: 'action',    title: '💥 Action Movies',  fn: () => fetchMoviesByGenre(28, 12) },
        { id: 'comedy',    title: '😂 Comedies',       fn: () => fetchMoviesByGenre(35, 12) },
        { id: 'scifi',     title: '🚀 Sci-Fi',         fn: () => fetchMoviesByGenre(878, 12) },
        { id: 'animation', title: '🎨 Animation',      fn: () => fetchMoviesByGenre(16, 12) }
    ];
    for (const row of rows) {
        const movies = await row.fn();
        if (movies.length > 0) {
            createMovieRow({ id: row.id, title: row.title, movies });
        }
    }
}

function createMovieRow(config, insertAtTop = false) {
    const { id, title, movies, isMoodRow = false } = config;
    if (!movies || movies.length === 0) return;

    const row = document.createElement('div');
    row.id = id;
    row.className = 'movie-row mb-10';

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-4';
    header.innerHTML = `<h3 class="text-lg md:text-xl font-bold">${title}</h3>`;

    const wrapper = document.createElement('div');
    wrapper.className = 'flex gap-3 overflow-x-auto pb-3 scrollbar-hide';

    movies.forEach(movie => wrapper.appendChild(createMovieCard(movie)));

    row.appendChild(header);
    row.appendChild(wrapper);

    const container = elements.movieRowsContainer;
    if (insertAtTop && container.firstChild) {
        container.insertBefore(row, container.firstChild);
    } else {
        container.appendChild(row);
    }
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card flex-shrink-0 rounded-lg overflow-hidden cursor-pointer relative group';
    card.style.width = 'clamp(110px, 32vw, 176px)';
    card.dataset.movieId = movie.id;

    const posterPath = movie.poster_path || movie.backdrop_path;
    const posterUrl = posterPath ? `${TMDB_IMAGE_BASE}/w342${posterPath}` : 'https://placehold.co/342x513/1a1a1a/666?text=No+Poster';

    card.innerHTML = `
        <div class="bg-gray-800 rounded-lg overflow-hidden" style="aspect-ratio:2/3">
            <img src="${posterUrl}"
                 alt="${movie.title || movie.name}"
                 class="w-full h-full object-cover"
                 loading="lazy"
                 onerror="this.src='https://placehold.co/342x513/1a1a1a/666?text=No+Poster'">
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 flex flex-col justify-end rounded-lg">
            <h4 class="font-bold text-white text-xs mb-1 line-clamp-2">${movie.title || movie.name}</h4>
            <div class="flex items-center justify-between text-xs text-gray-300">
                <span class="text-yellow-400">⭐ ${movie.vote_average?.toFixed(1) || 'N/A'}</span>
                <span>${(movie.release_date || movie.first_air_date || '').split('-')[0] || ''}</span>
            </div>
        </div>
    `;

    card.addEventListener('click', () => {
        openMovieModal(movie.id, movie.media_type === 'tv' ? 'tv' : 'movie');
    });
    return card;
}

async function fetchTrendingMovies() {
    const data = await fetchFromTMDB('/trending/movie/week');
    return data?.results || [];
}

async function fetchTrendingTV() {
    const data = await fetchFromTMDB('/trending/tv/week');
    return data?.results || [];
}

async function fetchTopRatedMovies() {
    const data = await fetchFromTMDB('/movie/top_rated?page=1');
    return data?.results || [];
}

async function fetchTopRatedTV() {
    const data = await fetchFromTMDB('/tv/top_rated?page=1');
    return data?.results || [];
}

async function fetchMoviesByGenre(genreId, count = 12, page = 1) {
    const data = await fetchFromTMDB(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`);
    return (data?.results || []).slice(0, count);
}

async function fetchTVByGenre(genreId, count = 12, page = 1) {
    const data = await fetchFromTMDB(`/discover/tv?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`);
    return (data?.results || []).slice(0, count);
}

async function fetchMovieDetails(movieId, type = 'movie') {
    const endpoint = type === 'tv' ? 'tv' : 'movie';
    return await fetchFromTMDB(`/${endpoint}/${movieId}?append_to_response=videos,credits`);
}

async function searchMovies(query) {
    const data = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&page=1`);
    return data?.results || [];
}

async function searchTV(query) {
    const data = await fetchFromTMDB(`/search/tv?query=${encodeURIComponent(query)}&page=1`);
    return data?.results || [];
}

function showLoadingSkeletons() {
    if (!elements.loadingSkeletons) return;
    let html = '';
    for (let i = 0; i < 4; i++) {
        html += `
            <div class="mb-10">
                <div class="h-5 w-40 bg-gray-800 rounded animate-pulse mb-4"></div>
                <div class="flex gap-3 overflow-x-hidden">
                    ${Array(6).fill().map(() => `<div class="flex-shrink-0 bg-gray-800 rounded animate-pulse" style="width:clamp(110px,32vw,176px);aspect-ratio:2/3"></div>`).join('')}
                </div>
            </div>`;
    }
    elements.loadingSkeletons.innerHTML = html;
}

function hideLoadingSkeletons() {
    if (elements.loadingSkeletons) elements.loadingSkeletons.innerHTML = '';
}

function switchPage(pageId) {
    Object.values(elements.pages).forEach(page => {
        if (page) { page.classList.remove('active'); page.style.display = 'none'; }
    });
    if (elements.pages[pageId]) {
        elements.pages[pageId].style.display = 'block';
        elements.pages[pageId].classList.add('active');
    }
    if (elements.footer) {
        elements.footer.style.display = pageId === 'home' ? 'block' : 'none';
    }
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
    });
    state.currentPage = pageId;
    closeMobileNav();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openWatchLaterSidebar() {
    if (elements.watchLaterSidebar) {
        if (typeof loadWatchLaterList === 'function') loadWatchLaterList();
        elements.watchLaterSidebar.classList.add('open');
        if (elements.mobileOverlay) elements.mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeWatchLaterSidebar() {
    if (elements.watchLaterSidebar) elements.watchLaterSidebar.classList.remove('open');
    if (elements.mobileOverlay) elements.mobileOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function toggleMobileNav() {
    if (elements.mobileNav) {
        elements.mobileNav.classList.toggle('open');
        elements.mobileOverlay.classList.toggle('active');
        elements.hamburger?.classList.toggle('active');
    }
}

function closeMobileNav() {
    if (elements.mobileNav) {
        elements.mobileNav.classList.remove('open');
        elements.mobileOverlay.classList.remove('active');
        elements.hamburger?.classList.remove('active');
    }
}

function addToWatchLater(movie) {
    if (!movie) return;
    const item = {
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path || movie.backdrop_path,
        media_type: movie.media_type || 'movie',
        addedAt: new Date().toISOString()
    };
    if (!state.watchLater.some(m => m.id === movie.id)) {
        state.watchLater.push(item);
        localStorage.setItem('watchLater', JSON.stringify(state.watchLater));
        showToast('Added to Watch Later!', 'added');
        updateWatchLaterBadge();
        document.dispatchEvent(new CustomEvent('watchLaterUpdated'));
    } else {
        showToast('Already in Watch Later!', 'info');
    }
}

function removeFromWatchLater(movieId) {
    const idx = state.watchLater.findIndex(m => m.id === movieId);
    if (idx !== -1) {
        const removed = state.watchLater[idx];
        state.watchLater.splice(idx, 1);
        localStorage.setItem('watchLater', JSON.stringify(state.watchLater));
        showToast(`"${removed.title}" removed`, 'removed');
        updateWatchLaterBadge();
        document.dispatchEvent(new CustomEvent('watchLaterUpdated'));
    }
}

function isInWatchLater(movieId) {
    return state.watchLater.some(m => m.id === movieId);
}

function getWatchLaterCount() {
    return state.watchLater.length;
}

function showToast(message, type = 'added') {
    const toast = document.getElementById('watchLaterToast');
    if (!toast) return;
    const msgEl = document.getElementById('toastMessage');
    const icon = toast.querySelector('i');
    if (msgEl) msgEl.textContent = message;
    toast.className = toast.className.replace(/bg-\w+-\d+/g, '');
    if (type === 'removed') {
        toast.classList.add('bg-red-600');
        if (icon) icon.className = 'fas fa-trash text-xl flex-shrink-0';
    } else {
        toast.classList.add('bg-green-600');
        if (icon) icon.className = 'fas fa-check-circle text-xl flex-shrink-0';
    }
    toast.classList.remove('hidden', 'translate-x-full');
    toast.classList.add('translate-x-0');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove('translate-x-0');
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
}

function updateWatchLaterBadge() {
    const count = state.watchLater.length;
    elements.watchLaterCount.forEach(el => { if (el) el.textContent = count; });
}

function addToRecentlyViewed(movie, mediaType) {
    if (!movie) return;
    const recent = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    const filtered = recent.filter(m => m.id !== movie.id);
    filtered.unshift({ id: movie.id, title: movie.title || movie.name, poster_path: movie.poster_path, media_type: mediaType || movie.media_type || 'movie' });
    localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 12)));
    renderRecentlyViewed();
}

function renderRecentlyViewed() {
    const recent = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    if (!elements.recentlyViewedSection || !elements.recentlyViewedRow) return;
    if (recent.length === 0) {
        elements.recentlyViewedSection.classList.add('hidden');
        return;
    }
    elements.recentlyViewedSection.classList.remove('hidden');
    elements.recentlyViewedRow.innerHTML = '';
    recent.forEach(movie => {
        const el = document.createElement('div');
        el.className = 'flex-shrink-0 cursor-pointer rounded-lg overflow-hidden group relative';
        el.style.width = 'clamp(90px, 25vw, 140px)';
        const poster = movie.poster_path ? `${TMDB_IMAGE_BASE}/w185${movie.poster_path}` : 'https://placehold.co/185x278/1a1a1a/666?text=No+Poster';
        el.innerHTML = `
            <div style="aspect-ratio:2/3" class="bg-gray-800 overflow-hidden rounded-lg">
                <img src="${poster}" alt="${movie.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" onerror="this.src='https://placehold.co/185x278/1a1a1a/666?text=No+Poster'">
            </div>
            <p class="text-xs text-gray-300 mt-1 truncate">${movie.title}</p>
        `;
        el.addEventListener('click', () => openMovieModal(movie.id, movie.media_type));
        elements.recentlyViewedRow.appendChild(el);
    });
}

function initializeEventListeners() {
    if (elements.clearMood) {
        elements.clearMood.addEventListener('click', () => {
            state.currentMood = null;
            elements.selectedMoodDisplay.classList.add('hidden');
            document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector('[id^="mood-"]')?.remove();
        });
    }

    if (elements.searchBtn) {
        elements.searchBtn.addEventListener('click', () => elements.searchBar.classList.toggle('hidden'));
    }

    document.addEventListener('click', e => {
        if (!e.target.closest('#searchBar') && !e.target.closest('#searchBtn')) {
            elements.searchBar?.classList.add('hidden');
        }
    });

    if (elements.heroPlayBtn) {
        elements.heroPlayBtn.addEventListener('click', () => {
            if (state.featuredMovie) openStreamingPlayer(state.featuredMovie, 'movie');
        });
    }

    if (elements.heroInfoBtn) {
        elements.heroInfoBtn.addEventListener('click', () => {
            if (state.featuredMovie) openMovieModal(state.featuredMovie.id, 'movie');
        });
    }

    if (elements.closeStreaming) {
        elements.closeStreaming.addEventListener('click', closeStreamingPlayer);
    }

    if (elements.streamingFullscreen) {
        elements.streamingFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                elements.streamingPlayer.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen();
            }
        });
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (elements.streamingPlayer.style.display === 'flex') closeStreamingPlayer();
            closeWatchLaterSidebar();
            closeMobileNav();
        }
    });

    elements.navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page === 'watchlater') openWatchLaterSidebar();
            else switchPage(page);
        });
    });

    elements.mobileNavLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const page = link.dataset.page;
            closeMobileNav();
            if (page === 'watchlater') openWatchLaterSidebar();
            else switchPage(page);
        });
    });

    if (elements.hamburger) elements.hamburger.addEventListener('click', toggleMobileNav);

    if (elements.mobileOverlay) {
        elements.mobileOverlay.addEventListener('click', () => {
            closeMobileNav();
            closeWatchLaterSidebar();
        });
    }

    if (elements.closeWatchLater) elements.closeWatchLater.addEventListener('click', closeWatchLaterSidebar);

    if (elements.mobileWatchLaterBtn) {
        elements.mobileWatchLaterBtn.addEventListener('click', e => {
            e.preventDefault();
            openWatchLaterSidebar();
        });
    }

    if (elements.globalSearchInput) {
        let searchTimeout;
        elements.globalSearchInput.addEventListener('input', e => {
            clearTimeout(searchTimeout);
            const val = e.target.value.trim();
            if (val.length > 2) {
                searchTimeout = setTimeout(() => performGlobalSearch(val), 500);
            }
        });
    }

    if (elements.clearRecentlyViewed) {
        elements.clearRecentlyViewed.addEventListener('click', () => {
            localStorage.removeItem('recentlyViewed');
            renderRecentlyViewed();
        });
    }
}

function initializeScrollEffect() {
    window.addEventListener('scroll', () => {
        if (!elements.navbar) return;
        if (window.scrollY > 80) {
            elements.navbar.style.background = 'rgba(0,0,0,0.95)';
            elements.navbar.style.backdropFilter = 'blur(8px)';
        } else {
            elements.navbar.style.background = 'transparent';
            elements.navbar.style.backdropFilter = 'none';
        }
    }, { passive: true });
}

async function performGlobalSearch(query) {
    if (state.currentPage !== 'home') return;
    const [movies, tv] = await Promise.all([searchMovies(query), searchTV(query)]);
    const combined = [
        ...movies.map(m => ({ ...m, media_type: 'movie' })),
        ...tv.map(t => ({ ...t, media_type: 'tv' }))
    ].slice(0, 12);

    const existingRow = document.getElementById('global-search-results');
    if (existingRow) existingRow.remove();

    if (combined.length > 0) {
        createMovieRow({ id: 'global-search-results', title: `Results for "${query}"`, movies: combined }, true);
        document.getElementById('global-search-results')?.scrollIntoView({ behavior: 'smooth' });
    }
}

window.openStreamingPlayer = openStreamingPlayer;
window.addToWatchLater = addToWatchLater;
window.removeFromWatchLater = removeFromWatchLater;
window.isInWatchLater = isInWatchLater;
window.getWatchLaterCount = getWatchLaterCount;
window.addToRecentlyViewed = addToRecentlyViewed;
window.switchPage = switchPage;
window.openWatchLaterSidebar = openWatchLaterSidebar;
window.closeWatchLaterSidebar = closeWatchLaterSidebar;
window.fetchFromTMDB = fetchFromTMDB;
window.fetchMovieDetails = fetchMovieDetails;
window.fetchMoviesByGenre = fetchMoviesByGenre;
window.fetchTVByGenre = fetchTVByGenre;
window.fetchTrendingMovies = fetchTrendingMovies;
window.fetchTrendingTV = fetchTrendingTV;
window.fetchTopRatedMovies = fetchTopRatedMovies;
window.fetchTopRatedTV = fetchTopRatedTV;
window.searchMovies = searchMovies;
window.searchTV = searchTV;
window.showToast = showToast;
window.state = state;
window.TMDB_IMAGE_BASE = TMDB_IMAGE_BASE;
