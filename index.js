const filmSearchInput = document.getElementById("film-search");
const filmContainer = document.getElementById("film-container");

document.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchSearchResults();
})

filmContainer.addEventListener("click", (e) => {
    if (e.target.dataset.id) {
        handleWatchlistClick(e.target.dataset.id);
    }
})

async function fetchSearchResults() {
    filmContainer.innerHTML = `<p class="placeholder-text">Fetching results...</p>`
    
    const res = await fetch(`http://www.omdbapi.com/?apikey=32eb1eab&s=${filmSearchInput.value}&plot=full`);
    const films = await res.json();
    
    const filmArray = films.Search.map(film => film.imdbID);
    let filmHtml = "";
    
    for (let filmToSearch of filmArray) {
        filmHtml += await renderResults(filmToSearch);
    }

    filmContainer.innerHTML = await filmHtml;
}

async function renderResults(filmToSearch) {
    let film;

    if (localStorage.getItem(`${filmToSearch}`)) {
        console.log("Found");
        film = JSON.parse(localStorage.getItem(`${filmToSearch}`));
    } else {
        console.log("Not found");
        const res = await fetch(`http://www.omdbapi.com/?apikey=32eb1eab&i=${filmToSearch}&plot=short`);
        film = await res.json();
        localStorage.setItem(filmToSearch, JSON.stringify(film));
    }

    let watchlistHTML = `<i class="fa-solid fa-square-plus"></i>
                            <p>Watchlist</p>`

    if (isAlreadyInWatchlist(filmToSearch)) {
        watchlistHTML =   `<i class="fa-solid fa-square-minus"></i>
                                <p>Remove</p>`
    }
        
    return `<div class="film-card" id="${film.imdbID}">
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
                        <div class="add-to-watchlist" id="watchlist-${film.imdbID}" data-id="${film.imdbID}">
                            ${watchlistHTML}
                        </div>
                    </div>
                    <p class="film-plot">${film.Plot}</p>
                </div>
            </div>
            <hr />
            `
}

function handleWatchlistClick(filmID) {
    const filmToAdd = JSON.parse(localStorage.getItem(`${filmID}`))
    if (localStorage.getItem("watchlist")) {
        let watchlist = JSON.parse(localStorage.getItem("watchlist"));
        
        if (isAlreadyInWatchlist(filmID)) {
            const index = watchlist.findIndex((film) => filmID === film.imdbID);
            watchlist.splice(index, 1);
            storeWatchlist(watchlist);
            document.getElementById(`watchlist-${filmID}`).innerHTML = `<i class="fa-solid fa-square-plus"></i>
                                                                        <p>Watchlist</p>`
        } else {
            watchlist.push(filmToAdd);
            storeWatchlist(watchlist);
            document.getElementById(`watchlist-${filmID}`).innerHTML = `<i class="fa-solid fa-square-minus"></i>
                                                                        <p>Remove</p>`
        }
    } else {
        localStorage.setItem("watchlist", JSON.stringify([filmToAdd]))
        document.getElementById(`watchlist-${filmID}`).innerHTML = `<i class="fa-solid fa-square-minus"></i>
                                                                    <p>Remove</p>`
    }
}

function storeWatchlist(watchlist) {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

function isAlreadyInWatchlist(filmToCheck) {
    if (localStorage.getItem("watchlist")) {
        let watchlist = JSON.parse(localStorage.getItem("watchlist"));
        for (let film of watchlist) {
            if (filmToCheck === film.imdbID) {
                console.log("Already added!");
                return true;
            }
        }
        console.log("It's new!");
        return false;
    }
}