const MOVIE_GENRES = [
    { id: 0,     name: 'All' },
    { id: 28,    name: 'Action' },
    { id: 16,    name: 'Animation' },
    { id: 35,    name: 'Comedy' },
    { id: 80,    name: 'Crime' },
    { id: 99,    name: 'Documentary' },
    { id: 18,    name: 'Drama' },
    { id: 14,    name: 'Fantasy' },
    { id: 27,    name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648,  name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878,   name: 'Sci-Fi' },
    { id: 53,    name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37,    name: 'Western' }
];

const TV_GENRES = [
    { id: 0,     name: 'All' },
    { id: 10759, name: 'Action & Adventure' },
    { id: 16,    name: 'Animation' },
    { id: 35,    name: 'Comedy' },
    { id: 80,    name: 'Crime' },
    { id: 99,    name: 'Documentary' },
    { id: 18,    name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 10762, name: 'Kids' },
    { id: 9648,  name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 10767, name: 'Talk Show' },
    { id: 10768, name: 'War & Politics' },
    { id: 37,    name: 'Western' }
];

let moviesActiveGenre = 0;
let moviesCurrentPage = 1;
let moviesLoading = false;
let moviesSearchActive = false;

let seriesActiveGenre = 0;
let seriesCurrentPage = 1;
let seriesLoading = false;
let seriesSearchActive = false;

let isLoadingPeople = false;

document.addEventListener('DOMContentLoaded', () => {
    initializeMoviesPage();
    initializeSeriesPage();
    initializePeoplePage();
});

function initializeMoviesPage() {
    const moviesSearchInput = document.getElementById('moviesSearchInput');
    const genreBar = document.getElementById('moviesGenreBar');
    const filterBar = document.getElementById('moviesFilterBar');

    buildGenrePills(genreBar, MOVIE_GENRES, 'movie');
    if (filterBar) {
        buildFilterBar(filterBar, 'movie', () => {
            moviesCurrentPage = 1;
            loadMoviesPageContent();
        });
    }
    loadMoviesPageContent();

    if (moviesSearchInput) {
        let t;
        moviesSearchInput.addEventListener('input', e => {
            clearTimeout(t);
            const query = e.target.value.trim();
            if (query.length > 2) {
                moviesSearchActive = true;
                t = setTimeout(() => searchMoviesPage(query), 500);
            } else if (query.length === 0) {
                moviesSearchActive = false;
                moviesActiveGenre = 0;
                updateGenrePillsUI(genreBar, 0);
                loadMoviesPageContent();
            }
        });
    }
}

function initializeSeriesPage() {
    const seriesSearchInput = document.getElementById('seriesSearchInput');
    const genreBar = document.getElementById('seriesGenreBar');
    const filterBar = document.getElementById('seriesFilterBar');

    buildGenrePills(genreBar, TV_GENRES, 'tv');
    if (filterBar) {
        buildFilterBar(filterBar, 'tv', () => {
            seriesCurrentPage = 1;
            loadSeriesPageContent();
        });
    }
    loadSeriesPageContent();

    if (seriesSearchInput) {
        let t;
        seriesSearchInput.addEventListener('input', e => {
            clearTimeout(t);
            const query = e.target.value.trim();
            if (query.length > 2) {
                seriesSearchActive = true;
                t = setTimeout(() => searchSeriesPage(query), 500);
            } else if (query.length === 0) {
                seriesSearchActive = false;
                seriesActiveGenre = 0;
                updateGenrePillsUI(genreBar, 0);
                loadSeriesPageContent();
            }
        });
    }
}

function buildGenrePills(container, genres, type) {
    if (!container) return;
    container.innerHTML = '';
    genres.forEach(genre => {
        const pill = document.createElement('button');
        pill.className = `genre-pill${genre.id === 0 ? ' active' : ''}`;
        pill.textContent = genre.name;
        pill.dataset.genreId = genre.id;
        pill.addEventListener('click', () => {
            if (type === 'movie') {
                if (moviesActiveGenre === genre.id) return;
                moviesActiveGenre = genre.id;
                moviesCurrentPage = 1;
                moviesSearchActive = false;
                const searchInput = document.getElementById('moviesSearchInput');
                if (searchInput) searchInput.value = '';
                updateGenrePillsUI(container, genre.id);
                loadMoviesPageContent();
            } else {
                if (seriesActiveGenre === genre.id) return;
                seriesActiveGenre = genre.id;
                seriesCurrentPage = 1;
                seriesSearchActive = false;
                const searchInput = document.getElementById('seriesSearchInput');
                if (searchInput) searchInput.value = '';
                updateGenrePillsUI(container, genre.id);
                loadSeriesPageContent();
            }
        });
        container.appendChild(pill);
    });
}

