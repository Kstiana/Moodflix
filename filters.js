const CONTINENTS = [
    {
        name: 'Africa',
        countries: [
            { code: 'NG', name: 'Nigeria' }, { code: 'ZA', name: 'South Africa' }, { code: 'EG', name: 'Egypt' },
            { code: 'KE', name: 'Kenya' }, { code: 'GH', name: 'Ghana' }, { code: 'MA', name: 'Morocco' },
            { code: 'DZ', name: 'Algeria' }, { code: 'TN', name: 'Tunisia' }, { code: 'ET', name: 'Ethiopia' },
            { code: 'SN', name: 'Senegal' }, { code: 'CI', name: "Ivory Coast" }, { code: 'CM', name: 'Cameroon' },
            { code: 'TZ', name: 'Tanzania' }, { code: 'UG', name: 'Uganda' }, { code: 'ZW', name: 'Zimbabwe' },
            { code: 'ZM', name: 'Zambia' }, { code: 'RW', name: 'Rwanda' }, { code: 'ML', name: 'Mali' },
            { code: 'BF', name: 'Burkina Faso' }, { code: 'CD', name: 'DR Congo' }, { code: 'CG', name: 'Congo' },
            { code: 'AO', name: 'Angola' }, { code: 'MZ', name: 'Mozambique' }, { code: 'BW', name: 'Botswana' },
            { code: 'NA', name: 'Namibia' }, { code: 'LY', name: 'Libya' }, { code: 'SD', name: 'Sudan' },
            { code: 'SO', name: 'Somalia' }, { code: 'MW', name: 'Malawi' }, { code: 'BJ', name: 'Benin' },
            { code: 'TG', name: 'Togo' }, { code: 'NE', name: 'Niger' }, { code: 'TD', name: 'Chad' },
            { code: 'GA', name: 'Gabon' }, { code: 'GN', name: 'Guinea' }, { code: 'SL', name: 'Sierra Leone' },
            { code: 'LR', name: 'Liberia' }, { code: 'MG', name: 'Madagascar' }, { code: 'MU', name: 'Mauritius' },
            { code: 'ER', name: 'Eritrea' }
        ]
    },
    {
        name: 'Asia',
        countries: [
            { code: 'KR', name: 'South Korea' }, { code: 'JP', name: 'Japan' }, { code: 'CN', name: 'China' },
            { code: 'IN', name: 'India' }, { code: 'HK', name: 'Hong Kong' }, { code: 'TW', name: 'Taiwan' },
            { code: 'TH', name: 'Thailand' }, { code: 'PH', name: 'Philippines' }, { code: 'ID', name: 'Indonesia' },
            { code: 'MY', name: 'Malaysia' }, { code: 'VN', name: 'Vietnam' }, { code: 'SG', name: 'Singapore' },
            { code: 'PK', name: 'Pakistan' }, { code: 'BD', name: 'Bangladesh' }, { code: 'LK', name: 'Sri Lanka' },
            { code: 'NP', name: 'Nepal' }, { code: 'IR', name: 'Iran' }, { code: 'IQ', name: 'Iraq' },
            { code: 'IL', name: 'Israel' }, { code: 'TR', name: 'Turkey' }, { code: 'SA', name: 'Saudi Arabia' },
            { code: 'AE', name: 'United Arab Emirates' }, { code: 'QA', name: 'Qatar' }, { code: 'KW', name: 'Kuwait' },
            { code: 'LB', name: 'Lebanon' }, { code: 'JO', name: 'Jordan' }, { code: 'AF', name: 'Afghanistan' },
            { code: 'KZ', name: 'Kazakhstan' }, { code: 'UZ', name: 'Uzbekistan' }, { code: 'MN', name: 'Mongolia' },
            { code: 'MM', name: 'Myanmar' }, { code: 'KH', name: 'Cambodia' }, { code: 'LA', name: 'Laos' },
            { code: 'BT', name: 'Bhutan' }, { code: 'KP', name: 'North Korea' }
        ]
    },
    {
        name: 'Europe',
        countries: [
            { code: 'GB', name: 'United Kingdom' }, { code: 'FR', name: 'France' }, { code: 'DE', name: 'Germany' },
            { code: 'IT', name: 'Italy' }, { code: 'ES', name: 'Spain' }, { code: 'RU', name: 'Russia' },
            { code: 'NL', name: 'Netherlands' }, { code: 'BE', name: 'Belgium' }, { code: 'SE', name: 'Sweden' },
            { code: 'NO', name: 'Norway' }, { code: 'DK', name: 'Denmark' }, { code: 'FI', name: 'Finland' },
            { code: 'PL', name: 'Poland' }, { code: 'IE', name: 'Ireland' }, { code: 'PT', name: 'Portugal' },
            { code: 'GR', name: 'Greece' }, { code: 'AT', name: 'Austria' }, { code: 'CH', name: 'Switzerland' },
            { code: 'CZ', name: 'Czech Republic' }, { code: 'HU', name: 'Hungary' }, { code: 'RO', name: 'Romania' },
            { code: 'UA', name: 'Ukraine' }, { code: 'IS', name: 'Iceland' }, { code: 'HR', name: 'Croatia' },
            { code: 'RS', name: 'Serbia' }, { code: 'BG', name: 'Bulgaria' }, { code: 'SK', name: 'Slovakia' },
            { code: 'SI', name: 'Slovenia' }, { code: 'EE', name: 'Estonia' }, { code: 'LV', name: 'Latvia' },
            { code: 'LT', name: 'Lithuania' }, { code: 'LU', name: 'Luxembourg' }, { code: 'BY', name: 'Belarus' },
            { code: 'GE', name: 'Georgia' }, { code: 'AM', name: 'Armenia' }
        ]
    },
    {
        name: 'North America',
        countries: [
            { code: 'US', name: 'United States' }, { code: 'CA', name: 'Canada' }, { code: 'MX', name: 'Mexico' },
            { code: 'CU', name: 'Cuba' }, { code: 'JM', name: 'Jamaica' }, { code: 'DO', name: 'Dominican Republic' },
            { code: 'PR', name: 'Puerto Rico' }, { code: 'CR', name: 'Costa Rica' }, { code: 'PA', name: 'Panama' },
            { code: 'GT', name: 'Guatemala' }, { code: 'HN', name: 'Honduras' }, { code: 'HT', name: 'Haiti' },
            { code: 'TT', name: 'Trinidad and Tobago' }, { code: 'BS', name: 'Bahamas' }, { code: 'BZ', name: 'Belize' }
        ]
    },
    {
        name: 'South America',
        countries: [
            { code: 'BR', name: 'Brazil' }, { code: 'AR', name: 'Argentina' }, { code: 'CL', name: 'Chile' },
            { code: 'CO', name: 'Colombia' }, { code: 'PE', name: 'Peru' }, { code: 'VE', name: 'Venezuela' },
            { code: 'UY', name: 'Uruguay' }, { code: 'EC', name: 'Ecuador' }, { code: 'BO', name: 'Bolivia' },
            { code: 'PY', name: 'Paraguay' }, { code: 'GY', name: 'Guyana' }, { code: 'SR', name: 'Suriname' }
        ]
    },
    {
        name: 'Oceania',
        countries: [
            { code: 'AU', name: 'Australia' }, { code: 'NZ', name: 'New Zealand' }, { code: 'FJ', name: 'Fiji' },
            { code: 'PG', name: 'Papua New Guinea' }, { code: 'WS', name: 'Samoa' }, { code: 'TO', name: 'Tonga' },
            { code: 'SB', name: 'Solomon Islands' }, { code: 'VU', name: 'Vanuatu' }, { code: 'NC', name: 'New Caledonia' },
            { code: 'PF', name: 'French Polynesia' }
        ]
    }
];

