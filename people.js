document.addEventListener('DOMContentLoaded', () => {
    initializePeopleModule();
});

let peopleCurrentPage = 1;
let peopleTotalPages = 1;
let peopleSearchQuery = '';


function initializePeopleModule() {
    
    loadPopularPeople(1, true);
  
    setupPeopleEventListeners();
}

function setupPeopleEventListeners() {

    const peopleSearchInput = document.getElementById('peopleSearchInput');
    if (peopleSearchInput) {
        let searchTimeout;
        peopleSearchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    peopleSearchQuery = query;
                    peopleCurrentPage = 1;
                    searchPeople(query, 1);
                }, 500);
            } else if (query.length === 0) {
                peopleSearchQuery = '';
                peopleCurrentPage = 1;
                loadPopularPeople(1, true);
            }
        });
    }
    
    const loadMoreBtn = document.getElementById('loadMorePeople');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            if (!isLoadingPeople && peopleCurrentPage < peopleTotalPages) {
                peopleCurrentPage++;
                
                if (peopleSearchQuery) {
                    searchPeople(peopleSearchQuery, peopleCurrentPage, false);
                } else {
                    loadPopularPeople(peopleCurrentPage, false);
                }
            }
        });
    }
    
    const closePersonModal = document.getElementById('closePersonModal');
    if (closePersonModal) {
        closePersonModal.addEventListener('click', closePersonModalHandler);
    }
    
    const personModal = document.getElementById('personModal');
    if (personModal) {
        personModal.addEventListener('click', (e) => {
            if (e.target === personModal) {
                closePersonModalHandler();
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('personModal');
            if (modal && modal.classList.contains('active')) {
                closePersonModalHandler();
            }
        }
    });
}

