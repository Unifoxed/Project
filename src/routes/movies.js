const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');


router.get('/watchlist', movieController.GetWatchlist);
// Route voor alle films
router.get("/", movieController.GetAllMovies);

// Route voor het toevoegen van een nieuwe film
router.post("/", movieController.AddNewMovie);

// Routes for favorites (add/remove)
router.post('/favorite/:id', movieController.AddFavoriteMovie);
router.delete('/favorite/:id', movieController.RemoveFavoriteMovie);

// Route voor het ophalen van een specifieke film op basis van ID
router.get("/:id", movieController.GetMovieById);

// Route voor het bijwerken van een specifieke film op basis van ID
router.put("/:id", movieController.UpdateMovieById);

// Route voor het verwijderen van een specifieke film op basis van ID
router.delete("/:id", movieController.DeleteMovieById);


module.exports = router;