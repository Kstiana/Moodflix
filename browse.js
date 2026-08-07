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
            {
                id: 'blackamerican', name: 'Black American Cinema', mediaType: 'movie',
                multiSource: true,

                countryParams: { with_origin_country: 'US' },

                keywordQueries: [
                    'african-american', 'blaxploitation', 'african-american history',
                    'african-american cinema', 'black culture', 'civil rights movement',
                    'racism', 'slavery', 'interracial relationship', 'black cinema', 'hood film',
                    'la rebellion', 'black power movement', 'harlem renaissance', 'segregation',
                    'anti-black racism', 'black lives matter', 'urban cinema', 'colorism'
                ],

                companyQueries: [
                    'Tyler Perry Studios', 'Monkeypaw Productions', 'Will Packer Productions',
                    'Rainforest Films', 'Codeblack Films', 'Array Releasing',
                    '40 Acres and a Mule Filmworks', 'MACRO', 'Harpo Films',
                    'Overbrook Entertainment', 'SpringHill Entertainment', 'Hidden Empire Film Group',
                    'BET Films', 'State Street Pictures', 'Significant Productions',
                    'HartBeat Productions', 'Flavor Unit Entertainment', 'Artists First',
                    'Jackson Street Entertainment', 'AFFRM', 'Debra Martin Chase Productions',
                    'Confluential Films', 'Simmons Lathan Media Group', 'Def Pictures',
                    'Allen Media Group', 'Entertainment Studios', 'Datari Turner Productions',
                    'Outlier Society Productions', 'JuVee Productions', 'Westbrook Studios',
                    'Hillman Grad Productions', 'Proximity Media', 'Hoorae Media',
                    'Lee Daniels Entertainment', 'Homegrown Pictures', 'Micheaux Film Corporation',
                    'Amblin Partners', 'Keri Productions', 'Barwood Films'
                ],

                peopleQueries: [
                    'Spike Lee', 'Tyler Perry', 'Ryan Coogler', 'Jordan Peele', 'Ava DuVernay',
                    'Barry Jenkins', 'John Singleton', 'F. Gary Gray', 'Malcolm D. Lee',
                    'Gina Prince-Bythewood', 'Lee Daniels', 'George Tillman Jr.', 'Antoine Fuqua',
                    'Reginald Hudlin', 'Robert Townsend', 'Mario Van Peebles', 'Carl Franklin',
                    'Kasi Lemmons', 'Tim Story', 'Kenya Barris', 'Deon Taylor', 'Debbie Allen',
                    'Julie Dash', 'Charles Burnett', 'Bill Duke', 'Rusty Cundieff', 'Darnell Martin',
                    'Cheryl Dunye', 'Dee Rees', 'Nate Parker', 'Rick Famuyiwa', 'Justin Simien',
                    'Terence Nance', 'Nia DaCosta', 'Cord Jefferson', 'RaMell Ross', 'Radha Blank',
                    'Stella Meghie', 'Melina Matsoukas', 'Salim Akil', 'Mara Brock Akil',
                    'Debra Martin Chase', 'Lena Waithe', 'Issa Rae', 'Oscar Micheaux', 'Gordon Parks',
                    'Melvin Van Peebles', 'Euzhan Palcy', 'Albert Hughes', 'Allen Hughes',
                    'Shaka King', 'Blitz Bazawule', 'George C. Wolfe', 'Boots Riley', 'Steve McQueen',
                    'Denzel Washington', 'Samuel L. Jackson', 'Will Smith', 'Jamie Foxx',
                    'Michael B. Jordan', 'Kevin Hart', 'Eddie Murphy', 'Chris Tucker', 'Chris Rock',
                    'Ice Cube', 'Forest Whitaker', 'Don Cheadle', 'Morris Chestnut', 'Omar Epps',
                    'Larenz Tate', 'Taye Diggs', 'Terrence Howard', 'Mekhi Phifer',
                    'Cuba Gooding Jr.', 'Ving Rhames', 'Marlon Wayans', 'Shawn Wayans',
                    'Keenan Ivory Wayans', 'Damon Wayans', 'Mike Epps', 'Cedric the Entertainer',
                    'Martin Lawrence', 'Anthony Mackie', 'Chadwick Boseman', 'Wesley Snipes',
                    'Richard Roundtree', 'Yahya Abdul-Mateen II', 'Jonathan Majors', 'Daniel Kaluuya',
                    'Lakeith Stanfield', 'Colman Domingo', 'Sterling K. Brown', 'Mahershala Ali',
                    'Trevante Rhodes', 'André Holland', 'John Boyega', 'Idris Elba',
                    'Laurence Fishburne', 'Delroy Lindo', 'Giancarlo Esposito', 'Blair Underwood',
                    'Boris Kodjoe', 'Michael Ealy', 'Jesse Williams', 'Rockmond Dunbar',
                    'Hill Harper', 'Isaiah Washington', 'Malcolm-Jamal Warner', 'LeVar Burton',
                    'Keith David', 'Danny Glover', 'Anthony Anderson', 'David Alan Grier',
                    'Sidney Poitier', 'Harry Belafonte', 'Billy Dee Williams', 'Bernie Mac',
                    'James Earl Jones', 'Ossie Davis', 'Morgan Freeman', 'Louis Gossett Jr.',
                    'Woody Strode', 'Paul Robeson', 'Fred Williamson', 'Richard Pryor', 'Bill Cosby',
                    'Jeffrey Wright', 'John David Washington', 'Leslie Odom Jr.', 'Corey Hawkins',
                    'Brian Tyree Henry', 'Stephan James', 'Damson Idris', 'Aldis Hodge',
                    'Kelvin Harrison Jr.', 'Donald Glover', 'Jharrel Jerome', 'Kingsley Ben-Adir',
                    'Ncuti Gatwa',
                    'Viola Davis', 'Angela Bassett', 'Regina King', 'Regina Hall', 'Taraji P. Henson',
                    'Queen Latifah', 'Halle Berry', 'Sanaa Lathan', 'Tiffany Haddish', 'Nia Long',
                    'Gabrielle Union', 'Kerry Washington', 'Octavia Spencer', 'Aunjanue Ellis-Taylor',
                    'Whoopi Goldberg', 'Loretta Devine', 'Tessa Thompson', 'Keke Palmer',
                    'Jurnee Smollett', 'Amandla Stenberg', 'Dominique Fishback', 'Zoe Saldana',
                    'Meagan Good', 'Lupita Nyong\'o', 'Cynthia Erivo', 'Vivica A. Fox',
                    'Naturi Naughton', 'Vanessa Bell Calloway', 'Alfre Woodard', 'Kimberly Elise',
                    'Ruth Negga', 'Cicely Tyson', 'Ruby Dee', 'Pam Grier', 'Diahann Carroll',
                    'Phylicia Rashad', 'CCH Pounder', 'Vanessa Williams', 'S. Epatha Merkerson',
                    'Wanda Sykes', 'Mo\'Nique', 'Niecy Nash', 'Gabourey Sidibe', 'Danielle Brooks',
                    'Uzo Aduba', 'Aja Naomi King', 'Yvonne Orji', 'Jenifer Lewis', 'Tisha Campbell',
                    'Tichina Arnold', 'Yara Shahidi', 'Marsai Martin', 'Storm Reid', 'Dorothy Dandridge',
                    'Lena Horne', 'Hattie McDaniel', 'Juanita Moore', 'Eartha Kitt', 'Lynn Whitfield',
                    'Jada Pinkett Smith', 'Thandiwe Newton', 'Rosario Dawson', 'Rashida Jones',
                    'Tracee Ellis Ross', 'Zazie Beetz', 'KiKi Layne', 'Teyana Taylor',
                    'Da\'Vine Joy Randolph', 'Lashana Lynch', 'Laura Harrier', 'Thuso Mbedu',
                    'Coco Jones', 'Ayo Edebiri'
                ],

                icon: 'fa-fist-raised'
            },
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
const companyIdCache = {};
const personIdCache = {};

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

