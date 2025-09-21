const pool = require("../config/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const logger = require("../util/logger");
// Haal alle films op (al geïmplementeerd)
function getAllMovies(callback) {
    const query = 'SELECT film_id, title, description, release_year FROM film LIMIT 10000';

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

// Registreert een nieuwe gebruiker (in dit geval, een customer)
const registerUser = (first_name, last_name, email, password, callback) => {
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      logger.error("Bcrypt hashing error:", err);
      return callback(err);
    }
    
    const sql = "INSERT INTO customer (first_name, last_name, email, password, store_id, active, create_date, address_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    const store_id = 1;
    const active = 1;
    const create_date = new Date();
    const address_id = 1; // Assuming a default address_id

    pool.query(sql, [first_name, last_name, email, hash, store_id, active, create_date, address_id], (dbErr, result) => {
      if (dbErr) {
        // Log detailed SQL error info to help debug malformed queries
        try {
          logger.error('Database error during user registration:', dbErr.code, dbErr.sqlMessage || dbErr.message);
          if (dbErr.sql) {
            logger.error('Failed SQL:', dbErr.sql);
          }
        } catch (logErr) {
          logger.error('Error while logging DB error:', logErr);
        }

        if (dbErr.code === "ER_DUP_ENTRY") {
          logger.debug(`Attempt to register with existing email: ${email}`);
          return callback(new Error("Email already registered."));
        }

        return callback(dbErr);
      }
      logger.debug(`New user registered with email: ${email}`);
      callback(null, result);
    });
  });
};


// Logt een gebruiker in met de customer-tabel
const loginUser = (email, password, callback) => {
  logger.debug(`Login attempt for email: ${email}`);
  const sql = "SELECT * FROM customer WHERE email = ?";
  pool.query(sql, [email], (err, results) => {
    if (err) {
      return callback(err);
    }
    if (results.length === 0) {
      return callback(new Error("Invalid email or password."));
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (bcryptErr, result) => {
      if (bcryptErr) {
        return callback(bcryptErr);
      }
      if (result) {
        callback(null, user);
      } else {
        callback(new Error("Invalid email or password."));
      }
    });
  });
};

// Voegt een film toe aan de favorieten van een gebruiker
function addFavorite(userId, movieId, callback) {
  const query = 'INSERT INTO favorite_movies (customer_id, film_id) VALUES (?, ?)';
  // Log the params for debugging
  logger.debug('addFavorite SQL params:', { userId, movieId });
  pool.query(query, [userId, movieId], (error, results) => {
    if (error) {
      try { logger.error('addFavorite DB error:', error.code, error.sqlMessage || error.message); } catch(e){}
      return callback(error);
    }
    callback(null, results);
  });
}

// Verwijder een film uit de favorieten van een gebruiker
function removeFavorite(userId, movieId, callback) {
  const query = 'DELETE FROM favorite_movies WHERE customer_id = ? AND film_id = ?';
  logger.debug('removeFavorite SQL params:', { userId, movieId });
  pool.query(query, [userId, movieId], (error, results) => {
    if (error) {
      try { logger.error('removeFavorite DB error:', error.code, error.sqlMessage || error.message); } catch(e){}
      return callback(error);
    }
    callback(null, results);
  });
}

// Haal alle favoriete films van een gebruiker op
function getFavorites(userId, callback) {
    const query = 'SELECT film_id FROM favorite_movies WHERE customer_id = ?';
    pool.query(query, [userId], (error, results) => {
        if (error) return callback(error);
        callback(null, results.map(row => row.film_id));
    });
}

// Haal meerdere films op op basis van een array met IDs
function getMoviesByIds(ids, callback) {
  if (!Array.isArray(ids) || ids.length === 0) return callback(null, []);
  // Build placeholders for the IN clause
  const placeholders = ids.map(() => '?').join(',');
  const query = `SELECT film_id, title, description, release_year FROM film WHERE film_id IN (${placeholders})`;
  pool.query(query, ids, (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
}


module.exports = {
    getAllMovies,
    getMoviesByIds,
    getMovieById,
    addMovie,
    updateMovie,
    deleteMovie,
    registerUser,
    loginUser,
    addFavorite,
    removeFavorite,
    getFavorites
};
