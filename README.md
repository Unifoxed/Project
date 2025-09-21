Sakila Movies is een leerproject waarmee je een volledige webapplicatie voor films kunt verkennen. Het doel is om ervaring op te doen met een klassieke webstack: van database tot frontend, inclusief gebruikersauthenticatie en interactieve UI-componenten.

Gebruikte technologieën
Node.js (runtime) en Express.js (webframework) voor de backend.

Pug als template-engine voor server-side rendering van views.

MySQL (via mysql2) als relationele database voor films en gebruikersdata.

Bootstrap 5 voor styling, responsive layout en componenten (modals, buttons, grid).

dotenv voor veilige configuratie via environment-variabelen (.env).

bcrypt voor veilige wachtwoord-hashing.

Nodemon voor development hot-reload tijdens ontwikkeling.


Structuur van het project
De belangrijkste mappen en hun rol:

`src/DAO` - database-toegang (SQL-queries en connection pooling).

`src/services` - business logic en tussenlaag tussen controllers en DAO.

`src/controllers` - request handlers die views renderen of API responses geven.

`views` - Pug-templates voor de user interface.

`public` - statische assets zoals CSS, JS en afbeeldingen.