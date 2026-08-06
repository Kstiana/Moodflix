const BROWSE_SECTIONS = [
    {
        section: 'Studios & Brands',
        categories: [
            { id: 'disney', name: 'Disney', mediaType: 'movie', companyId: 2, icon: 'fa-castle' },
            { id: 'pixar', name: 'Pixar', mediaType: 'movie', companyId: 3, icon: 'fa-lightbulb' },
            { id: 'marvel', name: 'Marvel Studios', mediaType: 'movie', companyId: 420, icon: 'fa-bolt' },
            { id: 'dreamworks', name: 'DreamWorks Animation', mediaType: 'movie', companyId: 521, icon: 'fa-dragon' },
            { id: 'warnerbros', name: 'Warner Bros.', mediaType: 'movie', companyId: 174, icon: 'fa-film' },
            { id: 'a24', name: 'A24', mediaType: 'movie', companyId: 41077, icon: 'fa-clapperboard' },
            { id: 'ghibli', name: 'Studio Ghibli', mediaType: 'movie', companyId: 10342, icon: 'fa-wind' },
            { id: 'illumination', name: 'Illumination', mediaType: 'movie', companyId: 6704, icon: 'fa-lightbulb' },
            { id: 'blumhouse', name: 'Blumhouse', mediaType: 'movie', companyId: 3172, icon: 'fa-ghost' },
            { id: 'lucasfilm', name: 'Lucasfilm', mediaType: 'movie', companyId: 1, icon: 'fa-rocket' },
            { id: 'universal', name: 'Universal Pictures', mediaType: 'movie', companyId: 33, icon: 'fa-globe' },
            { id: 'sonyanimation', name: 'Sony Pictures Animation', mediaType: 'movie', companyId: 2251, icon: 'fa-palette' }
        ]
    },
    {
        section: 'Regional & Industry Cinema',
        categories: [
            { id: 'nollywood', name: 'Nollywood', mediaType: 'movie', countryParams: { with_origin_country: 'NG' }, icon: 'fa-earth-africa' },
            { id: 'kdrama', name: 'K-Drama', mediaType: 'tv', countryParams: { with_origin_country: 'KR' }, icon: 'fa-heart' },
            { id: 'kmovie', name: 'Korean Cinema', mediaType: 'movie', countryParams: { with_origin_country: 'KR' }, icon: 'fa-film' },
            { id: 'bollywood', name: 'Bollywood', mediaType: 'movie', countryParams: { with_origin_country: 'IN', with_original_language: 'hi' }, icon: 'fa-music' },
            { id: 'blackamerican', name: 'Black American Cinema', mediaType: 'movie', keywordQuery: 'african-american', countryParams: { with_origin_country: 'US' }, icon: 'fa-fist-raised' },
            { id: 'cdrama', name: 'C-Drama', mediaType: 'tv', countryParams: { with_origin_country: 'CN' }, icon: 'fa-yin-yang' },
            { id: 'anime', name: 'Anime', mediaType: 'tv', genreId: 16, countryParams: { with_origin_country: 'JP' }, icon: 'fa-star' },
            { id: 'british', name: 'British Cinema', mediaType: 'movie', countryParams: { with_origin_country: 'GB' }, icon: 'fa-crown' },
            { id: 'latinamerican', name: 'Latin American Cinema', mediaType: 'movie', countryParams: { with_origin_country: 'MX|BR|AR|CO|CL' }, icon: 'fa-sun' },
            { id: 'french', name: 'French Cinema', mediaType: 'movie', countryParams: { with_origin_country: 'FR' }, icon: 'fa-wine-glass' },
            { id: 'turkish', name: 'Turkish Drama', mediaType: 'tv', countryParams: { with_origin_country: 'TR' }, icon: 'fa-mosque' },
            { id: 'telenovela', name: 'Telenovela', mediaType: 'tv', countryParams: { with_origin_country: 'MX|BR|CO|VE', with_original_language: 'es' }, icon: 'fa-heart-circle' }
        ]
    }
];

const keywordIdCache = {};

async function resolveKeywordId(query) {
    if (keywordIdCache[query] !== undefined) return keywordIdCache[query];
    try {
        const data = await fetchFromTMDB(`/search/keyword?query=${encodeURIComponent(query)}`);
        const id = data?.results?.[0]?.id || null;
        keywordIdCache[query] = id;
        return id;
    } catch {
        keywordIdCache[query] = null;
        return null;
    }
}

