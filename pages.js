document.addEventListener('DOMContentLoaded', () => {
    initializeMoviesPage();
    initializeSeriesPage();
    initializePeoplePage();
});


async function initializeMoviesPage() {
    const moviesContent = document.getElementById('moviesContent');
    const moviesSearchInput = document.getElementById('moviesSearchInput');
    
    if (!moviesContent) return;
    
    await loadMoviesPageContent();
    
    if (moviesSearchInput) {
        let searchTimeout;
        moviesSearchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                const query = e.target.value.trim();
                if (query.length > 2) {
                    await searchMoviesPage(query);
                } else if (query.length === 0) {
                    await loadMoviesPageContent();
                }
            }, 500);
        });
    }
}

async function loadMoviesPageContent() {
    const moviesContent = document.getElementById('moviesContent');
    if (!moviesContent) return;
    
    moviesContent.innerHTML = generatePageSkeletons(3);
    
    try {
       
        const [trending, topRated, action, comedy, sciFi, horror] = await Promise.all([
            fetchTrendingMovies(),
            fetchTopRatedMovies(),
            fetchMoviesByGenre(28, 10),  
            fetchMoviesByGenre(35, 10), 
            fetchMoviesByGenre(878, 10), 
            fetchMoviesByGenre(27, 10)   
        ]);
        
        moviesContent.innerHTML = '';
        
      
        if (trending.length > 0) {
            createPageMovieRow(moviesContent, 'Trending Movies', trending.slice(0, 10));
        }
        
        if (topRated.length > 0) {
            createPageMovieRow(moviesContent, 'Top Rated Movies', topRated.slice(0, 10));
        }
        
        if (action.length > 0) {
            createPageMovieRow(moviesContent, 'Action Movies', action.slice(0, 10));
        }
        
        if (comedy.length > 0) {
            createPageMovieRow(moviesContent, 'Comedies', comedy.slice(0, 10));
        }
        
        if (sciFi.length > 0) {
            createPageMovieRow(moviesContent, 'Sci-Fi Movies', sciFi.slice(0, 10));
        }
        
        if (horror.length > 0) {
            createPageMovieRow(moviesContent, 'Horror Movies', horror.slice(0, 10));
        }
        
    } catch (error) {
        console.error('Error loading movies page:', error);
        moviesContent.innerHTML = '<div class="text-center text-gray-400 py-8">Failed to load movies. Please try again.</div>';
    }
}

async function searchMoviesPage(query) {
    const moviesContent = document.getElementById('moviesContent');
    if (!moviesContent) return;
    
    try {
        const results = await searchMovies(query);
        
        moviesContent.innerHTML = '';
        
        if (results.length > 0) {
            const searchRow = document.createElement('div');
            searchRow.className = 'mb-12';
            
            const header = document.createElement('div');
            header.className = 'flex justify-between items-center mb-4';
            header.innerHTML = `<h3 class="text-2xl font-bold">Search Results for "${query}"</h3>`;
            
            const moviesWrapper = document.createElement('div');
            moviesWrapper.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4';
            
            results.slice(0, 12).forEach(movie => {
                const card = createPageMovieCard(movie, 'movie');
                moviesWrapper.appendChild(card);
            });
            
            searchRow.appendChild(header);
            searchRow.appendChild(moviesWrapper);
            moviesContent.appendChild(searchRow);
        } else {
            moviesContent.innerHTML = '<div class="text-center text-gray-400 py-8">No movies found. Try a different search.</div>';
        }
        
    } catch (error) {
        console.error('Error searching movies:', error);
        moviesContent.innerHTML = '<div class="text-center text-gray-400 py-8">Search failed. Please try again.</div>';
    }
}