function updateGenrePillsUI(container, activeId) {
    if (!container) return;
    container.querySelectorAll('.genre-pill').forEach(pill => {
        pill.classList.toggle('active', parseInt(pill.dataset.genreId) === activeId);
    });
}

async function loadMoviesPageContent() {
    const moviesContent = document.getElementById('moviesContent');
    if (!moviesContent) return;
    moviesContent.innerHTML = generatePageSkeletons(3);

    try {
        let rows;
        const filters = pageFilters.movie;
        if (moviesActiveGenre === 0 && !isFiltersActive(filters)) {
            const [trending, topRated, action, comedy, sciFi, horror, animation, thriller] = await Promise.all([
                fetchTrendingMovies(),
                fetchTopRatedMovies(),
                fetchMoviesByGenre(28, 12),
                fetchMoviesByGenre(35, 12),
                fetchMoviesByGenre(878, 12),
                fetchMoviesByGenre(27, 12),
                fetchMoviesByGenre(16, 12),
                fetchMoviesByGenre(53, 12)
            ]);
            rows = [
                { title: '🔥 Trending Movies', items: trending },
                { title: '⭐ Top Rated Movies', items: topRated },
                { title: '💥 Action', items: action },
                { title: '😂 Comedy', items: comedy },
                { title: '🚀 Sci-Fi', items: sciFi },
                { title: '😱 Horror', items: horror },
                { title: '🎨 Animation', items: animation },
                { title: '🔪 Thriller', items: thriller }
            ];
        } else {
            const genre = MOVIE_GENRES.find(g => g.id === moviesActiveGenre);
            const items = await discoverMedia('movie', moviesActiveGenre, filters, 1, 20);
            rows = [{ title: `${genre?.name || 'Genre'} Movies`, items, genreId: moviesActiveGenre, type: 'movie', paginate: true }];
        }

        moviesContent.innerHTML = '';
        rows.forEach(row => {
            if (row.items && row.items.length > 0) {
                createPageMovieRow(moviesContent, row.title, row.items, 'movie', row.genreId, row.paginate);
            } else if (row.paginate) {
                moviesContent.innerHTML = '<div class="text-center text-gray-400 py-12">No movies match these filters.</div>';
            }
        });
    } catch {
        moviesContent.innerHTML = '<div class="text-center text-gray-400 py-12">Failed to load movies. Please try again.</div>';
    }
}

async function loadSeriesPageContent() {
    const seriesContent = document.getElementById('seriesContent');
    if (!seriesContent) return;
    seriesContent.innerHTML = generatePageSkeletons(3);

    try {
        let rows;
        const filters = pageFilters.tv;
        if (seriesActiveGenre === 0 && !isFiltersActive(filters)) {
            const [trending, topRated, action, comedy, drama, sciFi, crime, animation] = await Promise.all([
                fetchTrendingTV(),
                fetchTopRatedTV(),
                fetchTVByGenre(10759, 12),
                fetchTVByGenre(35, 12),
                fetchTVByGenre(18, 12),
                fetchTVByGenre(10765, 12),
                fetchTVByGenre(80, 12),
                fetchTVByGenre(16, 12)
            ]);
            rows = [
                { title: '🔥 Trending Series', items: trending },
                { title: '⭐ Top Rated Series', items: topRated },
                { title: '💥 Action & Adventure', items: action },
                { title: '😂 Comedy Series', items: comedy },
                { title: '🎭 Drama Series', items: drama },
                { title: '🚀 Sci-Fi & Fantasy', items: sciFi },
                { title: '🔍 Crime Series', items: crime },
                { title: '🎨 Animation Series', items: animation }
            ];
        } else {
            const genre = TV_GENRES.find(g => g.id === seriesActiveGenre);
            const items = await discoverMedia('tv', seriesActiveGenre, filters, 1, 20);
            rows = [{ title: `${genre?.name || 'Genre'} Series`, items, genreId: seriesActiveGenre, type: 'tv', paginate: true }];
        }

        seriesContent.innerHTML = '';
        rows.forEach(row => {
            if (row.items && row.items.length > 0) {
                createPageMovieRow(seriesContent, row.title, row.items, 'tv', row.genreId, row.paginate);
            } else if (row.paginate) {
                seriesContent.innerHTML = '<div class="text-center text-gray-400 py-12">No series match these filters.</div>';
            }
        });
    } catch {
        seriesContent.innerHTML = '<div class="text-center text-gray-400 py-12">Failed to load series. Please try again.</div>';
    }
}

