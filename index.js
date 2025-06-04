const filmSearchInput = document.getElementById("movie-search");

document.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchSearchResults();
})

async function fetchSearchResults() {
    const res = await fetch(`http://www.omdbapi.com/?apikey=32eb1eab&s=${filmSearchInput.value}&plot=full`);
    const films = await res.json();
    console.log(films);
    films.Search.map(film => renderSearchResults(film));
}

function renderSearchResults(film) {
    fetch(`http://www.omdbapi.com/?apikey=32eb1eab&i=${film.imdbID}&plot=short`)
        .then(res => res.json())
        .then(filmDetails => {
            console.log(filmDetails);
        })
}