async function initializeSeriesPage() {
    const seriesContent = document.getElementById('seriesContent');
    const seriesSearchInput = document.getElementById('seriesSearchInput');
    
    if (!seriesContent) return;
    
    await loadSeriesPageContent();
    
    if (seriesSearchInput) {
        let searchTimeout;
        seriesSearchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                const query = e.target.value.trim();
                if (query.length > 2) {
                    await searchSeriesPage(query);
                } else if (query.length === 0) {
                    await loadSeriesPageContent();
                }
            }, 500);
        });
    }
}

async function loadSeriesPageContent() {
    const seriesContent = document.getElementById('seriesContent');
    if (!seriesContent) return;
    
    seriesContent.innerHTML = generatePageSkeletons(3);
    
    try {
        
        const [trending, topRated, action, comedy, drama, sciFi] = await Promise.all([
            fetchTrendingTV(),
            fetchTopRatedTV(),
            fetchTVByGenre(10759, 10), 
            fetchTVByGenre(35, 10),     
            fetchTVByGenre(18, 10),     
            fetchTVByGenre(10765, 10)   
        ]);
        
        seriesContent.innerHTML = '';
        
        if (trending.length > 0) {
            createPageMovieRow(seriesContent, 'Trending Series', trending.slice(0, 10), 'tv');
        }
        
        if (topRated.length > 0) {
            createPageMovieRow(seriesContent, 'Top Rated Series', topRated.slice(0, 10), 'tv');
        }
        
        if (action.length > 0) {
            createPageMovieRow(seriesContent, 'Action & Adventure', action.slice(0, 10), 'tv');
        }
        
        if (comedy.length > 0) {
            createPageMovieRow(seriesContent, 'Comedy Series', comedy.slice(0, 10), 'tv');
        }
        
        if (drama.length > 0) {
            createPageMovieRow(seriesContent, 'Drama Series', drama.slice(0, 10), 'tv');
        }
        
        if (sciFi.length > 0) {
            createPageMovieRow(seriesContent, 'Sci-Fi & Fantasy', sciFi.slice(0, 10), 'tv');
        }
        
    } catch (error) {
        console.error('Error loading series page:', error);
        seriesContent.innerHTML = '<div class="text-center text-gray-400 py-8">Failed to load series. Please try again.</div>';
    }
}

async function searchSeriesPage(query) {
    const seriesContent = document.getElementById('seriesContent');
    if (!seriesContent) return;
    
    try {
        const results = await searchTV(query);
        
        seriesContent.innerHTML = '';
        
        if (results.length > 0) {
            const searchRow = document.createElement('div');
            searchRow.className = 'mb-12';
            
            const header = document.createElement('div');
            header.className = 'flex justify-between items-center mb-4';
            header.innerHTML = `<h3 class="text-2xl font-bold">Search Results for "${query}"</h3>`;
            
            const seriesWrapper = document.createElement('div');
            seriesWrapper.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4';
            
            results.slice(0, 12).forEach(series => {
                const card = createPageMovieCard(series, 'tv');
                seriesWrapper.appendChild(card);
            });
            
            searchRow.appendChild(header);
            searchRow.appendChild(seriesWrapper);
            seriesContent.appendChild(searchRow);
        } else {
            seriesContent.innerHTML = '<div class="text-center text-gray-400 py-8">No series found. Try a different search.</div>';
        }
        
    } catch (error) {
        console.error('Error searching series:', error);
        seriesContent.innerHTML = '<div class="text-center text-gray-400 py-8">Search failed. Please try again.</div>';
    }
}

let peoplePage = 1;
let isLoadingPeople = false;
let hasMorePeople = true;

async function initializePeoplePage() {
    const peopleGrid = document.getElementById('peopleGrid');
    const peopleSearchInput = document.getElementById('peopleSearchInput');
    const loadMoreBtn = document.getElementById('loadMorePeople');
    
    if (!peopleGrid) return;
    
    await loadPeoplePageContent();
    
    if (peopleSearchInput) {
        let searchTimeout;
        peopleSearchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                const query = e.target.value.trim();
                peoplePage = 1;
                if (query.length > 2) {
                    await searchPeoplePage(query);
                } else if (query.length === 0) {
                    await loadPeoplePageContent();
                }
            }, 500);
        });
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async () => {
            if (!isLoadingPeople && hasMorePeople) {
                peoplePage++;
                await loadMorePeople();
            }
        });
    }
}