async function buildCategoryBaseParams(category) {
    const params = Object.assign({}, category.countryParams || {});
    if (category.companyId) params.with_companies = category.companyId;
    if (category.genreId) params.with_genres = category.genreId;
    if (category.keywordQuery) {
        const keywordId = await resolveKeywordId(category.keywordQuery);
        if (keywordId) params.with_keywords = keywordId;
    }
    return params;
}

function findBrowseCategory(id) {
    for (const section of BROWSE_SECTIONS) {
        const found = section.categories.find(c => c.id === id);
        if (found) return found;
    }
    return null;
}

function openBrowseModal() {
    const existing = document.getElementById('browseModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'browseModal';
    modal.className = 'country-picker-modal';

    const sectionsHtml = BROWSE_SECTIONS.map(section => `
        <div class="browse-section">
            <h4 class="browse-section-title">${section.section}</h4>
            <div class="browse-grid">
                ${section.categories.map(cat => `
                    <button class="browse-tile" data-category-id="${cat.id}">
                        <i class="fas ${cat.icon}"></i>
                        <span>${cat.name}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `).join('');

    modal.innerHTML = `
        <div class="country-picker-content modal-enter browse-modal-content">
            <div class="country-picker-header">
                <h3><i class="fas fa-compass"></i> Browse</h3>
                <button id="closeBrowseModal" class="country-picker-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="country-picker-body browse-modal-body">${sectionsHtml}</div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    function closeModal() {
        modal.remove();
        document.body.style.overflow = 'auto';
    }

    modal.querySelector('#closeBrowseModal').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    modal.querySelectorAll('.browse-tile').forEach(tile => {
        tile.addEventListener('click', () => {
            const categoryId = tile.dataset.categoryId;
            closeModal();
            openBrowseCategoryPage(categoryId);
        });
    });
}

async function openBrowseCategoryPage(categoryId) {
    const category = findBrowseCategory(categoryId);
    if (!category) return;

    switchPage('browseCategoryPage');

    const titleEl = document.getElementById('browseCategoryTitle');
    const genreBar = document.getElementById('browseCategoryGenreBar');
    const filterBar = document.getElementById('browseCategoryFilterBar');
    const content = document.getElementById('browseCategoryContent');

    if (titleEl) titleEl.textContent = category.name;
    if (content) content.innerHTML = generatePageSkeletons(2);
    if (genreBar) genreBar.innerHTML = '';

    const contextKey = `browse_${category.id}`;
    const genres = category.mediaType === 'tv' ? TV_GENRES : MOVIE_GENRES;
    let activeGenre = category.genreId || 0;

    if (genreBar) {
        buildGenrePillsGeneric(genreBar, genres, activeGenre, genreId => {
            activeGenre = genreId;
            loadCategory();
        });
    }

    if (filterBar) {
        buildFilterBar(filterBar, category.mediaType, () => loadCategory(), {
            contextKey,
            hideCountry: !!category.countryParams
        });
    }

    async function loadCategory() {
        if (content) content.innerHTML = generatePageSkeletons(2);
        try {
            const baseParams = await buildCategoryBaseParams(category);
            const filters = getFilterState(contextKey);
            const items = await discoverMedia(category.mediaType, activeGenre, filters, 1, 20, baseParams);
            content.innerHTML = '';
            if (items.length > 0) {
                createPageMovieRow(content, category.name, items, category.mediaType, activeGenre, true, baseParams);
            } else {
                content.innerHTML = '<div class="text-center text-gray-400 py-12">No titles found for this category yet.</div>';
            }
        } catch {
            content.innerHTML = '<div class="text-center text-gray-400 py-12">Failed to load this category. Please try again.</div>';
        }
    }

    loadCategory();
}

function buildGenrePillsGeneric(container, genres, activeId, onSelect) {
    if (!container) return;
    container.innerHTML = '';
    genres.forEach(genre => {
        const pill = document.createElement('button');
        pill.className = `genre-pill${genre.id === activeId ? ' active' : ''}`;
        pill.textContent = genre.name;
        pill.dataset.genreId = genre.id;
        pill.addEventListener('click', () => {
            container.querySelectorAll('.genre-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            onSelect(genre.id);
        });
        container.appendChild(pill);
    });
}

window.openBrowseModal = openBrowseModal;
window.openBrowseCategoryPage = openBrowseCategoryPage;
