const filmContainer = document.getElementById("film-container");

filmContainer.addEventListener("click", (e) => {
    if (e.target.dataset.id) {
        removeFromWatchlist(e.target.dataset.id);
    }
})

renderWatchlist();

function renderWatchlist() {
    if (localStorage.getItem("watchlist")) {
        watchlist = getWatchlist();
        if (watchlist.length > 0) {
            filmContainer.innerHTML = watchlist.map((film) => {
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
                                        <i class="fa-solid fa-square-minus"></i>
                                        <p>Remove</p>
                                    </div>
                                </div>
                                <p class="film-plot">${film.Plot}</p>
                            </div>
                        </div>
                    <hr />
                    `
            }).join("");
        } else {
        filmContainer.innerHTML = `<div class="placeholder">
                                        <p class="placeholder-text">Your watchlist is looking a little empty...</p>
                                        <a href="index.html" class="watchlist-prompt" aria-label="Go to the search page">
                                            <i class="fa-solid fa-square-plus"></i><p>Let's add some movies!</p>
                                        </a>
                                    </div>`
        }
    }
}

function getWatchlist() {
    return JSON.parse(localStorage.getItem("watchlist"));
}

function storeWatchlist(watchlist) {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

function removeFromWatchlist(filmID) {
    let watchlist = getWatchlist();
    const index = watchlist.findIndex((film) => filmID === film.imdbID);
    watchlist.splice(index, 1);
    storeWatchlist(watchlist);
    renderWatchlist();
}