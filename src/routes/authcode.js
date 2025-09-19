const ensureAuthenticated = require('../middleware/auth');

// Deze route is nu beveiligd en alleen toegankelijk voor ingelogde gebruikers
router.get('/movies', ensureAuthenticated, (req, res) => {
    // Hier kun je films ophalen
    res.render('movies', { user: req.session.user });
});