async function searchMoviesPage(query) {
    const moviesContent = document.getElementById('moviesContent');
    if (!moviesContent) return;
    moviesContent.innerHTML = generatePageSkeletons(1);

    try {
        const results = await searchMovies(query);
        moviesContent.innerHTML = '';
        if (results.length > 0) {
            createPageMovieRow(moviesContent, `Search: "${query}"`, results.slice(0, 20), 'movie');
        } else {
            moviesContent.innerHTML = '<div class="text-center text-gray-400 py-12">No movies found. Try a different search.</div>';
        }
    } catch {
        moviesContent.innerHTML = '<div class="text-center text-gray-400 py-12">Search failed. Please try again.</div>';
    }
}

async function searchSeriesPage(query) {
    const seriesContent = document.getElementById('seriesContent');
    if (!seriesContent) return;
    seriesContent.innerHTML = generatePageSkeletons(1);

    try {
        const results = await searchTV(query);
        seriesContent.innerHTML = '';
        if (results.length > 0) {
            createPageMovieRow(seriesContent, `Search: "${query}"`, results.slice(0, 20), 'tv');
        } else {
            seriesContent.innerHTML = '<div class="text-center text-gray-400 py-12">No series found. Try a different search.</div>';
        }
    } catch {
        seriesContent.innerHTML = '<div class="text-center text-gray-400 py-12">Search failed. Please try again.</div>';
    }
}

function createPageMovieRow(container, title, items, mediaType = 'movie', genreId = null, paginate = false, baseParams = {}) {
    if (!container || !items || items.length === 0) return;

    const row = document.createElement('div');
    row.className = 'mb-10';

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-4';
    header.innerHTML = `<h3 class="text-lg md:text-xl font-bold">${title}</h3>`;

    const grid = document.createElement('div');
    grid.className = 'grid gap-3';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(min(140px, 42vw), 1fr))';

    items.forEach(item => grid.appendChild(createPageMovieCard(item, mediaType)));

    row.appendChild(header);
    row.appendChild(grid);

    if (paginate || (genreId && genreId !== 0)) {
        const loadMoreWrapper = document.createElement('div');
        loadMoreWrapper.className = 'text-center mt-6';
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.className = 'bg-gray-800 text-white px-6 py-2.5 rounded-lg hover:bg-gray-700 transition text-sm font-medium';
        loadMoreBtn.textContent = 'Load More';
        loadMoreBtn.dataset.page = '1';
        loadMoreBtn.dataset.genreId = genreId || 0;
        loadMoreBtn.dataset.mediaType = mediaType;
        loadMoreBtn._baseParams = baseParams;
        loadMoreBtn.addEventListener('click', () => handleLoadMoreGenre(loadMoreBtn, grid));
        loadMoreWrapper.appendChild(loadMoreBtn);
        row.appendChild(loadMoreWrapper);
    }

    container.appendChild(row);
}

async function handleLoadMoreGenre(btn, grid) {
    if (btn.disabled) return;
    btn.disabled = true;
    btn.textContent = 'Loading...';

    const nextPage = parseInt(btn.dataset.page) + 1;
    const genreId = parseInt(btn.dataset.genreId);
    const mediaType = btn.dataset.mediaType;
    const filters = pageFilters[mediaType] || defaultFilterState();
    const baseParams = btn._baseParams || {};

    try {
        const items = await discoverMedia(mediaType, genreId, filters, nextPage, 20, baseParams);

        if (items && items.length > 0) {
            items.forEach(item => grid.appendChild(createPageMovieCard(item, mediaType)));
            btn.dataset.page = nextPage;
            btn.disabled = false;
            btn.textContent = 'Load More';
        } else {
            btn.textContent = 'No more results';
        }
    } catch {
        btn.disabled = false;
        btn.textContent = 'Load More';
    }
}

