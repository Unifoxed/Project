// movieController.js
const movieService = require("../services/movieService");
const logger = require("../util/logger");

const GetAllMovies = function(req, res, next) {
    // Diagnostic: log available functions on movieService to debug missing exports
    try {
        logger.debug('movieService exports:', Object.keys(movieService));
        logger.debug('has getFavoriteMovieIds?', typeof movieService.getFavoriteMovieIds === 'function');
    } catch (e) {
        logger.error('Error while logging movieService keys:', e && e.message);
    }
    // Haal de customer_id van de ingelogde gebruiker op
    const userId = req.session.user ? req.session.user.customer_id : null;

    movieService.getMovies((err, movies) => {
        if (err) return next(err);

        if (userId) {
            // Defensive: sometimes movieService may not expose getFavoriteMovieIds (module load issue).
            if (typeof movieService.getFavoriteMovieIds === 'function') {
                movieService.getFavoriteMovieIds(userId, (favErr, favoriteIds) => {
                    if (favErr) return next(favErr);

                    const moviesWithFavorites = movies.map(movie => ({
                        ...movie,
                        isFavorite: favoriteIds.includes(movie.film_id)
                    }));

                    res.render("movies", { movies: moviesWithFavorites, user: req.session.user });
                });
            } else {
                // Fallback: call DAO directly and log for debugging
                logger.error('movieService.getFavoriteMovieIds is not available, falling back to DAO.getFavorites');
                const movieDAO = require('../DAO/movieDAO');
                movieDAO.getFavorites(userId, (favErr, favoriteIds) => {
                    if (favErr) return next(favErr);
                    const moviesWithFavorites = movies.map(movie => ({
                        ...movie,
                        isFavorite: favoriteIds.includes(movie.film_id)
                    }));
                    res.render("movies", { movies: moviesWithFavorites, user: req.session.user });
                });
            }
        } else {
            res.render("movies", { movies, user: null });
        }
    });
};

const AddFavoriteMovie = function(req, res, next) {
    const movieId = req.params.id;
    // Haal de customer_id van de ingelogde gebruiker op
    const userId = req.session.user ? req.session.user.customer_id : null;

    if (!userId) {
        logger.debug('AddFavorite attempted without user.');
        return res.status(401).json({ error: "Gebruiker niet ingelogd." });
    }

    logger.debug(`AddFavorite: user=${userId}, movie=${movieId}`);
    movieService.addFavorite(userId, movieId, (err, result) => {
        if (err) {
            logger.error('Error adding favorite:', err);
            return res.status(500).json({ error: 'Kon favoriet niet toevoegen.' });
        }
        res.status(200).json({ message: "Film toegevoegd aan favorieten." });
    });
};

const RemoveFavoriteMovie = function(req, res, next) {
    const movieId = req.params.id;
    // Haal de customer_id van de ingelogde gebruiker op
    const userId = req.session.user ? req.session.user.customer_id : null;

    if (!userId) {
        logger.debug('RemoveFavorite attempted without user.');
        return res.status(401).json({ error: "Gebruiker niet ingelogd." });
    }

    logger.debug(`RemoveFavorite: user=${userId}, movie=${movieId}`);
    movieService.removeFavorite(userId, movieId, (err, result) => {
        if (err) {
            logger.error('Error removing favorite:', err);
            return res.status(500).json({ error: 'Kon favoriet niet verwijderen.' });
        }
        res.status(200).json({ message: "Film verwijderd uit favorieten." });
    });
};

// Hieronder de gecorrigeerde functies voor REST API calls
const GetMovieById = function(req, res, next) {
    const id = req.params.id;
    movieService.getMovieById(id, (err, movie) => {
        if (err) return next(err);
        if (!movie) return res.status(404).json({ error: "Film niet gevonden." });
        res.json(movie);
    });
};

const UpdateMovieById = function(req, res, next) {
    const id = req.params.id;
    const updatedData = req.body;
    movieService.updateMovie(id, updatedData, (err, updatedMovie) => {
        if (err) return next(err);
        if (!updatedMovie) return res.status(404).json({ error: "Film niet gevonden." });
        res.json({ message: "Film bijgewerkt", movie: updatedMovie });
    });
};

const DeleteMovieById = function(req, res, next) {
    const id = req.params.id;
    movieService.deleteMovie(id, (err, deleted) => {
        if (err) return next(err);
        if (!deleted) return res.status(404).json({ error: "Film niet gevonden of al verwijderd." });
        res.json({ message: "Film verwijderd" });
    });
};

// Functie om de persoonlijke watchlist van de gebruiker te tonen
const GetWatchlist = function(req, res, next) {
    // Haal de customer_id van de ingelogde gebruiker op
    const userId = req.session.user ? req.session.user.customer_id : null;

    if (!userId) {
        return res.status(401).send("Gebruiker niet ingelogd.");
    }

    movieService.getFavoriteMovieIds(userId, (err, movies) => {
        if (err) return next(err);
        // movies previously were IDs; use service to fetch full movie objects
        movieService.getWatchlist(userId, (wlErr, fullMovies) => {
            if (wlErr) return next(wlErr);
            res.render("watchlist", { movies: fullMovies, user: req.session.user });
        });
    });
};

// Exporteer alle functies
module.exports = {
    GetAllMovies,
    GetMovieById,
    UpdateMovieById,
    DeleteMovieById,
    AddFavoriteMovie,
    RemoveFavoriteMovie,
    GetWatchlist
};