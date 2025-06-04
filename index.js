const filmSearchInput = document.getElementById("film-search");
const filmContainer = document.getElementById("film-container");

document.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchSearchResults();
})

async function fetchSearchResults() {
    filmContainer.innerHTML = `<p class="placeholder-text">Fetching results...</p>`
    
    const res = await fetch(`http://www.omdbapi.com/?apikey=32eb1eab&s=${filmSearchInput.value}&plot=full`);
    const films = await res.json();
    
    const filmArray = films.Search.map(film => film.imdbID);
    let filmHtml = "";
    
    for (let filmToSearch of filmArray) {
        filmHtml += await renderSearchResults(filmToSearch);
    }
    

    // const filmHtml = await Promise.all(films.Search.map(async (filmToSearch) => await renderSearchResults(filmToSearch)));
    // filmHtml.join("");
    console.log(`filmHtml: ${await filmHtml}`);
    filmContainer.innerHTML = await filmHtml;
}

async function renderSearchResults(filmToSearch) {
    const res = await fetch(`http://www.omdbapi.com/?apikey=32eb1eab&i=${filmToSearch}&plot=short`);
    const film = await res.json();
        
    const html = `<div class="film-card" id="${film.imdbID}">
                <img src="${film.Poster}" alt="Poster for ${film.Title}">
                <div class="film">
                    <div>
                        <h2 class="film-title">${film.Title}</h2>
                        <div class="rating">
                            <i class="fa-solid fa-star"></i>
                            <p class="film-rating">${film.imdbRating}</p>
                        </div>
                    </div>
                    <div class="film-details">
                        <p class="film-runtime">${film.Runtime}</p>
                        <p class="film-genres">${film.Genre}</p>
                        <div class="add-to-watchlist" data-id="${film.imdbID}">
                            <i class="fa-solid fa-square-plus"></i>
                            <p>Add to watchlist</p>
                        </div>
                    </div>
                    <p class="film-plot">${film.Plot}</p>
                </div>
            </div>
            <hr />
            `

    console.log(html);
    return html;
}