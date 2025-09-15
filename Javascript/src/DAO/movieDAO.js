const pool = require('../config/database'); // Pool voor databaseverbinding

// Haal alle films op (al geïmplementeerd)
function getAllMovies(callback) {
    const query = 'SELECT film_id, title, description, release_year FROM film LIMIT 20';

    pool.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
}

// Haal een film op basis van ID
function getMovieById(id, callback) {
    const query = 'SELECT film_id, title, description, release_year FROM film WHERE film_id = ?';

    pool.query(query, [id], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        if (results.length === 0) {
            return callback(null, null); // Geen film gevonden
        }
        callback(null, results[0]); // Stuur de eerste film terug (er mag er maar één zijn)
    });
}

// Voeg een nieuwe film toe
function addMovie(movieData, callback) {
    const { title, description, release_year } = movieData;
    const query = 'INSERT INTO film (title, description, release_year) VALUES (?, ?, ?)';

    pool.query(query, [title, description, release_year], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        // Stuur het nieuwe ID van de toegevoegde film terug
        callback(null, { film_id: results.insertId, title, description, release_year });
    });
}

// Werk een film bij op basis van ID
function updateMovie(id, movieData, callback) {
    const { title, description, release_year } = movieData;
    const query = 'UPDATE film SET title = ?, description = ?, release_year = ? WHERE film_id = ?';

    pool.query(query, [title, description, release_year, id], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        if (results.affectedRows === 0) {
            return callback(null, null); // Geen film gevonden met dat ID
        }
        callback(null, { film_id: id, title, description, release_year });
    });
}

// Verwijder een film op basis van ID
function deleteMovie(id, callback) {
    const query = 'DELETE FROM film WHERE film_id = ?';

    pool.query(query, [id], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        if (results.affectedRows === 0) {
            return callback(null, null); // Geen film gevonden om te verwijderen
        }
        callback(null, { message: `Film met ID ${id} verwijderd.` });
    });
}

module.exports = {
    getAllMovies,
    getMovieById,
    addMovie,
    updateMovie,
    deleteMovie
};
