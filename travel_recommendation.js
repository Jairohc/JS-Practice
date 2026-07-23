let travelData = null;

// Task 6: Cargar el archivo JSON
fetch('./travel_recommendation_api.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        travelData = data;
        console.log("Fetched Travel Data successfully:", travelData);
    })
    .catch(error => {
        console.error("Error fetching recommendation data:", error);
    });

// Elementos DOM
const searchInput = document.getElementById('searchInput');
const btnSearch = document.getElementById('btnSearch');
const btnReset = document.getElementById('btnReset');
const resultsContainer = document.getElementById('resultsContainer');

// Task 10: Formateo de fecha y hora local
function getFormattedTime(timeZone) {
    if (!timeZone) return '';
    const options = { 
        timeZone: timeZone, 
        hour12: true, 
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric' 
    };
    return new Date().toLocaleTimeString('en-US', options);
}

// Task 8: Renderizar recomendaciones en el DOM
function displayResults(places) {
    if (!resultsContainer) return;
    resultsContainer.innerHTML = '';

    if (!places || places.length === 0) {
        resultsContainer.innerHTML = `<p class="no-results">No recommendations found matching your search.</p>`;
        return;
    }

    places.forEach(place => {
        const localTime = getFormattedTime(place.timeZone);

        const card = document.createElement('div');
        card.classList.add('result-card');

        card.innerHTML = `
            <img src="${place.imageUrl}" alt="${place.name}">
            <div class="card-body">
                <h3>${place.name}</h3>
                ${localTime ? `<p class="time-badge"><i class="fas fa-clock"></i> Current Time: ${localTime}</p>` : ''}
                <p>${place.description}</p>
                <button class="btn btn-visit">Visit</button>
            </div>
        `;

        resultsContainer.appendChild(card);
    });
}

// Task 7: Lógica de búsqueda flexible
function handleSearch() {
    if (!travelData) {
        console.error("Data has not loaded yet.");
        return;
    }

    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let matches = [];

    if (!keyword) {
        if (resultsContainer) resultsContainer.innerHTML = '';
        return;
    }

    if (keyword === 'beach' || keyword === 'beaches') {
        matches = travelData.beaches;
    } else if (keyword === 'temple' || keyword === 'temples') {
        matches = travelData.temples;
    } else if (keyword === 'country' || keyword === 'countries') {
        matches = travelData.countries.flatMap(country => country.cities);
    } else {
        const matchingCountry = travelData.countries.find(
            country => country.name.toLowerCase() === keyword
        );

        if (matchingCountry) {
            matches = matchingCountry.cities;
        } else {
            const matchedBeaches = travelData.beaches.filter(item => 
                item.name.toLowerCase().includes(keyword)
            );
            const matchedTemples = travelData.temples.filter(item => 
                item.name.toLowerCase().includes(keyword)
            );
            const matchedCities = travelData.countries.flatMap(c => c.cities).filter(item => 
                item.name.toLowerCase().includes(keyword)
            );

            matches = [...matchedBeaches, ...matchedTemples, ...matchedCities];
        }
    }

    displayResults(matches);
}

// Task 9: Función para limpiar resultados
function clearSearch() {
    if (searchInput) searchInput.value = '';
    if (resultsContainer) resultsContainer.innerHTML = '';
}

// Event Listeners
if (btnSearch) btnSearch.addEventListener('click', handleSearch);
if (btnReset) btnReset.addEventListener('click', clearSearch);
