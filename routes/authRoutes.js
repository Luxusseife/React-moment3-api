// Inkluderar Express, router och JsonWebtoken.
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Importerar användarmodellen.
const User = require("../models/user");

// Importerar authenticateToken från server.js.
const { authenticateToken } = require("../server");

// Skapar/registrerar en ny användare.
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validerar input.
        if (!username || !password) {
            return res.status(400).json({ error: "Felaktigt användarnamn eller lösenord..." });
        }

        // Kontrollerar om användarnamnet redan finns i databasen.
        const registeredUser = await User.findOne({ username });
        if (registeredUser) {
            return res.status(409).json({ error: "Användarnamnet är upptaget. Ange ett annat användarnamn." });
        }

        // Korrekt input? Skapar en ny användar-instans.
        const user = new User({ username, password });
        await user.save();

        // Returnerar lyckat svar i konsollen.
        res.status(201).json({ 
            message: "Användarkontot är registrerat!",
            newUser: username 
        });

    // Felmeddelande vid serverfel.
    } catch (error) {
        res.status(500).json({ error: "Serverfel..." });
    }
});

// Loggar in användaren.
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validerar input.
        if (!username || !password) {
            return res.status(400).json({ error: "Felaktigt användarnamn eller lösenord..." });
        }

        // Kontrollerar om användaren är registrerad.
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(401).json({ error: "Användarnamnet hittas inte i databasen." });
        }

        // Kontrollerar lösenord.
        const isPasswordMatch = await user.comparePassword(password);
        if(!isPasswordMatch) {
            return res.status(401).json({ error: "Felaktigt användarnamn eller lösenord" });
        } else {
            // Skapar JWT-nyckel.
            const payload = { username: username };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
            // Skapar svarsinfo.
            const response = {
                message: "Lyckad inloggning",
                user: username,
                token: token
            }
            // Skickar svar och token till klienten.
            res.status(200).json({ response, token });
        }

    // Felmeddelande vid serverfel.
    } catch (error) {
        res.status(500).json({ error: "Serverfel..." });
    }
});

// Raderar användaren.
router.delete("/delete/:username", authenticateToken, async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Verifierar att det är samma användare som gör förfrågan.
        if (req.user.username !== username) {
            return res.status(403).json({ error: "Du har inte behörighet att radera detta konto." });
        }

        // Hittar användaren i databasen.
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "Användaren hittades inte." });
        }

        // Jämför angivet lösenord med lagrat lösenord.
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Felaktigt lösenord." });
        }

        // Raderar användaren.
        await user.deleteOne();

        // Returnerar lyckat svar i konsollen.
        res.status(200).json({ 
            message: "Användarkontot är raderat!",
            erasedUser: username 
        });
    // Felmeddelande vid serverfel.    
    } catch (error) {
        res.status(500).json({ error: "Serverfel vid radering av användare." });
    }
});

// Exporterar koden till server.js.
module.exports = router;