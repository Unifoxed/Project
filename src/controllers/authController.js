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
  const { email, password } = req.body;
  
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
      return res.status(401).send(err.message);
    }
    // TODO: Implementeer hier de sessie- of tokenlogica
    res.send("Login successful!");
  });
};