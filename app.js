const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

async function fetchFromTMDB(endpoint) {
    try {
        const response = await fetch(`/api/tmdb?endpoint=${encodeURIComponent(endpoint)}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            return null;
        }
        
        const data = await response.json();
        
        if (data.error) {
            console.error('TMDB API Error:', data.error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('Network error:', error);
        return null;
    }
}

const STREAMING_SOURCES = [
    {
        name: "VidSrc",    
        movie: 'https://vidsrc.xyz/embed/movie/',
        tv: null,
        type: 'iframe'
    },
    {
        name: "MoviesAPI",   
        movie: 'https://moviesapi.club/movie/',
        tv: 'https://moviesapi.club/tv/',
        type: 'iframe'
    },
    {
        name: "VidSrcTo",   
        movie: 'https://vidsrc.to/embed/movie/',
        tv: 'https://vidsrc.to/embed/tv/',
        type: 'iframe'
    }
];

const MOOD_GENRES = {
    'happy': { ids: [35, 10751], name: 'Comedy, Family', description: 'Light-hearted comedies and feel-good movies to lift your spirits', emoji: '😄' },
    'sad': { ids: [18, 10749], name: 'Drama, Romance', description: 'Emotional dramas and touching love stories', emoji: '😢' },
    'angry': { ids: [28, 53], name: 'Action, Thriller', description: 'Intense action and thrilling adventures to channel your energy', emoji: '😤' },
    'calm': { ids: [16, 99], name: 'Animation, Documentary', description: 'Peaceful animations and insightful documentaries', emoji: '😌' },
    'excited': { ids: [12, 878], name: 'Adventure, Sci-Fi', description: 'Epic adventures and mind-bending sci-fi', emoji: '🎉' },
    'romantic': { ids: [10749, 10402], name: 'Romance, Musical', description: 'Heartwarming love stories and musical delights', emoji: '❤️' }
};

let state = {
    currentMood: null,
    featuredMovie: null,
    watchLater: JSON.parse(localStorage.getItem('watchLater')) || [],
    soundEnabled: true,
    currentStreamingMovie: null,
    currentSourceIndex: 0,
    currentPage: 'home'
};

const elements = {
    heroTitle: document.getElementById('heroTitle'),
    heroDescription: document.getElementById('heroDescription'),
    heroBackground: document.getElementById('heroBackground'),
    movieRowsContainer: document.getElementById('movieRowsContainer'),
    loadingSkeletons: document.getElementById('loadingSkeletons'),
    selectedMoodDisplay: document.getElementById('selectedMoodDisplay'),
    currentMood: document.getElementById('currentMood'),
    moodDescription: document.getElementById('moodDescription'),
    clearMood: document.getElementById('clearMood'),
    navbar: document.getElementById('navbar'),
    soundToggle: document.getElementById('soundToggle'),
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
    watchLaterList: document.getElementById('watchLaterList')
};

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
}

function openStreamingPlayer(movie, type = 'movie') {
    if (!movie || !movie.id) return;
    
    state.currentStreamingMovie = movie;
    elements.streamingTitle.textContent = `Now Playing: ${movie.title || movie.name}`;
    
    if (type === 'movie') {
        // MOVIES: Try VidSrc.xyz first (minimal ads)
        const url = `https://vidsrc.xyz/embed/movie/${movie.id}`;
        elements.streamIframe.src = url;
        elements.playerLoading.querySelector('p').textContent = `Loading from Minimal Ads src...`;
        showPlayer();
        
        const movieFallback = setTimeout(() => {
            if (elements.playerLoading.style.display !== 'none' && 
                elements.streamIframe.src.includes('vidsrc.xyz')) {
                console.log('⏰ VidSrc.xyz timeout, using VidSrc.to');
                elements.streamIframe.src = `https://vidsrc.to/embed/movie/${movie.id}`;
                elements.playerLoading.querySelector('p').textContent = `Loading from backup...`;
            }
        }, 8000);
        
        elements.streamIframe.onload = () => {
            clearTimeout(movieFallback);
            elements.playerLoading.style.display = 'none';
            elements.streamIframe.style.display = 'block';
        };
        
        elements.streamIframe.onerror = null;
        
        return;
    }
    
    const modalContent = document.getElementById('modalContent');
 
    const sourceSelector = document.createElement('div');
    sourceSelector.className = 'fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 rounded-lg shadow-xl p-4 z-[10000] border-2 border-netflix-red';
    sourceSelector.style.maxWidth = '90%';
    sourceSelector.style.width = '400px';
    sourceSelector.innerHTML = `
        <h3 class="text-lg font-bold mb-3 flex items-center">
            <i class="fas fa-tv mr-2 text-netflix-red"></i>
            Choose Your Experience
        </h3>
        <div class="grid grid-cols-2 gap-3">
            <button id="lowAdsBtn" class="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition">
                <i class="fas fa-shield-alt mr-2"></i>
                Low Ads Mode
                <span class="block text-xs opacity-90 mt-1">No episode picker • Auto-plays S1E1</span>
            </button>
            <button id="fullControlBtn" class="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg transition">
                <i class="fas fa-sliders-h mr-2"></i>
                Full Control Mode
                <span class="block text-xs opacity-90 mt-1">More ads • Pick any season/episode</span>
            </button>
        </div>
        <p class="text-xs text-gray-400 mt-3 text-center">
            ⚡ Both work! Choose based on your ad tolerance 
        </p>
    `;
    
    document.body.appendChild(sourceSelector);
    
    document.getElementById('lowAdsBtn').addEventListener('click', () => {
        const url = `https://moviesapi.club/tv/${movie.id}`;
        elements.streamIframe.src = url;
        elements.playerLoading.querySelector('p').textContent = `Loading from Low Ads, S1E1...`;
        sourceSelector.remove();
        showPlayer();
        
        const tvFallback = setTimeout(() => {
            if (elements.playerLoading.style.display !== 'none') {
                
                elements.streamIframe.src = `https://vidsrc.to/embed/tv/${movie.id}`;
                elements.playerLoading.querySelector('p').textContent = `Loading from other src contain more ads (Full Episode Control)...`;
            }
        }, 8000);
        
        elements.streamIframe.onload = () => {
            clearTimeout(tvFallback);
            elements.playerLoading.style.display = 'none';
            elements.streamIframe.style.display = 'block';
        };
        
        elements.streamIframe.onerror = null;
    });
    
    document.getElementById('fullControlBtn').addEventListener('click', () => {
        const url = `https://vidsrc.to/embed/tv/${movie.id}`;
        elements.streamIframe.src = url;
        elements.playerLoading.querySelector('p').textContent = `Loading from other src contain more ads (Full Episode Control)...`;
        sourceSelector.remove();
        showPlayer();
        
        elements.streamIframe.onload = () => {
            elements.playerLoading.style.display = 'none';
            elements.streamIframe.style.display = 'block';
        };
        
        elements.streamIframe.onerror = null;
    });
}

function showPlayer() {
    elements.playerLoading.style.display = 'block';
    elements.streamIframe.style.display = 'none';
    elements.streamingPlayer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function isFrameLoaded() {
    try {
        return elements.streamIframe.contentWindow && 
               elements.streamIframe.contentWindow.document && 
               elements.streamIframe.contentWindow.document.body &&
               elements.streamIframe.contentWindow.document.body.innerHTML.length > 100;
    } catch (e) {
       
        return true;
    }
}

function tryNextSource(movie, type = 'movie') {
    state.currentSourceIndex = (state.currentSourceIndex + 1) % STREAMING_SOURCES.length;
    console.log(`🔄 Switching to source: ${STREAMING_SOURCES[state.currentSourceIndex].name}`);
    openStreamingPlayer(movie, type);
}

function closeStreamingPlayer() {
    elements.streamingPlayer.style.display = 'none';
    elements.streamIframe.src = '';
    document.body.style.overflow = 'auto';
    state.currentStreamingMovie = null;

    state.currentSourceIndex = 0;
}

async function loadFeaturedMovie() {
    try {
        const data = await fetchFromTMDB('/trending/movie/week');
        
        const randomIndex = Math.floor(Math.random() * data.results.length);
        state.featuredMovie = data.results[randomIndex];
        updateHeroSection(state.featuredMovie);
    } catch (error) {
        console.error('Error loading featured movie:', error);
        
        state.featuredMovie = {
            id: 299534, 
            title: 'Avengers: Endgame',
            name: 'Avengers: Endgame',
            overview: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos\' actions and restore balance to the universe.',
            backdrop_path: '/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
            vote_average: 8.3
        };
        updateHeroSection(state.featuredMovie);
    }
}

function updateHeroSection(movie) {
    elements.heroTitle.textContent = movie.title || movie.name;
    elements.heroDescription.textContent = movie.overview || 'Discover the perfect movie for your mood';
    
    if (movie.backdrop_path) {
        elements.heroBackground.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%), url('${TMDB_IMAGE_BASE}/original${movie.backdrop_path}')`;
        elements.heroBackground.style.opacity = '0';
        setTimeout(() => {
            elements.heroBackground.style.transition = 'opacity 1s ease-in-out';
            elements.heroBackground.style.opacity = '1';
        }, 100);
    }
    
    state.currentStreamingMovie = movie;
}

function initializeMoodSelector() {
    const moods = [
        { id: 'happy', emoji: '😄', label: 'Happy', color: 'bg-yellow-500' },
        { id: 'sad', emoji: '😢', label: 'Sad', color: 'bg-blue-500' },
        { id: 'angry', emoji: '😤', label: 'Angry', color: 'bg-red-600' },
        { id: 'calm', emoji: '😌', label: 'Calm', color: 'bg-green-500' },
        { id: 'excited', emoji: '🎉', label: 'Excited', color: 'bg-purple-500' },
        { id: 'romantic', emoji: '❤️', label: 'Romantic', color: 'bg-pink-500' }
    ];
    
    elements.moodContainer.innerHTML = '';
    
    moods.forEach(mood => {
        const button = document.createElement('button');
        button.className = `mood-btn ${mood.color} p-4 md:p-6 rounded-xl text-white font-bold text-base md:text-xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center`;
        button.innerHTML = `
            <span class="text-3xl md:text-4xl mb-2">${mood.emoji}</span>
            <span>${mood.label}</span>
        `;
        button.dataset.mood = mood.id;
        button.addEventListener('click', () => selectMood(mood.id));
        elements.moodContainer.appendChild(button);
    });
}

async function selectMood(mood) {
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mood === mood) {
            btn.classList.add('active');
        }
    });
    
    state.currentMood = mood;
    elements.selectedMoodDisplay.classList.remove('hidden');
    elements.currentMood.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
    elements.moodDescription.textContent = MOOD_GENRES[mood].description;
    
    await loadMoodMovies(mood);
}

async function loadMoodMovies(mood) {
    const genreIds = MOOD_GENRES[mood].ids;
    const rowId = `mood-${mood}`;
    
    const existingRow = document.getElementById(rowId);
    if (existingRow) existingRow.remove();
    
    try {
        const movies = await fetchMoviesByGenre(genreIds[0], 10);
        createMovieRow({
            id: rowId,
            title: `Because You're ${mood.charAt(0).toUpperCase() + mood.slice(1)} ${MOOD_GENRES[mood].emoji || ''}`,
            movies: movies,
            isMoodRow: true
        }, true); // Insert at top
    } catch (error) {
        console.error(`Error loading ${mood} movies:`, error);
    }
}

