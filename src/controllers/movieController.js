var express = require("express");
var router = express.Router();
const movieService = require("../services/movieService");

// Functie om alle films op te halen
const GetAllMovies = function(req, res, next) {
    movieService.getMovies((err, movies) => {
        if (err) return next(err); // Fout doorsturen naar de error handler
        res.render("movies", { movies });
    });
};

// Functie om een nieuwe film toe te voegen
const AddNewMovie = function(req, res, next) {
    const { title, releaseYear, description } = req.body;

    if (!title || !releaseYear || !description) {
        return res.status(400).json({ error: "Alle velden zijn verplicht." });
    }

    movieService.addMovie({ title, releaseYear, description }, (err, result) => {
        if (err) {
            console.error("Fout bij toevoegen van film:", err);
            return next(err);
        }
        res.status(201).json({ message: "Film toegevoegd!", movie: result });
    });
};

// Functie om een film op te halen via ID
const GetMovieById = function(req, res, next) {
    const id = req.params.id;

    movieService.getMovieById(id, (err, movie) => {
        if (err) return next(err);
        if (!movie) return res.status(404).json({ error: "Film niet gevonden." });

        res.render(movie);
    });
};

// Functie om een film bij te werken via ID
const UpdateMovieById = function(req, res, next) {
    const id = req.params.id;
    const updatedData = req.body;

    movieService.updateMovie(id, updatedData, (err, updatedMovie) => {
        if (err) return next(err);
        if (!updatedMovie) return res.status(404).json({ error: "Film niet gevonden." });

        res.render({ message: "Film bijgewerkt", movie: updatedMovie });
    });
};

// Functie om een film te verwijderen via ID
const DeleteMovieById = function(req, res, next) {
    const id = req.params.id;

    movieService.deleteMovie(id, (err, deleted) => {
        if (err) return next(err);
        if (!deleted) return res.status(404).json({ error: "Film niet gevonden of al verwijderd." });

        res.render({ message: "Film verwijderd" });
    });
};

// Exporteer alle functies
module.exports = {
    GetAllMovies,
    AddNewMovie,
    GetMovieById,
    UpdateMovieById,
    DeleteMovieById
};