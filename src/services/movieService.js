// Importeer de nieuwe DAO
const movieDAO = require('../DAO/movieDAO');

/**
 * De service-laag voor films.
 */

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

// Exporteer de CRUD-methoden
module.exports = {
    getMovies,
    getMovieById,
    addMovie,
    updateMovie,
    deleteMovie
};