async function loadInitialRows() {
    const rows = [
        { id: 'trending', title: 'Trending Now', fetchFunction: fetchTrendingMovies },
        { id: 'top-rated', title: 'Top Rated', fetchFunction: fetchTopRatedMovies },
        { id: 'action', title: 'Action Movies', fetchFunction: () => fetchMoviesByGenre(28) },
        { id: 'comedy', title: 'Comedies', fetchFunction: () => fetchMoviesByGenre(35) }
    ];
    
    for (const row of rows) {
        try {
            const movies = await row.fetchFunction();
            createMovieRow({
                id: row.id,
                title: row.title,
                movies: movies.slice(0, 10)
            });
        } catch (error) {
            console.error(`Error loading ${row.title}:`, error);
        }
    }
}

function createMovieRow(config, insertAtTop = false) {
    const { id, title, movies, isMoodRow = false } = config;
    
    if (!movies || movies.length === 0) return;
    
    const row = document.createElement('div');
    row.id = id;
    row.className = 'movie-row mb-12';
    
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-4';
    header.innerHTML = `
        <h3 class="text-xl md:text-2xl font-bold">${title}</h3>
        ${isMoodRow ? '' : '<a href="#" class="explore-link text-gray-400 text-sm pointer-events-none opacity-70 cursor-default">Explore All <i class="fas fa-chevron-right ml-1"></i></a>'}
    `;
    
    const moviesContainer = document.createElement('div');
    moviesContainer.className = 'relative';
    
    const moviesWrapper = document.createElement('div');
    moviesWrapper.className = 'flex space-x-4 overflow-x-auto pb-4 scrollbar-hide';
    moviesWrapper.style.scrollBehavior = 'smooth';
    
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesWrapper.appendChild(movieCard);
    });
    
    moviesContainer.appendChild(moviesWrapper);
    row.appendChild(header);
    row.appendChild(moviesContainer);
    
    if (insertAtTop && elements.movieRowsContainer.firstChild) {
        elements.movieRowsContainer.insertBefore(row, elements.movieRowsContainer.firstChild);
    } else {
        elements.movieRowsContainer.appendChild(row);
    }
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card flex-shrink-0 w-36 sm:w-44 md:w-48 rounded-lg overflow-hidden cursor-pointer relative group';
    card.dataset.movieId = movie.id;
    card.dataset.movieTitle = movie.title || movie.name;
    
    const posterPath = movie.poster_path || movie.backdrop_path;
    const posterUrl = posterPath 
        ? `${TMDB_IMAGE_BASE}/w342${posterPath}`
        : 'https://via.placeholder.com/342x513?text=No+Poster';
    
    const poster = document.createElement('div');
    poster.className = 'h-56 sm:h-64 md:h-72 bg-gray-800 rounded-lg overflow-hidden bg-cover bg-center';
    poster.style.backgroundImage = `url('${posterUrl}')`;
    
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 md:p-4 flex flex-col justify-end';
    
    overlay.innerHTML = `
        <h4 class="font-bold text-white text-xs md:text-sm mb-1 truncate">${movie.title || movie.name}</h4>
        <div class="flex items-center justify-between text-xs text-gray-300">
            <div class="flex items-center">
                <i class="fas fa-star text-yellow-400 mr-1"></i>
                <span>${movie.vote_average?.toFixed(1) || 'N/A'}</span>
            </div>
            <span>${movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0] || 'N/A'}</span>
        </div>
        <p class="text-xs text-gray-300 mt-2 line-clamp-2 hidden md:block">${movie.overview || 'No description available'}</p>
        <div class="flex space-x-2 mt-2 md:mt-3">
            <button class="watch-stream-btn text-xs bg-netflix-red text-white px-2 md:px-3 py-1 rounded hover:bg-red-700">
                <i class="fas fa-play mr-1"></i> Stream
            </button>
            <button class="info-btn text-xs bg-gray-800 text-white px-2 md:px-3 py-1 rounded hover:bg-gray-700">
                <i class="fas fa-info-circle mr-1"></i> Info
            </button>
        </div>
    `;
    
    card.appendChild(poster);
    card.appendChild(overlay);
    
    card.querySelector('.watch-stream-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        state.currentStreamingMovie = movie;
        openStreamingPlayer(movie, movie.media_type === 'tv' ? 'tv' : 'movie');
    });
    
    card.querySelector('.info-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        openMovieModal(movie.id, movie.media_type === 'tv' ? 'tv' : 'movie');
    });
    
    return card;
}