async function loadPopularPeople(page = 1, reset = true) {
    const peopleGrid = document.getElementById('peopleGrid');
    const loadMoreBtn = document.getElementById('loadMorePeople');
    
    if (!peopleGrid) return;
    
    isLoadingPeople = true;
    
    if (reset) {
        peopleGrid.innerHTML = generatePeopleSkeletons(12);
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }
    
    try {
        const data = await fetchFromTMDB(`/person/popular?page=${page}`);
       
        
        if (reset) {
            peopleGrid.innerHTML = '';
        }
        
        peopleTotalPages = data.total_pages;
        
        if (data.results && data.results.length > 0) {
            data.results.forEach(person => {
                const personCard = createPersonCard(person);
                peopleGrid.appendChild(personCard);
            });
            
            if (loadMoreBtn) {
                loadMoreBtn.style.display = page < data.total_pages ? 'block' : 'none';
            }
        } else {
            if (reset) {
                peopleGrid.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-users text-5xl text-gray-600 mb-4"></i>
                        <p class="text-gray-400 text-lg">No actors found</p>
                    </div>
                `;
            }
        }
        
    } catch (error) {
        console.error('Error loading popular people:', error);
        if (reset) {
            peopleGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-exclamation-triangle text-5xl text-yellow-600 mb-4"></i>
                    <p class="text-gray-400 text-lg">Failed to load actors</p>
                    <button onclick="loadPopularPeople(1, true)" class="mt-4 bg-netflix-red text-white px-6 py-2 rounded-md hover:bg-red-700 transition">
                        Try Again
                    </button>
                </div>
            `;
        }
    } finally {
        isLoadingPeople = false;
    }
}

async function searchPeople(query, page = 1, reset = true) {
    const peopleGrid = document.getElementById('peopleGrid');
    const loadMoreBtn = document.getElementById('loadMorePeople');
    
    if (!peopleGrid) return;
    
    isLoadingPeople = true;
    
    if (reset) {
        peopleGrid.innerHTML = generatePeopleSkeletons(12);
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }
    
    try {
        const data = await fetchFromTMDB(`/search/person?query=${encodeURIComponent(query)}&page=${page}`);
        
        if (reset) {
            peopleGrid.innerHTML = '';
        }
        
        peopleTotalPages = data.total_pages;
        
        if (data.results && data.results.length > 0) {
            data.results.forEach(person => {
                const personCard = createPersonCard(person);
                peopleGrid.appendChild(personCard);
            });
            
            if (loadMoreBtn) {
                loadMoreBtn.style.display = page < data.total_pages ? 'block' : 'none';
            }
            
            if (reset && page === 1) {
                const searchHeader = document.createElement('div');
                searchHeader.className = 'col-span-full mb-4';
                searchHeader.innerHTML = `
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl text-gray-400">
                            Found <span class="text-white font-bold">${data.total_results}</span> results for "${query}"
                        </h3>
                        <button onclick="clearPeopleSearch()" class="text-gray-400 hover:text-white transition">
                            <i class="fas fa-times mr-1"></i> Clear Search
                        </button>
                    </div>
                `;
                peopleGrid.insertBefore(searchHeader, peopleGrid.firstChild);
            }
        } else {
            peopleGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-user-slash text-5xl text-gray-600 mb-4"></i>
                    <p class="text-gray-400 text-lg">No actors found for "${query}"</p>
                    <button onclick="clearPeopleSearch()" class="mt-4 bg-netflix-red text-white px-6 py-2 rounded-md hover:bg-red-700 transition">
                        Clear Search
                    </button>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error searching people:', error);
        if (reset) {
            peopleGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-exclamation-triangle text-5xl text-yellow-600 mb-4"></i>
                    <p class="text-gray-400 text-lg">Search failed. Please try again.</p>
                </div>
            `;
        }
    } finally {
        isLoadingPeople = false;
    }
}

function clearPeopleSearch() {
    const peopleSearchInput = document.getElementById('peopleSearchInput');
    if (peopleSearchInput) {
        peopleSearchInput.value = '';
    }
    
    peopleSearchQuery = '';
    peopleCurrentPage = 1;
    loadPopularPeople(1, true);
}

function createPersonCard(person) {
    const card = document.createElement('div');
    card.className = 'person-card bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer group';
    card.dataset.personId = person.id;
    
    const profilePath = person.profile_path 
        ? `${TMDB_IMAGE_BASE}/w342${person.profile_path}`
        : 'https://via.placeholder.com/342x513/333/666?text=No+Image';
    
    const knownFor = person.known_for 
        ? person.known_for.slice(0, 2).map(work => work.title || work.name).join(', ')
        : person.known_for_department || 'Actor';
    
    card.innerHTML = `
        <div class="relative">
            <div class="aspect-[2/3] bg-gray-800 overflow-hidden">
                <img src="${profilePath}" 
                     alt="${person.name}" 
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/342x513/333/666?text=No+Image'">
            </div>
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
                <h3 class="font-bold text-white text-sm md:text-base truncate">${person.name}</h3>
                <p class="text-xs text-gray-300 truncate">${person.known_for_department || 'Actor'}</p>
            </div>
        </div>
        <div class="p-3 bg-gray-900">
            <p class="text-xs text-gray-400 line-clamp-2">
                <span class="text-gray-500">Known for:</span> ${knownFor}
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
        <div class="flex flex-col items-center justify-center py-16">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-netflix-red border-t-transparent mb-4"></div>
            <p class="text-gray-400">Loading actor details...</p>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    try {
      
const [personDetails, personCredits] = await Promise.all([
    fetchFromTMDB(`/person/${personId}`),
    fetchFromTMDB(`/person/${personId}/combined_credits`)
]);


const movieCredits = personCredits.cast?.filter(c => c.media_type === 'movie') || [];
const tvCredits = personCredits.cast?.filter(c => c.media_type === 'tv') || [];
        
        const sortedMovies = [...movieCredits]
            .sort((a, b) => {
        
                if (b.popularity !== a.popularity) {
                    return (b.popularity || 0) - (a.popularity || 0);
                }
              
                const dateA = a.release_date ? new Date(a.release_date) : new Date(0);
                const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
                return dateB - dateA;
            })
            .slice(0, 12);
        
        const sortedTV = [...tvCredits]
            .sort((a, b) => {
                if (b.popularity !== a.popularity) {
                    return (b.popularity || 0) - (a.popularity || 0);
                }
                const dateA = a.first_air_date ? new Date(a.first_air_date) : new Date(0);
                const dateB = b.first_air_date ? new Date(b.first_air_date) : new Date(0);
                return dateB - dateA;
            })
            .slice(0, 12);
        
        renderPersonModal(personDetails, sortedMovies, sortedTV);
        
    } catch (error) {
        console.error('Error loading person details:', error);
        modalContent.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-triangle text-5xl text-yellow-500 mb-4"></i>
                <h3 class="text-xl font-bold mb-2">Failed to Load</h3>
                <p class="text-gray-400 mb-6">Could not load actor details. Please try again.</p>
                <button onclick="closePersonModalHandler()" class="bg-netflix-red text-white px-6 py-2 rounded-md hover:bg-red-700 transition">
                    Close
                </button>
            </div>
        `;
    }
}

function renderPersonModal(person, movies, tvShows) {
    const modalContent = document.getElementById('personModalContent');
    if (!modalContent) return;
    
    const profilePath = person.profile_path 
        ? `${TMDB_IMAGE_BASE}/w500${person.profile_path}`
        : 'https://via.placeholder.com/500x750/333/666?text=No+Image';
    
    const birthDate = person.birthday ? formatDate(person.birthday) : 'Unknown';
    const deathDate = person.deathday ? formatDate(person.deathday) : null;
    const age = person.birthday ? calculateAge(person.birthday, person.deathday) : null;
    
    modalContent.innerHTML = `
        <div class="grid md:grid-cols-3 gap-8">
            <!-- Left Column - Profile Image & Personal Info -->
            <div class="md:col-span-1">
                <div class="sticky top-6">
                    <div class="rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                        <img src="${profilePath}" 
                             alt="${person.name}" 
                             class="w-full h-auto"
                             onerror="this.src='https://via.placeholder.com/500x750/333/666?text=No+Image'">
                    </div>
                    
                    <div class="mt-6 bg-gray-800 rounded-xl p-5">
                        <h3 class="text-lg font-bold mb-4 flex items-center">
                            <i class="fas fa-info-circle text-netflix-red mr-2"></i>
                            Personal Info
                        </h3>
                        
                        <div class="space-y-4">
                            <div>
                                <p class="text-gray-400 text-xs uppercase tracking-wider">Known For</p>
                                <p class="font-medium">${person.known_for_department || 'Acting'}</p>
                            </div>
                            
                            <div>
                                <p class="text-gray-400 text-xs uppercase tracking-wider">Gender</p>
                                <p class="font-medium">${formatGender(person.gender)}</p>
                            </div>
                            
                            <div>
                                <p class="text-gray-400 text-xs uppercase tracking-wider">Birthday</p>
                                <p class="font-medium">${birthDate}</p>
                                ${age ? `<p class="text-sm text-gray-400">${age} years old</p>` : ''}
                            </div>
                            
                            ${deathDate ? `
                                <div>
                                    <p class="text-gray-400 text-xs uppercase tracking-wider">Died</p>
                                    <p class="font-medium">${deathDate}</p>
                                </div>
                            ` : ''}
                            
                            ${person.place_of_birth ? `
                                <div>
                                    <p class="text-gray-400 text-xs uppercase tracking-wider">Place of Birth</p>
                                    <p class="font-medium">${person.place_of_birth}</p>
                                </div>
                            ` : ''}
                            
                            <div class="grid grid-cols-2 gap-3 pt-2">
                                <div class="bg-gray-900 rounded-lg p-3 text-center">
                                    <div class="text-2xl font-bold text-netflix-red">${movies.length}</div>
                                    <div class="text-xs text-gray-400">Movies</div>
                                </div>
                                <div class="bg-gray-900 rounded-lg p-3 text-center">
                                    <div class="text-2xl font-bold text-netflix-red">${tvShows.length}</div>
                                    <div class="text-xs text-gray-400">TV Shows</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    ${person.homepage ? `
                        <div class="mt-4">
                            <a href="${person.homepage}" 
                               target="_blank" 
                               class="block w-full bg-gray-800 text-white text-center py-3 rounded-lg hover:bg-gray-700 transition flex items-center justify-center">
                                <i class="fas fa-globe mr-2"></i>
                                Official Website
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
            
      
            <div class="md:col-span-2">
                <h2 class="text-3xl md:text-4xl font-bold mb-2">${person.name}</h2>
                
                <!-- Biography -->
                <div class="mb-8">
                    <h3 class="text-xl font-bold mb-3 flex items-center">
                        <i class="fas fa-book-open text-netflix-red mr-2"></i>
                        Biography
                    </h3>
                    <div class="bg-gray-800 rounded-xl p-5">
                        <p class="text-gray-300 leading-relaxed text-sm md:text-base">
                            ${person.biography ? formatBiography(person.biography) : 'No biography available.'}
                        </p>
                    </div>
                </div>
                
                <!-- Known For Movies -->
                ${movies.length > 0 ? `
                    <div class="mb-8">
                        <h3 class="text-xl font-bold mb-3 flex items-center">
                            <i class="fas fa-film text-netflix-red mr-2"></i>
                            Filmography - Movies
                        </h3>
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            ${movies.map(movie => createCreditCard(movie, 'movie')).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Known For TV Shows -->
                ${tvShows.length > 0 ? `
                    <div class="mb-8">
                        <h3 class="text-xl font-bold mb-3 flex items-center">
                            <i class="fas fa-tv text-netflix-red mr-2"></i>
                            Filmography - TV Shows
                        </h3>
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            ${tvShows.map(show => createCreditCard(show, 'tv')).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${movies.length === 0 && tvShows.length === 0 ? `
                    <div class="bg-gray-800 rounded-xl p-8 text-center">
                        <i class="fas fa-video-slash text-4xl text-gray-600 mb-3"></i>
                        <p class="text-gray-400">No known credits available</p>
                    </div>
                ` : ''}
                
                <p class="text-sm text-gray-400 mt-4 flex items-center">
                    <i class="fas fa-info-circle mr-2 text-netflix-red"></i>
                    Click on any movie or TV show to view details and streaming options
                </p>
            </div>
        </div>
    `;
}

function createCreditCard(credit, mediaType) {
    const title = credit.title || credit.name;
    const year = credit.release_date?.split('-')[0] || credit.first_air_date?.split('-')[0] || 'N/A';
    const posterPath = credit.poster_path 
        ? `${TMDB_IMAGE_BASE}/w185${credit.poster_path}`
        : 'https://via.placeholder.com/185x278/333/666?text=No+Poster';
    const character = credit.character || 'Unknown Role';
    const rating = credit.vote_average ? credit.vote_average.toFixed(1) : 'N/A';
    
    return `
        <div class="credit-card bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
             onclick="openMovieModal(${credit.id}, '${mediaType}')">
            <div class="relative">
                <div class="aspect-[2/3] bg-gray-700">
                    <img src="${posterPath}" 
                         alt="${title}"
                         class="w-full h-full object-cover"
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/185x278/333/666?text=No+Poster'">
                </div>
                <div class="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs">
                    <i class="fas fa-star text-yellow-400 mr-1"></i>
                    ${rating}
                </div>
            </div>
            <div class="p-3">
                <h4 class="font-bold text-sm mb-1 line-clamp-2">${title}</h4>
                <p class="text-xs text-gray-400 mb-1">${year}</p>
                <p class="text-xs text-gray-500 truncate" title="${character}">
                    <span class="text-gray-400">as</span> ${character}
                </p>
            </div>
        </div>
    `;
}

function closePersonModalHandler() {
    const modal = document.getElementById('personModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatGender(gender) {
    switch(gender) {
        case 1: return 'Female';
        case 2: return 'Male';
        default: return 'Not Specified';
    }
}

function calculateAge(birthday, deathday = null) {
    const birthDate = new Date(birthday);
    const endDate = deathday ? new Date(deathday) : new Date();
    let age = endDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = endDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

function formatBiography(biography) {
    if (biography.length > 1000) {
        return biography.substring(0, 1000) + '...';
    }
    return biography;
}

function generatePeopleSkeletons(count = 12) {
    let skeletons = '';
    for (let i = 0; i < count; i++) {
        skeletons += `
            <div class="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
                <div class="aspect-[2/3] bg-gray-700"></div>
                <div class="p-4">
                    <div class="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        `;
    }
    return skeletons;
}

window.openPersonModal = openPersonModal;
window.closePersonModalHandler = closePersonModalHandler;
window.clearPeopleSearch = clearPeopleSearch;
window.loadPopularPeople = loadPopularPeople;
window.searchPeople = searchPeople;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePeopleModule);
} else {
    initializePeopleModule();
}