async function loadPeoplePageContent(reset = true) {
    const peopleGrid = document.getElementById('peopleGrid');
    if (!peopleGrid) return;
    
    if (reset) {
        peoplePage = 1;
        hasMorePeople = true;
        peopleGrid.innerHTML = generatePeopleSkeletons(12);
    }
    
    isLoadingPeople = true;
    
    try {
        const data = await fetchFromTMDB(`/person/popular?page=${peoplePage}`);
        
        
        if (reset) {
            peopleGrid.innerHTML = '';
        }
        
        if (data.results && data.results.length > 0) {
            data.results.forEach(person => {
                const card = createPersonCard(person);
                peopleGrid.appendChild(card);
            });
            
            hasMorePeople = data.page < data.total_pages;
        } else {
            if (reset) {
                peopleGrid.innerHTML = '<div class="col-span-full text-center text-gray-400 py-8">No actors found.</div>';
            }
            hasMorePeople = false;
        }
        
    } catch (error) {
        console.error('Error loading people:', error);
        if (reset) {
            peopleGrid.innerHTML = '<div class="col-span-full text-center text-gray-400 py-8">Failed to load actors. Please try again.</div>';
        }
    } finally {
        isLoadingPeople = false;
        
        const loadMoreBtn = document.getElementById('loadMorePeople');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = hasMorePeople ? 'block' : 'none';
        }
    }
}

async function loadMorePeople() {
    await loadPeoplePageContent(false);
}

async function searchPeoplePage(query) {
    const peopleGrid = document.getElementById('peopleGrid');
    const loadMoreBtn = document.getElementById('loadMorePeople');
    if (!peopleGrid) return;
    
    peopleGrid.innerHTML = generatePeopleSkeletons(12);
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    
    try {
        const data = await fetchFromTMDB(`/search/person?query=${encodeURIComponent(query)}&page=1`);
        
        
        peopleGrid.innerHTML = '';
        
        if (data.results && data.results.length > 0) {
            data.results.slice(0, 12).forEach(person => {
                const card = createPersonCard(person);
                peopleGrid.appendChild(card);
            });
        } else {
            peopleGrid.innerHTML = '<div class="col-span-full text-center text-gray-400 py-8">No actors found. Try a different search.</div>';
        }
        
    } catch (error) {
        console.error('Error searching people:', error);
        peopleGrid.innerHTML = '<div class="col-span-full text-center text-gray-400 py-8">Search failed. Please try again.</div>';
    }
}

function createPersonCard(person) {
    const card = document.createElement('div');
    card.className = 'person-card bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer';
    card.dataset.personId = person.id;
    
    const profilePath = person.profile_path 
        ? `${TMDB_IMAGE_BASE}/w185${person.profile_path}`
        : 'https://via.placeholder.com/185x278?text=No+Image';
    
    card.innerHTML = `
        <div class="aspect-[2/3] bg-gray-800 overflow-hidden">
            <img src="${profilePath}" 
                 alt="${person.name}" 
                 class="w-full h-full object-cover"
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/185x278?text=No+Image'">
        </div>
        <div class="p-3">
            <h3 class="font-bold text-sm md:text-base truncate">${person.name}</h3>
            <p class="text-xs text-gray-400 truncate">${person.known_for_department || 'Actor'}</p>
            <p class="text-xs text-gray-500 mt-1 truncate">
                ${person.known_for ? person.known_for.map(work => work.title || work.name).slice(0, 2).join(', ') : ''}
            </p>
        </div>
    `;
    
    card.addEventListener('click', () => {
        openPersonModal(person.id);
    });
    
    return card;
}


