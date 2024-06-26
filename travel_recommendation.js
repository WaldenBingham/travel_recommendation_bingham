function thankyou(){
    alert('Thank you for contacting us!')
}


document.addEventListener('DOMContentLoaded', function () {
    const btnSearch = document.getElementById('btnSearch');
    const btnClear = document.getElementById('btnClear');
    const inputSearch = document.getElementById('SearchDestination');
    const searchResultsContainer = document.getElementById('searchresult');

    btnSearch.addEventListener('click', function () {
        const searchTerm = inputSearch.value.trim().toLowerCase();
        if (searchTerm) {
            fetch('travel_recommendation_api.json')
                .then(response => response.json())
                .then(data => {
                    const results = filterResults(data, searchTerm);

                    displayResults(results, searchResultsContainer);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    });

    btnClear.addEventListener('click', function () {
        inputSearch.value = '';
        clearResults(searchResultsContainer);
    });

    function filterResults(data, searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        const beachResults = data.beaches.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );

        const templeResults = data.temples.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );

        const countryResults = getCountries(data).filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );

        // Combine all results into a single array
        return [...beachResults, ...templeResults, ...countryResults];
    }

    function getCountries(data) {
        let countries = [];
        data.countries.forEach(country => {
            countries.push({
                name: country.name,
                description: '', // Country doesn't have a description in the provided JSON
                imageUrl: '' // Country doesn't have an imageUrl in the provided JSON
            });

            // Add cities within the country to recommendations
            country.cities.forEach(city => {
                countries.push({
                    name: city.name,
                    description: city.description,
                    imageUrl: city.imageUrl
                });
            });
        });
        return countries;
    }

    function displayResults(results, container) {
        container.innerHTML = '';

        if (results.length === 0) {
            container.innerHTML = '<p>No results found.</p>';
            return;
        }

        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.classList.add('result');
            resultElement.innerHTML = `
                <h4>${result.name}</h4>
                <p>${result.description}</p>
                <img src="${result.imageUrl}" alt="${result.name}">
            `;
            container.appendChild(resultElement);
        });
    }

    function clearResults(container) {
        container.innerHTML = '';
    }
});
