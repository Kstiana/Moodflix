const FRANCHISES = [
    { id: 'fast-furious', name: 'Fast & Furious', queries: ['Fast & Furious Collection'], icon: 'fa-car-side' },
    { id: 'harry-potter', name: 'Harry Potter', queries: ['Harry Potter Collection'], icon: 'fa-hat-wizard' },
    { id: 'star-wars', name: 'Star Wars', queries: ['Star Wars Collection'], icon: 'fa-jedi' },
    { id: 'john-wick', name: 'John Wick', queries: ['John Wick Collection'], icon: 'fa-gun' },
    { id: 'mission-impossible', name: 'Mission: Impossible', queries: ['Mission: Impossible Collection'], icon: 'fa-mask' },
    { id: 'jurassic', name: 'Jurassic Park / World', queries: ['Jurassic Park Collection', 'Jurassic World Collection'], icon: 'fa-paw' },
    { id: 'toy-story', name: 'Toy Story', queries: ['Toy Story Collection'], icon: 'fa-shapes' },
    { id: 'matrix', name: 'The Matrix', queries: ['The Matrix Collection'], icon: 'fa-code' },
    { id: 'hunger-games', name: 'The Hunger Games', queries: ['The Hunger Games Collection'], icon: 'fa-fire' },
    { id: 'pirates', name: 'Pirates of the Caribbean', queries: ['Pirates of the Caribbean Collection'], icon: 'fa-skull-crossbones' },
    { id: 'xmen', name: 'X-Men', queries: ['X-Men Collection', 'X-Men Origins Collection'], icon: 'fa-people-group' },
    { id: 'avengers', name: 'Avengers / MCU', queries: ['Avengers Collection'], icon: 'fa-shield-halved' },
    { id: 'rocky-creed', name: 'Rocky / Creed', queries: ['Rocky Collection', 'Creed Collection'], icon: 'fa-hand-fist' },
    { id: 'spiderman', name: 'Spider-Man', queries: ['Spider-Man Collection', 'The Amazing Spider-Man Collection'], icon: 'fa-spider' },
    { id: 'batman', name: 'Batman', queries: ['The Dark Knight Collection', 'Batman Collection'], icon: 'fa-mask' },
    { id: 'despicable-me', name: 'Despicable Me', queries: ['Despicable Me Collection'], icon: 'fa-user-ninja' }
];

const collectionCache = {};

async function resolveCollectionParts(franchise) {
    const cacheKey = franchise.id;
    if (collectionCache[cacheKey]) return collectionCache[cacheKey];

    let allParts = [];

    for (const query of franchise.queries) {
        try {
            const searchData = await fetchFromTMDB(`/search/collection?query=${encodeURIComponent(query)}`);
            const collectionId = searchData?.results?.[0]?.id;
            if (!collectionId) continue;

            const collectionData = await fetchFromTMDB(`/collection/${collectionId}`);
            const parts = (collectionData?.parts || []).filter(p => p.release_date);
            allParts = allParts.concat(parts);
        } catch {
            continue;
        }
    }

    const seen = new Set();
    const deduped = allParts.filter(p => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
    });

    deduped.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

    collectionCache[cacheKey] = deduped;
    return deduped;
}

function initializeFranchisesPage() {
    const grid = document.getElementById('franchisesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    FRANCHISES.forEach(franchise => {
        const tile = document.createElement('button');
        tile.className = 'franchise-tile';
        tile.innerHTML = `
            <i class="fas ${franchise.icon}"></i>
            <span>${franchise.name}</span>
        `;
        tile.addEventListener('click', () => openFranchiseModal(franchise));
        grid.appendChild(tile);
    });
}

async function openFranchiseModal(franchise) {
    const existing = document.getElementById('franchiseModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'franchiseModal';
    modal.className = 'country-picker-modal';
    modal.innerHTML = `
        <div class="country-picker-content modal-enter franchise-modal-content">
            <div class="country-picker-header">
                <h3><i class="fas ${franchise.icon}"></i> ${franchise.name}</h3>
                <button id="closeFranchiseModal" class="country-picker-close"><i class="fas fa-times"></i></button>
            </div>
            <div id="franchisePartsBody" class="country-picker-body franchise-parts-body">
                ${generatePageSkeletons(1)}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    function closeModal() {
        modal.remove();
        document.body.style.overflow = 'auto';
    }

    modal.querySelector('#closeFranchiseModal').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    const body = modal.querySelector('#franchisePartsBody');

    try {
        const parts = await resolveCollectionParts(franchise);
        if (parts.length === 0) {
            body.innerHTML = '<div class="text-center text-gray-400 py-12">Could not load this franchise right now.</div>';
            return;
        }

        body.innerHTML = `
            <div class="franchise-parts-list">
                ${parts.map((part, index) => {
                    const posterUrl = part.poster_path
                        ? `${TMDB_IMAGE_BASE}/w185${part.poster_path}`
                        : 'https://placehold.co/185x278/1a1a1a/666?text=No+Poster';
                    const year = part.release_date ? part.release_date.split('-')[0] : 'N/A';
                    return `
                        <button class="franchise-part-item" data-movie-id="${part.id}">
                            <span class="franchise-part-number">${index + 1}</span>
                            <img src="${posterUrl}" alt="${part.title}" class="franchise-part-poster" loading="lazy">
                            <span class="franchise-part-info">
                                <span class="franchise-part-title">${part.title}</span>
                                <span class="franchise-part-year">${year}</span>
                            </span>
                            <i class="fas fa-play franchise-part-play"></i>
                        </button>
                    `;
                }).join('')}
            </div>
        `;

        body.querySelectorAll('.franchise-part-item').forEach(item => {
            item.addEventListener('click', () => {
                const movieId = item.dataset.movieId;
                closeModal();
                openMovieModal(movieId, 'movie');
            });
        });
    } catch {
        body.innerHTML = '<div class="text-center text-gray-400 py-12">Could not load this franchise right now.</div>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeFranchisesPage();
});

window.openFranchiseModal = openFranchiseModal;