async function openPersonModal(personId) {
    const modal = document.getElementById('personModal');
    const modalContent = document.getElementById('personModalContent');
    
    if (!modal || !modalContent) return;
    
    modalContent.innerHTML = `
        <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    try {
        
        const [personDetails, creditsResponse] = await Promise.all([
    fetchFromTMDB(`/person/${personId}`),
    fetchFromTMDB(`/person/${personId}/combined_credits`)
]);
        
        renderPersonModal(personDetails, personCredits);
        
    } catch (error) {
        console.error('Error loading person details:', error);
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
    
  
    const movieCredits = credits.cast?.filter(c => c.media_type === 'movie') || [];
    const tvCredits = credits.cast?.filter(c => c.media_type === 'tv') || [];
    
    const topMovies = [...movieCredits]
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 8);
    
    const topTV = [...tvCredits]
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 8);
    
    const profilePath = person.profile_path 
        ? `${TMDB_IMAGE_BASE}/w300${person.profile_path}`
        : 'https://via.placeholder.com/300x450?text=No+Image';
    
    modalContent.innerHTML = `
        <div class="grid md:grid-cols-3 gap-6">
            <!-- Left Column - Profile -->
            <div class="md:col-span-1">
                <div class="rounded-xl overflow-hidden shadow-2xl">
                    <img src="${profilePath}" 
                         alt="${person.name}" 
                         class="w-full h-auto"
                         onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
                </div>
                
                <div class="mt-6 bg-gray-800 rounded-lg p-4">
                    <h3 class="text-lg font-bold mb-3">Personal Info</h3>
                    
                    ${person.known_for_department ? `
                        <div class="mb-3">
                            <p class="text-gray-400 text-sm">Known For</p>
                            <p class="font-medium">${person.known_for_department}</p>
                        </div>
                    ` : ''}
                    
                    ${person.birthday ? `
                        <div class="mb-3">
                            <p class="text-gray-400 text-sm">Born</p>
                            <p class="font-medium">${formatDate(person.birthday)}</p>
                            ${person.deathday ? `<p class="text-red-400 text-sm">Died: ${formatDate(person.deathday)}</p>` : ''}
                        </div>
                    ` : ''}
                    
                    ${person.place_of_birth ? `
                        <div class="mb-3">
                            <p class="text-gray-400 text-sm">Place of Birth</p>
                            <p class="font-medium">${person.place_of_birth}</p>
                        </div>
                    ` : ''}
                    
                    <div class="grid grid-cols-2 gap-2 mt-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold">${movieCredits.length}</div>
                            <div class="text-xs text-gray-400">Movies</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold">${tvCredits.length}</div>
                            <div class="text-xs text-gray-400">TV Shows</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="md:col-span-2">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">${person.name}</h2>
                
                <!-- Biography -->
                <div class="mb-8">
                    <h3 class="text-xl font-bold mb-3">Biography</h3>
                    <p class="text-gray-300 leading-relaxed text-sm md:text-base">
                        ${person.biography || 'No biography available.'}
                    </p>
                </div>
                
                <!-- Known For Movies -->
                ${topMovies.length > 0 ? `
                    <div class="mb-6">
                        <h3 class="text-xl font-bold mb-3">Known For Movies</h3>
                        <div class="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                            ${topMovies.map(movie => `
                                <div class="flex-shrink-0 w-32 cursor-pointer" onclick="openMovieModal(${movie.id}, 'movie')">
                                    <div class="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden">
                                        <img src="${movie.poster_path ? TMDB_IMAGE_BASE + '/w185' + movie.poster_path : 'https://via.placeholder.com/185x278?text=No+Poster'}" 
                                             alt="${movie.title || movie.name}"
                                             class="w-full h-full object-cover"
                                             onerror="this.src='https://via.placeholder.com/185x278?text=No+Poster'">
                                    </div>
                                    <p class="text-xs mt-2 font-medium truncate">${movie.title || movie.name}</p>
                                    <p class="text-xs text-gray-400">${movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0] || ''}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Known For TV Shows -->
                ${topTV.length > 0 ? `
                    <div class="mb-6">
                        <h3 class="text-xl font-bold mb-3">Known For TV Shows</h3>
                        <div class="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                            ${topTV.map(show => `
                                <div class="flex-shrink-0 w-32 cursor-pointer" onclick="openMovieModal(${show.id}, 'tv')">
                                    <div class="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden">
                                        <img src="${show.poster_path ? TMDB_IMAGE_BASE + '/w185' + show.poster_path : 'https://via.placeholder.com/185x278?text=No+Poster'}" 
                                             alt="${show.name}"
                                             class="w-full h-full object-cover"
                                             onerror="this.src='https://via.placeholder.com/185x278?text=No+Poster'">
                                    </div>
                                    <p class="text-xs mt-2 font-medium truncate">${show.name}</p>
                                    <p class="text-xs text-gray-400">${show.first_air_date?.split('-')[0] || ''}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- All Credits Note -->
                <p class="text-sm text-gray-400 mt-4">
                    <i class="fas fa-info-circle mr-2"></i>
                    Click on any movie or TV show to view more details and streaming options.
                </p>
            </div>
        </div>
    `;
    
    const closeBtn = document.getElementById('closePersonModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePersonModal);
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePersonModal();
        }
    });
}

function closePersonModal() {
    const modal = document.getElementById('personModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}


function createPageMovieRow(container, title, items, mediaType = 'movie') {
    if (!container || !items || items.length === 0) return;
    
    const row = document.createElement('div');
    row.className = 'mb-12';
    
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-4';
    header.innerHTML = `<h3 class="text-xl md:text-2xl font-bold">${title}</h3>`;
    
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4';
    
    items.forEach(item => {
        const card = createPageMovieCard(item, mediaType);
        grid.appendChild(card);
    });
    
    row.appendChild(header);
    row.appendChild(grid);
    container.appendChild(row);
}

function createPageMovieCard(item, mediaType = 'movie') {
    const card = document.createElement('div');
    card.className = 'cursor-pointer group';
    card.dataset.id = item.id;
    card.dataset.type = mediaType;
    
    const posterPath = item.poster_path || item.backdrop_path;
    const posterUrl = posterPath 
        ? `${TMDB_IMAGE_BASE}/w342${posterPath}`
        : 'https://via.placeholder.com/342x513?text=No+Poster';
    
    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date;
    const year = date ? date.split('-')[0] : 'N/A';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
    
    card.innerHTML = `
        <div class="relative overflow-hidden rounded-lg">
            <div class="aspect-[2/3] bg-gray-800 overflow-hidden">
                <img src="${posterUrl}" 
                     alt="${title}"
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/342x513?text=No+Poster'">
            </div>
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black p-3">
                <h4 class="font-bold text-sm truncate">${title}</h4>
                <div class="flex justify-between items-center text-xs text-gray-300 mt-1">
                    <span>${year}</span>
                    <span class="flex items-center">
                        <i class="fas fa-star text-yellow-400 mr-1"></i>
                        ${rating}
                    </span>
                </div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        openMovieModal(item.id, mediaType);
    });
    
    return card;
}

function generatePageSkeletons(count = 3) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="mb-12">
                <div class="h-6 md:h-8 w-36 md:w-48 bg-gray-800 rounded animate-pulse mb-4"></div>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    ${Array(6).fill().map(() => `
                        <div class="aspect-[2/3] bg-gray-800 rounded animate-pulse"></div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    return html;
}

function generatePeopleSkeletons(count = 12) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="bg-gray-900 rounded-lg overflow-hidden animate-pulse">
                <div class="aspect-[2/3] bg-gray-800"></div>
                <div class="p-3">
                    <div class="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-gray-800 rounded w-1/2"></div>
                </div>
            </div>
        `;
    }
    return html;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

window.openPersonModal = openPersonModal;
window.closePersonModal = closePersonModal;
window.openMovieModal = openMovieModal;