const SORT_OPTIONS = [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'primary_release_date.desc', label: 'Newest First' },
    { value: 'vote_average.desc', label: 'Top Rated' },
    { value: 'original_title.asc', label: 'A-Z' }
];

const TV_SORT_OPTIONS = [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'first_air_date.desc', label: 'Newest First' },
    { value: 'vote_average.desc', label: 'Top Rated' },
    { value: 'name.asc', label: 'A-Z' }
];

function defaultFilterState() {
    return { year: null, country: null, rating: null, sort: 'popularity.desc' };
}

const pageFilters = {
    movie: defaultFilterState(),
    tv: defaultFilterState()
};

function getFilterState(key) {
    if (!pageFilters[key]) pageFilters[key] = defaultFilterState();
    return pageFilters[key];
}

function isFiltersActive(filters) {
    if (!filters) return false;
    return !!(filters.year || filters.country || filters.rating || (filters.sort && filters.sort !== 'popularity.desc'));
}

function buildYearOptions() {
    const current = new Date().getFullYear();
    const years = [];
    for (let y = current + 1; y >= 1950; y--) years.push(y);
    return years;
}

function buildFilterBar(container, mediaType, onChange, options = {}) {
    if (!container) return;
    container.innerHTML = '';
    container.className = 'filter-bar';

    const contextKey = options.contextKey || mediaType;
    const filters = getFilterState(contextKey);
    const sortOptions = mediaType === 'tv' ? TV_SORT_OPTIONS : SORT_OPTIONS;
    const years = buildYearOptions();

    const yearSelect = document.createElement('select');
    yearSelect.className = 'filter-select';
    yearSelect.innerHTML = `<option value="">Any Year</option>` + years.map(y => `<option value="${y}">${y}</option>`).join('');
    yearSelect.value = filters.year || '';
    yearSelect.addEventListener('change', () => {
        filters.year = yearSelect.value || null;
        buildFilterBar(container, mediaType, onChange, options);
        onChange();
    });

    const ratingSelect = document.createElement('select');
    ratingSelect.className = 'filter-select';
    ratingSelect.innerHTML = `
        <option value="">Any Rating</option>
        <option value="9">9+ Rating</option>
        <option value="8">8+ Rating</option>
        <option value="7">7+ Rating</option>
        <option value="6">6+ Rating</option>
    `;
    ratingSelect.value = filters.rating || '';
    ratingSelect.addEventListener('change', () => {
        filters.rating = ratingSelect.value || null;
        buildFilterBar(container, mediaType, onChange, options);
        onChange();
    });

    const sortSelect = document.createElement('select');
    sortSelect.className = 'filter-select';
    sortSelect.innerHTML = sortOptions.map(s => `<option value="${s.value}">${s.label}</option>`).join('');
    sortSelect.value = filters.sort;
    sortSelect.addEventListener('change', () => {
        filters.sort = sortSelect.value;
        buildFilterBar(container, mediaType, onChange, options);
        onChange();
    });

    container.appendChild(yearSelect);
    container.appendChild(ratingSelect);
    container.appendChild(sortSelect);

    if (!options.hideCountry) {
        const countryBtn = document.createElement('button');
        countryBtn.className = 'filter-select filter-country-btn';
        countryBtn.textContent = filters.country ? countryNameFromCode(filters.country) : 'Any Country';
        countryBtn.addEventListener('click', () => {
            openCountryPicker(mediaType, code => {
                filters.country = code;
                buildFilterBar(container, mediaType, onChange, options);
                onChange();
            });
        });
        container.appendChild(countryBtn);
    }

    if (isFiltersActive(filters)) {
        const clearBtn = document.createElement('button');
        clearBtn.className = 'filter-clear-btn';
        clearBtn.innerHTML = '<i class="fas fa-times"></i> Clear Filters';
        clearBtn.addEventListener('click', () => {
            Object.assign(filters, defaultFilterState());
            buildFilterBar(container, mediaType, onChange, options);
            onChange();
        });
        container.appendChild(clearBtn);
    }
}

