// Inkluderar Express, Cors, Mongoose, JsonWebtoken och dotenv.
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Initialiserar Express.
const app = express();

// Väljer port.
const port = process.env.PORT || 3001;

// Middleware. Aktiverar hantering av JSON-data och Cors.
app.use(express.json());
app.use(cors());

// Importerar route för item och ställer in grundläggande sökväg.
const itemRoutes = require("./routes/itemRoutes");
app.use("/", itemRoutes);

// Ansluter till MongoDB-databasen.
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE)
    // Lyckad anslutning.
    .then(() => {
        console.log("Ansluten till databasen!");
    })
    // Fel vid anslutning.
    .catch((error) => {
        console.error("Fel vid anslutning till databasen: " + { error });
    });

// Route för skyddad resurs - Min sida.
app.get("/admin", authenticateToken, (req, res) => {
    res.json({ message: "Du har nu åtkomst till admin-gränssnittet." })
});

// Route för att validera token.
app.get("/validate-token", authenticateToken, (req, res) => {
    res.status(200).json({ user: req.user });
});

// Validerar token för åtkomst till skyddad resurs.
function authenticateToken(req, res, next) {
    // Hämtar authorization-header.
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        console.log("No Authorization header sent");
        return res.status(401).json({ message: "Ingen behörighet för admin-gränssnittet - token saknas." });
    }

    // Om headern finns, extraheras token från den.
    const token = authHeader && authHeader.split(" ")[1];

    // Kontrollerar om en giltig token finns.
    if (token == null) return res.status(401).json({ message: "Ingen behörighet för admin-gränssnittet - token saknas." });

    // Kontrollerar JWT.
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Ingen behörighet för admin-gränssnittet - ogiltig token." });

        req.user = user;
        next();
    });
}

// Exporterar JWT-verifiering till authRoutes.
module.exports = { authenticateToken };

// Importerar route för auth och ställer in grundläggande sökväg.
const authRoutes = require("./routes/authRoutes");
app.use("/", authRoutes);

// Startar Express-servern.
app.listen(port, () => {
    console.log("Servern körs på följande port: " + port);
});