async function resolveCompanyId(query) {
    if (companyIdCache[query] !== undefined) return companyIdCache[query];
    try {
        const data = await fetchFromTMDB(`/search/company?query=${encodeURIComponent(query)}`);
        const id = data?.results?.[0]?.id || null;
        companyIdCache[query] = id;
        return id;
    } catch {
        companyIdCache[query] = null;
        return null;
    }
}

async function resolvePersonId(query) {
    if (personIdCache[query] !== undefined) return personIdCache[query];
    try {
        const data = await fetchFromTMDB(`/search/person?query=${encodeURIComponent(query)}`);
        const id = data?.results?.[0]?.id || null;
        personIdCache[query] = id;
        return id;
    } catch {
        personIdCache[query] = null;
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

async function buildCategorySourceGroups(category) {
    const groups = [];

    if (category.keywordQueries && category.keywordQueries.length) {
        const ids = (await Promise.all(category.keywordQueries.map(resolveKeywordId))).filter(Boolean);
        if (ids.length) groups.push(Object.assign({}, category.countryParams || {}, { with_keywords: ids.join('|') }));
    }
    if (category.companyQueries && category.companyQueries.length) {
        const ids = (await Promise.all(category.companyQueries.map(resolveCompanyId))).filter(Boolean);
        if (ids.length) groups.push(Object.assign({}, category.countryParams || {}, { with_companies: ids.join('|') }));
    }
    if (category.peopleQueries && category.peopleQueries.length) {
        const ids = (await Promise.all(category.peopleQueries.map(resolvePersonId))).filter(Boolean);
        if (ids.length) groups.push(Object.assign({}, category.countryParams || {}, { with_people: ids.join('|') }));
    }

    if (groups.length === 0) groups.push(Object.assign({}, category.countryParams || {}));
    return groups;
}

async function discoverMultiSource(mediaType, genreId, filters, page, count, sourceGroups, seenIds) {
    const resultsPerGroup = await Promise.all(
        sourceGroups.map(params => discoverMedia(mediaType, genreId, filters, page, count, params))
    );

    const merged = [];
    resultsPerGroup.flat().forEach(item => {
        if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            merged.push(item);
        }
    });

    merged.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    return merged;
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
            const filters = getFilterState(contextKey);

            if (category.multiSource) {
                const sourceGroups = await buildCategorySourceGroups(category);
                const seenIds = new Set();
                const items = await discoverMultiSource(category.mediaType, activeGenre, filters, 1, 20, sourceGroups, seenIds);
                content.innerHTML = '';
                if (items.length > 0) {
                    const customLoadMore = nextPage => discoverMultiSource(category.mediaType, activeGenre, filters, nextPage, 20, sourceGroups, seenIds);
                    createPageMovieRow(content, category.name, items, category.mediaType, activeGenre, true, {}, contextKey, customLoadMore);
                } else {
                    content.innerHTML = '<div class="text-center text-gray-400 py-12">No titles found for this category yet.</div>';
                }
                return;
            }

            const baseParams = await buildCategoryBaseParams(category);
            const items = await discoverMedia(category.mediaType, activeGenre, filters, 1, 20, baseParams);
            content.innerHTML = '';
            if (items.length > 0) {
                createPageMovieRow(content, category.name, items, category.mediaType, activeGenre, true, baseParams, contextKey);
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