function createPageMovieCard(item, mediaType = 'movie') {
    const card = document.createElement('div');
    card.className = 'cursor-pointer group';

    const posterPath = item.poster_path || item.backdrop_path;
    const posterUrl = posterPath
        ? `${TMDB_IMAGE_BASE}/w342${posterPath}`
        : 'https://placehold.co/342x513/1a1a1a/666?text=No+Poster';

    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date;
    const year = date ? date.split('-')[0] : 'N/A';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

    card.innerHTML = `
        <div class="relative overflow-hidden rounded-lg">
            <div class="bg-gray-800 overflow-hidden" style="aspect-ratio:2/3">
                <img src="${posterUrl}"
                     alt="${title}"
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                     loading="lazy"
                     onerror="this.src='https://placehold.co/342x513/1a1a1a/666?text=No+Poster'">
            </div>
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black p-2 rounded-b-lg">
                <h4 class="font-bold text-xs md:text-sm line-clamp-2">${title}</h4>
                <div class="flex justify-between items-center text-xs text-gray-300 mt-1">
                    <span>${year}</span>
                    <span class="text-yellow-400">⭐ ${rating}</span>
                </div>
            </div>
        </div>
    `;

    card.addEventListener('click', () => openMovieModal(item.id, mediaType));
    return card;
}

function generatePageSkeletons(count = 3) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="mb-10">
                <div class="h-5 w-36 bg-gray-800 rounded animate-pulse mb-4"></div>
                <div class="grid gap-3" style="grid-template-columns:repeat(auto-fill,minmax(min(140px,42vw),1fr))">
                    ${Array(6).fill().map(() => `<div class="bg-gray-800 rounded animate-pulse" style="aspect-ratio:2/3"></div>`).join('')}
                </div>
            </div>`;
    }
    return html;
}

function generatePeopleSkeletons(count = 12) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="bg-gray-900 rounded-lg overflow-hidden animate-pulse">
                <div class="bg-gray-800" style="aspect-ratio:2/3"></div>
                <div class="p-3">
                    <div class="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-gray-800 rounded w-1/2"></div>
                </div>
            </div>`;
    }
    return html;
}

let peoplePage = 1;
let hasMorePeople = true;

async function initializePeoplePage() {
    const peopleGrid = document.getElementById('peopleGrid');
    const searchInput = document.getElementById('peopleSearchInput');
    const loadMoreBtn = document.getElementById('loadMorePeople');

    if (!peopleGrid) return;

    await loadPeoplePageContent();

    if (searchInput) {
        let t;
        searchInput.addEventListener('input', e => {
            clearTimeout(t);
            const query = e.target.value.trim();
            peoplePage = 1;
            if (query.length > 2) {
                t = setTimeout(() => searchPeoplePage(query), 500);
            } else if (query.length === 0) {
                loadPeoplePageContent();
            }
        });
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async () => {
            if (!isLoadingPeople && hasMorePeople) {
                peoplePage++;
                await loadPeoplePageContent(false);
            }
        });
    }
}

async function loadPeoplePageContent(reset = true) {
    const peopleGrid = document.getElementById('peopleGrid');
    const loadMoreBtn = document.getElementById('loadMorePeople');
    if (!peopleGrid) return;

    if (reset) {
        peoplePage = 1;
        hasMorePeople = true;
        peopleGrid.innerHTML = generatePeopleSkeletons(12);
        if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
    }

    isLoadingPeople = true;

    try {
        const data = await fetchFromTMDB(`/person/popular?page=${peoplePage}`);

        if (reset) peopleGrid.innerHTML = '';

        if (data?.results?.length > 0) {
            data.results.forEach(person => peopleGrid.appendChild(createPersonCard(person)));
            hasMorePeople = data.page < data.total_pages;
            if (loadMoreBtn) loadMoreBtn.classList.toggle('hidden', !hasMorePeople);
        } else {
            if (reset) {
                peopleGrid.innerHTML = '<div class="col-span-full text-center text-gray-400 py-12">No actors found.</div>';
            }
            hasMorePeople = false;
            if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
        }
    } catch {
        if (reset) {
            peopleGrid.innerHTML = '<div class="col-span-full text-center text-gray-400 py-12">Failed to load. Please try again.</div>';
        }
    } finally {
        isLoadingPeople = false;
    }
}

async function searchPeoplePage(query) {
    const peopleGrid = document.getElementById('peopleGrid');
    const loadMoreBtn = document.getElementById('loadMorePeople');
    if (!peopleGrid) return;

    peopleGrid.innerHTML = generatePeopleSkeletons(12);
    if (loadMoreBtn) loadMoreBtn.classList.add('hidden');

    try {
        const data = await fetchFromTMDB(`/search/person?query=${encodeURIComponent(query)}&page=1`);
        peopleGrid.innerHTML = '';

        if (data?.results?.length > 0) {
            data.results.slice(0, 18).forEach(person => peopleGrid.appendChild(createPersonCard(person)));
        } else {
            peopleGrid.innerHTML = `<div class="col-span-full text-center text-gray-400 py-12">No actors found for "${query}"</div>`;
        }
    } catch {
        peopleGrid.innerHTML = '<div class="col-span-full text-center text-gray-400 py-12">Search failed. Please try again.</div>';
    }
}