function countryNameFromCode(code) {
    for (const continent of CONTINENTS) {
        const found = continent.countries.find(c => c.code === code);
        if (found) return found.name;
    }
    return code;
}

function openCountryPicker(mediaType, onSelect) {
    const existing = document.getElementById('countryPickerModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'countryPickerModal';
    modal.className = 'country-picker-modal';
    modal.innerHTML = `
        <div class="country-picker-content modal-enter">
            <div class="country-picker-header">
                <h3 id="countryPickerTitle"><i class="fas fa-globe-africa"></i> Select a Continent</h3>
                <button id="closeCountryPicker" class="country-picker-close"><i class="fas fa-times"></i></button>
            </div>
            <div id="countryPickerBody" class="country-picker-body"></div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    const body = modal.querySelector('#countryPickerBody');
    const title = modal.querySelector('#countryPickerTitle');

    function renderContinents() {
        title.innerHTML = '<i class="fas fa-globe-africa"></i> Select a Continent';
        body.innerHTML = '';
        const anyBtn = document.createElement('button');
        anyBtn.className = 'continent-tile';
        anyBtn.innerHTML = `<i class="fas fa-earth-americas"></i><span>Any Country</span>`;
        anyBtn.addEventListener('click', () => { onSelect(null); closeModal(); });
        body.appendChild(anyBtn);

        CONTINENTS.forEach(continent => {
            const tile = document.createElement('button');
            tile.className = 'continent-tile';
            tile.innerHTML = `<i class="fas fa-map-marked-alt"></i><span>${continent.name}</span>`;
            tile.addEventListener('click', () => renderCountries(continent));
            body.appendChild(tile);
        });
    }

    function renderCountries(continent) {
        title.innerHTML = `<button id="backToContinents" class="country-back-btn"><i class="fas fa-arrow-left"></i></button> ${continent.name}`;
        body.innerHTML = '';
        body.className = 'country-picker-body country-list-view';
        continent.countries.forEach(country => {
            const item = document.createElement('button');
            item.className = 'country-item';
            item.textContent = country.name;
            item.addEventListener('click', () => { onSelect(country.code); closeModal(); });
            body.appendChild(item);
        });
        document.getElementById('backToContinents').addEventListener('click', () => {
            body.className = 'country-picker-body';
            renderContinents();
        });
    }

    function closeModal() {
        modal.remove();
        document.body.style.overflow = 'auto';
    }

    modal.querySelector('#closeCountryPicker').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    renderContinents();
}

function buildDiscoverEndpoint(mediaType, genreId, filters, page = 1, baseParams = {}) {
    const path = mediaType === 'tv' ? '/discover/tv' : '/discover/movie';
    const params = new URLSearchParams();
    params.set('sort_by', (filters && filters.sort) || 'popularity.desc');
    params.set('page', page);

    if (genreId) params.set('with_genres', genreId);
    if (filters && filters.year) {
        params.set(mediaType === 'tv' ? 'first_air_date_year' : 'primary_release_year', filters.year);
    }
    if (filters && filters.rating) {
        params.set('vote_average.gte', filters.rating);
        params.set('vote_count.gte', 20);
    }
    if (filters && filters.country) {
        params.set('with_origin_country', filters.country);
    }

    Object.keys(baseParams || {}).forEach(key => {
        params.set(key, baseParams[key]);
    });

    return `${path}?${params.toString()}`;
}

async function discoverMedia(mediaType, genreId, filters, page = 1, count = 20, baseParams = {}) {
    const endpoint = buildDiscoverEndpoint(mediaType, genreId, filters, page, baseParams);
    const data = await fetchFromTMDB(endpoint);
    return (data?.results || []).slice(0, count);
}

window.CONTINENTS = CONTINENTS;
window.pageFilters = pageFilters;
window.getFilterState = getFilterState;
window.isFiltersActive = isFiltersActive;
window.buildFilterBar = buildFilterBar;
window.openCountryPicker = openCountryPicker;
window.buildDiscoverEndpoint = buildDiscoverEndpoint;
window.discoverMedia = discoverMedia;
window.defaultFilterState = defaultFilterState;
window.countryNameFromCode = countryNameFromCode;
