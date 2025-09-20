// Importeer de nieuwe DAO
const movieDAO = require('../DAO/movieDAO');

// Haal alle films op
function getMovies(callback) {
    movieDAO.getAllMovies((err, movies) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, movies);
    });
}

// Haal een specifieke film op met ID
function getMovieById(id, callback) {
    movieDAO.getMovieById(id, (err, movie) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, movie);
    });
}

// Voeg een nieuwe film toe
function addMovie(movieData, callback) {
    movieDAO.addMovie(movieData, (err, newMovie) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, newMovie);
    });
}

// Werk een film bij op basis van ID
function updateMovie(id, movieData, callback) {
    movieDAO.updateMovie(id, movieData, (err, updatedMovie) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, updatedMovie);
    });
}

// Verwijder een film op basis van ID
function deleteMovie(id, callback) {
    movieDAO.deleteMovie(id, (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// Functie om favoriete films op te halen op basis van gebruikers-ID
function getFavoriteMovieIds(userId, callback) {
    movieDAO.getFavorites(userId, (err, favoriteIds) => {
        if (err) return callback(err);
        callback(null, favoriteIds);
    });
}

// Functie om een film toe te voegen aan favorieten
function addFavorite(userId, movieId, callback) {
    movieDAO.addFavorite(userId, movieId, callback);
}

// Functie om een film uit favorieten te verwijderen
function removeFavorite(userId, movieId, callback) {
    movieDAO.removeFavorite(userId, movieId, callback);
}
// Exporteer de CRUD-methoden
module.exports = {
    getMovies,
    getMovieById,
    addMovie,
    updateMovie,
    deleteMovie,
    getFavoriteMovieIds,
    addFavorite,
    removeFavorite
};