function createPersonCard(person) {
    const card = document.createElement('div');
    card.className = 'person-card bg-gray-900 rounded-lg overflow-hidden cursor-pointer';

    const profilePath = person.profile_path
        ? `${TMDB_IMAGE_BASE}/w185${person.profile_path}`
        : 'https://placehold.co/185x278/1a1a1a/666?text=No+Image';

    card.innerHTML = `
        <div class="bg-gray-800 overflow-hidden" style="aspect-ratio:2/3">
            <img src="${profilePath}"
                 alt="${person.name}"
                 class="w-full h-full object-cover"
                 loading="lazy"
                 onerror="this.src='https://placehold.co/185x278/1a1a1a/666?text=No+Image'">
        </div>
        <div class="p-3">
            <h3 class="font-bold text-sm truncate">${person.name}</h3>
            <p class="text-xs text-gray-400 truncate mt-0.5">${person.known_for_department || 'Actor'}</p>
            <p class="text-xs text-gray-500 mt-1 truncate">
                ${person.known_for ? person.known_for.map(w => w.title || w.name).slice(0, 2).join(', ') : ''}
            </p>
        </div>
    `;

    card.addEventListener('click', () => openPersonModal(person.id));
    return card;
}

async function openPersonModal(personId) {
    const modal = document.getElementById('personModal');
    const modalContent = document.getElementById('personModalContent');
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
        <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style="border-color:var(--netflix-red);border-top-color:transparent"></div>
        </div>
    `;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    try {
        const [personDetails, creditsData] = await Promise.all([
            fetchFromTMDB(`/person/${personId}`),
            fetchFromTMDB(`/person/${personId}/combined_credits`)
        ]);

        if (!personDetails) throw new Error('Failed to load person');
        renderPersonModal(personDetails, creditsData || { cast: [] });
    } catch {
        modalContent.innerHTML = `
            <div class="text-center p-8">
                <i class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
                <h3 class="text-xl font-bold mb-2">Failed to Load</h3>
                <p class="text-gray-400">Could not load actor details. Please try again.</p>
            </div>
        `;
    }
}

function renderPersonModal(person, credits) {
    const modalContent = document.getElementById('personModalContent');
    if (!modalContent) return;

    const movies = [...(credits.cast?.filter(c => c.media_type === 'movie') || [])]
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 8);

    const tvShows = [...(credits.cast?.filter(c => c.media_type === 'tv') || [])]
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 8);

    const profilePath = person.profile_path
        ? `${TMDB_IMAGE_BASE}/w300${person.profile_path}`
        : 'https://placehold.co/300x450/1a1a1a/666?text=No+Image';

    const birthDate = person.birthday ? new Date(person.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;
    const deathDate = person.deathday ? new Date(person.deathday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;

    modalContent.innerHTML = `
        <div class="grid md:grid-cols-3 gap-5">
            <div class="md:col-span-1">
                <div class="rounded-xl overflow-hidden shadow-2xl">
                    <img src="${profilePath}" alt="${person.name}" class="w-full h-auto" onerror="this.src='https://placehold.co/300x450/1a1a1a/666?text=No+Image'">
                </div>
                <div class="mt-4 bg-gray-800 rounded-xl p-4">
                    <h3 class="font-bold mb-3 text-sm uppercase tracking-wider text-gray-400">Personal Info</h3>
                    ${person.known_for_department ? `<div class="mb-2"><p class="text-gray-400 text-xs">Known For</p><p class="font-medium text-sm">${person.known_for_department}</p></div>` : ''}
                    ${birthDate ? `<div class="mb-2"><p class="text-gray-400 text-xs">Born</p><p class="font-medium text-sm">${birthDate}</p>${deathDate ? `<p class="text-red-400 text-xs mt-0.5">Died: ${deathDate}</p>` : ''}</div>` : ''}
                    ${person.place_of_birth ? `<div class="mb-2"><p class="text-gray-400 text-xs">Place of Birth</p><p class="font-medium text-sm">${person.place_of_birth}</p></div>` : ''}
                    <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-700">
                        <div class="text-center bg-gray-900 rounded-lg p-2">
                            <div class="text-xl font-bold" style="color:var(--netflix-red)">${movies.length}</div>
                            <div class="text-xs text-gray-400">Movies</div>
                        </div>
                        <div class="text-center bg-gray-900 rounded-lg p-2">
                            <div class="text-xl font-bold" style="color:var(--netflix-red)">${tvShows.length}</div>
                            <div class="text-xs text-gray-400">TV Shows</div>
                        </div>
                    </div>
                </div>
                ${person.homepage ? `
                    <a href="${person.homepage}" target="_blank" rel="noopener noreferrer" class="mt-3 flex items-center justify-center gap-2 bg-gray-800 text-white py-2.5 rounded-lg hover:bg-gray-700 transition text-sm">
                        <i class="fas fa-globe"></i> Official Website
                    </a>
                ` : ''}
            </div>
            <div class="md:col-span-2">
                <h2 class="text-2xl md:text-3xl font-bold mb-1">${person.name}</h2>
                ${person.biography ? `
                    <div class="mb-6">
                        <h3 class="text-lg font-bold mb-2 flex items-center gap-2">
                            <i class="fas fa-book-open text-sm" style="color:var(--netflix-red)"></i> Biography
                        </h3>
                        <div class="bg-gray-800 rounded-xl p-4">
                            <p class="text-gray-300 leading-relaxed text-sm">${person.biography.length > 1000 ? person.biography.substring(0, 1000) + '...' : person.biography}</p>
                        </div>
                    </div>
                ` : ''}
                ${movies.length > 0 ? `
                    <div class="mb-6">
                        <h3 class="text-lg font-bold mb-3 flex items-center gap-2">
                            <i class="fas fa-film text-sm" style="color:var(--netflix-red)"></i> Known For — Movies
                        </h3>
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            ${movies.map(movie => createCreditCard(movie, 'movie')).join('')}
                        </div>
                    </div>
                ` : ''}
                ${tvShows.length > 0 ? `
                    <div class="mb-6">
                        <h3 class="text-lg font-bold mb-3 flex items-center gap-2">
                            <i class="fas fa-tv text-sm" style="color:var(--netflix-red)"></i> Known For — TV Shows
                        </h3>
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            ${tvShows.map(show => createCreditCard(show, 'tv')).join('')}
                        </div>
                    </div>
                ` : ''}
                ${movies.length === 0 && tvShows.length === 0 ? `
                    <div class="bg-gray-800 rounded-xl p-8 text-center">
                        <i class="fas fa-video-slash text-3xl text-gray-600 mb-3"></i>
                        <p class="text-gray-400">No known credits available</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    const closeBtn = document.getElementById('closePersonModal');
    if (closeBtn) {
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        newCloseBtn.addEventListener('click', closePersonModal);
    }

    const modal = document.getElementById('personModal');
    modal.onclick = e => { if (e.target === modal) closePersonModal(); };
}

function createCreditCard(credit, mediaType) {
    const title = credit.title || credit.name;
    const year = (credit.release_date || credit.first_air_date || '').split('-')[0] || '';
    const poster = credit.poster_path
        ? `${TMDB_IMAGE_BASE}/w185${credit.poster_path}`
        : 'https://placehold.co/185x278/1a1a1a/666?text=No+Poster';
    const character = credit.character || '';
    const rating = credit.vote_average ? credit.vote_average.toFixed(1) : '';

    return `
        <div class="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
             onclick="openMovieModal(${credit.id}, '${mediaType}')">
            <div class="relative" style="aspect-ratio:2/3">
                <img src="${poster}" alt="${title}" class="w-full h-full object-cover" loading="lazy" onerror="this.src='https://placehold.co/185x278/1a1a1a/666?text=No+Poster'">
                ${rating ? `<div class="absolute top-1.5 right-1.5 bg-black bg-opacity-70 px-1.5 py-0.5 rounded text-xs text-yellow-400">⭐ ${rating}</div>` : ''}
            </div>
            <div class="p-2">
                <h4 class="font-bold text-xs mb-0.5 line-clamp-2">${title}</h4>
                <p class="text-xs text-gray-400">${year}</p>
                ${character ? `<p class="text-xs text-gray-500 truncate mt-0.5">as ${character}</p>` : ''}
            </div>
        </div>
    `;
}

function closePersonModal() {
    const modal = document.getElementById('personModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

window.openPersonModal = openPersonModal;
window.closePersonModal = closePersonModal;
window.openMovieModal = openMovieModal;
