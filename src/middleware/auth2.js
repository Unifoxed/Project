const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        // Gebruiker is ingelogd, ga verder
        next();
    } else {
        // Gebruiker is niet ingelogd, stuur door naar de inlogpagina
        res.redirect('/auth/login');
    }
};

module.exports = ensureAuthenticated;