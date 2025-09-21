// movieController.js
const movieService = require("../services/movieService");
const logger = require("../util/logger");

const GetAllMovies = function(req, res, next) {
    // Haal de customer_id van de ingelogde gebruiker op
    const userId = req.session.user ? req.session.user.customer_id : null;

    movieService.getMovies((err, movies) => {
        if (err) return next(err);

        if (userId) {
            movieService.getFavoriteMovieIds(userId, (favErr, favoriteIds) => {
                if (favErr) return next(favErr);
                
                const moviesWithFavorites = movies.map(movie => {
                    return {
                        ...movie,
                        isFavorite: favoriteIds.includes(movie.film_id)
                    };
                });
                
                res.render("movies", { movies: moviesWithFavorites, user: req.session.user });
            });
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

    movieService.getFavoritesWithDetails(userId, (err, movies) => {
        if (err) return next(err);
        res.render("watchlist", { movies, user: req.session.user });
    });
};

// Exporteer alle functies
module.exports = {
    GetAllMovies,
    AddNewMovie: (req, res, next) => {
        const { title, releaseYear, description } = req.body;
        if (!title || !releaseYear || !description) {
            return res.status(400).json({ error: "Alle velden zijn verplicht." });
        }
        movieService.addMovie({ title, release_year: releaseYear, description }, (err, result) => {
            if (err) {
                console.error("Fout bij toevoegen van film:", err);
                return next(err);
            }
            res.status(201).json({ message: "Film toegevoegd!", movie: result });
        });
    },
    GetMovieById,
    UpdateMovieById,
    DeleteMovieById,
    AddFavoriteMovie,
    RemoveFavoriteMovie,
    GetWatchlist
};