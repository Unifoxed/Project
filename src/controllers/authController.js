const DAOService = require("../DAO/movieDAO");

// Toont de login pagina
exports.ShowLoginPage = (req, res) => {
  res.render("login", { title: "Login" });
};

// Toont de registratiepagina
exports.ShowRegisterPage = (req, res) => {
  res.render("register", { title: "Register" });
};

// Verwerkt de registratie van een gebruiker
exports.RegisterUser = (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  
  DAOService.registerUser(first_name, last_name, email, password, (err, result) => {
    if (err) {
      if (err.message === "Email already registered.") {
        return res.status(409).send(err.message);
      }
      return res.status(500).send("Error registering user." + err.message);
    }
    res.redirect("/auth/login"); // Stuur de gebruiker na succesvolle registratie naar de inlogpagina
  });
};

// Verwerkt het inloggen van een gebruiker
exports.LoginUser = (req, res) => {
  const { email, password } = req.body;

  DAOService.loginUser(email, password, (err, user) => {
    if (err) {
      console.error("Login failed:", err.message);
      return res.status(401).send("Invalid e-mailaddress or password.");
    }
    
    req.session.user = user; // Store the user in the session
    
    // Move res.redirect inside the save callback
    req.session.save((saveErr) => {
      if (saveErr) {
        console.error("Fout bij het opslaan van de sessie:", saveErr);
        return res.status(500).send("Login mislukt.");
      }
      console.log("User successfully logged in. Redirecting...");
      res.redirect('/movies'); // Redirect to the secure page
    });
  });
};