async function fetchTrendingMovies() {
    try {
        const data = await fetchFromTMDB('/trending/movie/week');
        
        return data.results;
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
}

async function fetchTrendingTV() {
    try {
        const data = await fetchFromTMDB('/trending/tv/week');
        
        return data.results;
    } catch (error) {
        console.error('Error fetching trending TV:', error);
        return [];
    }
}

async function fetchTopRatedMovies() {
    try {
        const data = await fetchFromTMDB('/movie/top_rated?page=1');
        
        return data.results;
    } catch (error) {
        console.error('Error fetching top rated movies:', error);
        return [];
    }
}

async function fetchTopRatedTV() {
    try {
        const data = await fetchFromTMDB('/tv/top_rated?page=1');
        
        return data.results;
    } catch (error) {
        console.error('Error fetching top rated TV:', error);
        return [];
    }
}

async function fetchMoviesByGenre(genreId, count = 10) {
    try {
        const data = await fetchFromTMDB(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=1`);
        
        return data.results.slice(0, count);
    } catch (error) {
        console.error(`Error fetching genre ${genreId} movies:`, error);
        return [];
    }
}

async function fetchTVByGenre(genreId, count = 10) {
    try {
        const data = await fetchFromTMDB(`/discover/tv?with_genres=${genreId}&sort_by=popularity.desc&page=1`);
        
        return data.results.slice(0, count);
    } catch (error) {
        console.error(`Error fetching genre ${genreId} TV:`, error);
        return [];
    }
}

async function fetchMovieDetails(movieId, type = 'movie') {
    try {
        const endpoint = type === 'movie' ? 'movie' : 'tv';
        const data = await fetchFromTMDB(`/${endpoint}/${movieId}?append_to_response=videos,credits`);        
        return data;
    } catch (error) {
        console.error(`Error fetching details for ${movieId}:`, error);
        return null;
    }
}

async function searchMovies(query) {
    try {
        const data = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&page=1`);
        
        
        return data.results;
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
}

async function searchTV(query) {
    try {
        const data = await fetchFromTMDB(`/search/tv?query=${encodeURIComponent(query)}&page=1`);
        
        return data.results;
    } catch (error) {
        console.error('Error searching TV:', error);
        return [];
    }
}

function showLoadingSkeletons() {
    if (!elements.loadingSkeletons) return;
    
    let skeletonHTML = '';
    
    for (let i = 0; i < 4; i++) {
        skeletonHTML += `
            <div class="mb-12">
                <div class="h-6 md:h-8 w-36 md:w-48 bg-gray-800 rounded animate-pulse mb-4"></div>
                <div class="flex space-x-4 overflow-x-hidden">
                    ${Array(6).fill().map(() => `
                        <div class="w-36 sm:w-44 md:w-48 h-56 sm:h-64 md:h-72 bg-gray-800 rounded animate-pulse flex-shrink-0"></div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    elements.loadingSkeletons.innerHTML = skeletonHTML;
}

function hideLoadingSkeletons() {
    if (elements.loadingSkeletons) {
        elements.loadingSkeletons.innerHTML = '';
    }
}

function switchPage(pageId) {

    Object.values(elements.pages).forEach(page => {
        if (page) {
            page.classList.remove('active');
            page.style.display = 'none'; 
        }
    });

    if (elements.pages[pageId]) {
        elements.pages[pageId].style.display = 'block'; 
        elements.pages[pageId].classList.add('active'); 
    }
    
    if (elements.footer) {
        elements.footer.style.display = pageId === 'home' ? 'block' : 'none';
    }
    
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        }
    });
    
    state.currentPage = pageId;
    
    closeMobileNav();
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function openWatchLaterSidebar() {
    if (elements.watchLaterSidebar) {
        elements.watchLaterSidebar.classList.add('open');
        if (elements.mobileOverlay) {
            elements.mobileOverlay.classList.add('active');
        }
    }
}

function closeWatchLaterSidebar() {
    if (elements.watchLaterSidebar) {
        elements.watchLaterSidebar.classList.remove('open');
    }
    if (elements.mobileOverlay) {
        elements.mobileOverlay.classList.remove('active');
    }
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

function initializeEventListeners() {

    if (elements.clearMood) {
        elements.clearMood.addEventListener('click', () => {
            state.currentMood = null;
            elements.selectedMoodDisplay.classList.add('hidden');
            document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
            const moodRow = document.querySelector('[id^="mood-"]');
            if (moodRow) moodRow.remove();
        });
    }
    
    if (elements.soundToggle) {
        elements.soundToggle.addEventListener('click', () => {
            state.soundEnabled = !state.soundEnabled;
            const icon = elements.soundToggle.querySelector('i');
            icon.className = state.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
            elements.soundToggle.classList.toggle('bg-gray-600', !state.soundEnabled);
            elements.soundToggle.classList.toggle('bg-netflix-red', state.soundEnabled);
        });
    }
    
    if (elements.searchBtn) {
        elements.searchBtn.addEventListener('click', () => {
            elements.searchBar.classList.toggle('hidden');
        });
    }
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#searchBar') && !e.target.closest('#searchBtn')) {
            if (elements.searchBar) elements.searchBar.classList.add('hidden');
        }
    });
    
    if (elements.heroPlayBtn) {
        elements.heroPlayBtn.addEventListener('click', () => {
            if (state.featuredMovie) {
                openStreamingPlayer(state.featuredMovie, 'movie');
            }
        });
    }
    
    if (elements.heroInfoBtn) {
        elements.heroInfoBtn.addEventListener('click', () => {
            if (state.featuredMovie) {
                openMovieModal(state.featuredMovie.id, 'movie');
            }
        });
    }
    
    if (elements.closeStreaming) {
        elements.closeStreaming.addEventListener('click', closeStreamingPlayer);
    }
    
    if (elements.streamingFullscreen) {
        elements.streamingFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                elements.streamingPlayer.requestFullscreen().catch(err => {
                    console.log(`Error enabling fullscreen: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (elements.streamingPlayer.style.display === 'flex') {
                closeStreamingPlayer();
            }
            closeWatchLaterSidebar();
            closeMobileNav();
        }
    });
    
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page === 'watchlater') {
                openWatchLaterSidebar();
            } else {
                switchPage(page);
            }
        });
    });
    
    elements.mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page === 'watchlater') {
                openWatchLaterSidebar();
                closeMobileNav();
            } else {
                switchPage(page);
            }
        });
    });
    
    if (elements.hamburger) {
        elements.hamburger.addEventListener('click', toggleMobileNav);
    }
    
    if (elements.mobileOverlay) {
        elements.mobileOverlay.addEventListener('click', () => {
            closeMobileNav();
            closeWatchLaterSidebar();
        });
    }
    
    if (elements.closeWatchLater) {
        elements.closeWatchLater.addEventListener('click', closeWatchLaterSidebar);
    }
    
    if (elements.mobileWatchLaterBtn) {
        elements.mobileWatchLaterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openWatchLaterSidebar();
        });
    }
    
    if (elements.globalSearchInput) {
        let searchTimeout;
        elements.globalSearchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (e.target.value.length > 2) {
                    performGlobalSearch(e.target.value);
                }
            }, 500);
        });
    }
}

function initializeScrollEffect() {
    window.addEventListener('scroll', () => {
        if (elements.navbar) {
            if (window.scrollY > 100) {
                elements.navbar.classList.remove('bg-transparent');
                elements.navbar.classList.add('bg-black', 'bg-opacity-90', 'backdrop-blur-sm', 'shadow-lg');
            } else {
                elements.navbar.classList.add('bg-transparent');
                elements.navbar.classList.remove('bg-black', 'bg-opacity-90', 'backdrop-blur-sm', 'shadow-lg');
            }
        }
    });
}

async function performGlobalSearch(query) {
    if (state.currentPage !== 'home') return;
    
    try {
        const movies = await searchMovies(query);
        
        const searchRowId = 'global-search-results';
        const existingRow = document.getElementById(searchRowId);
        if (existingRow) existingRow.remove();
        
        if (movies.length > 0) {
            createMovieRow({
                id: searchRowId,
                title: `Search Results for "${query}"`,
                movies: movies.slice(0, 10)
            }, true);
            
            document.getElementById(searchRowId)?.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error performing search:', error);
    }
}

function addToWatchLater(movie) {
    if (!movie) return;
    
    const movieData = {
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path || movie.backdrop_path,
        media_type: movie.media_type || 'movie',
        addedAt: new Date().toISOString()
    };
    
    if (!state.watchLater.some(m => m.id === movie.id)) {
        state.watchLater.push(movieData);
        localStorage.setItem('watchLater', JSON.stringify(state.watchLater));
        showToast('Added to Watch Later!');
        updateWatchLaterBadge();
        
        document.dispatchEvent(new CustomEvent('watchLaterUpdated'));
    } else {
        showToast('Already in Watch Later!');
    }
}

function removeFromWatchLater(movieId) {
    state.watchLater = state.watchLater.filter(m => m.id !== movieId);
    localStorage.setItem('watchLater', JSON.stringify(state.watchLater));
    showToast('Removed from Watch Later', 'removed');
    updateWatchLaterBadge();
    
    document.dispatchEvent(new CustomEvent('watchLaterUpdated'));
}

function showToast(message, type = 'added') {
    const toast = document.getElementById('watchLaterToast');
    if (!toast) return;
    
    const toastText = toast.querySelector('p:first-child');
    const toastIcon = toast.querySelector('i');
    
    toastText.textContent = message;
    
    if (type === 'removed') {
        toastIcon.className = 'fas fa-trash mr-3 text-xl';
        toast.classList.remove('bg-green-600');
        toast.classList.add('bg-red-600');
    } else {
        toastIcon.className = 'fas fa-check-circle mr-3 text-xl';
        toast.classList.remove('bg-red-600');
        toast.classList.add('bg-green-600');
    }
    
    toast.classList.remove('hidden', 'translate-x-full');
    toast.classList.add('translate-x-0');
    
    setTimeout(() => {
        toast.classList.remove('translate-x-0');
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
}

function updateWatchLaterBadge() {
    const count = state.watchLater.length;
    elements.watchLaterCount.forEach(el => {
        if (el) el.textContent = count;
    });
}

window.openStreamingPlayer = openStreamingPlayer;
window.addToWatchLater = addToWatchLater;
window.removeFromWatchLater = removeFromWatchLater;
window.state = state;
