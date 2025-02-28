// Inkluderar Express, Cors och Mongoose.
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Laddar in .env-fil.
require("dotenv").config();

// Initialiserar Express.
const app = express();

// Väljer port.
const port = process.env.PORT || 3001;

// Middleware. Aktiverar hantering av JSON-data och Cors.
app.use(express.json());
app.use(cors());

// Ansluter till MongoDB.
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Ansluten till databasen!");
// Felmeddelande.
}).catch((error) => {
    console.log("Fel uppstod vid anslutning till databasen: " + error);
});

// Skapar item-schema för struktur.
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Du behöver ange varans namn"]
    },
    category: {
        type: String,
        enum: ["Pussel", "Spel", "Böcker", "Pyssel", "Leksaker", "Ingen kategori"],
        default: "Ingen kategori"
        
    },
    price: {
        type: Number,
        required: [true, "Du behöver ange varans pris"]
    },
    status: {
        type: Boolean,
        default: false 
    }
});

// Inkluderar schemat i databasen.
const Item = mongoose.model("Item", itemSchema);


// ROUTING.

// Hämtar in API:et.
app.get("/api", async (req, res) => {

    res.json({ message: "Välkommen till lagerhanteringssystemet!" });
});

// Hämtar lagrade varor.
app.get("/item", async (req, res) => {
    try {
        let result = await Item.find({});

        // Kontroll av innehåll och meddelande om collection är tom. Resursen finns men är tom!
        if (result.length === 0) {
            return res.status(200).json({ message: "Inga varor hittades." });

            // Om varor finns, skrivs dessa ut.
        } else {
            return res.json(result);
        }
    // Felmeddelande.
    } catch (error) {
        return res.status(500).json({ error: "Något gick fel vid hämtning av varor: " + error });
    }
});

// Skapar/lagrar en vara.
app.post("/item", async (req, res) => {
    try {
        let result = await Item.create(req.body);

        // Response vid lyckad input-inmatning.
        return res.json({
            message: "Varan lades till!",
            newItem: result
        });
    // Felmeddelande.
    } catch (error) {
        return res.status(400).json({ error: error.message || "Felaktig inmatning. Prova igen!" });
    }
});

// Hämtar specifik vara.
app.get("/item/:id", async (req, res) => {

    const itemId = req.params.id;

    try {
        let result = await Item.findById(itemId);

        // Kontroll av innehåll och meddelande om angivet id saknas.
        if (!result) {
            return res.status(404).json({ error: "Kunde inte hitta varan med angivet ID." });

        // Om varan med matchande id hittas, skrivs det ut.
        } else {
            // Response vid lyckad uppdatering.
            return res.json({
                message: "Varan hittades!",
                foundItem: result
            });
        }
    // Felmeddelande.
    } catch (error) {
        return res.status(500).json({ error: "Något gick fel vid hämtning av varan: " + error });
    }
});

// Uppdaterar specifik vara.
app.put("/item/:id", async (req, res) => {
    try {
        const itemId = req.params.id;
        const updatedItem = req.body;

        let result = await Item.findByIdAndUpdate(itemId, updatedItem, { new: true });

        // Kontroll av innehåll och meddelande om angivet id saknas.
        if (!result) {
            return res.status(400).json({ error: error.message || "Kunde inte uppdatera varan." });
        } else {
            // Response vid lyckad uppdatering.
            return res.json({
                message: "Varan uppdaterades!",
                updatedItem: result
            });
        }
    // Felmeddelande.
    } catch (error) {
        return res.status(500).json({ error: "Något gick fel vid uppdatering: " + error });
    }
});

// Raderar specifik vara.
app.delete("/item/:id", async (req, res) => {

    // Raderar med findByIdAndDelete(), kontrollerar innehåll och skriver ut uppdaterad post. 
    try {
        const itemId = req.params.id;

        let result = await Item.findByIdAndDelete(itemId);

        // Kontroll av innehåll och meddelande om angivet id saknas.
        if (!result) {
            return res.status(404).json({ message: "En vara med detta ID hittas inte." });
        } else {
            // Response vid lyckad radering.
            return res.json({
                message: "Varan raderades!",
                deleteItem: result
            });
        }
    // Felmeddelande.
    } catch (error) {
        return res.status(500).json({ error: "Något gick fel: " + error });
    }
});

// Startar Express-servern.
app.listen(port, () => {
    console.log("Servern körs på följande port: " + port);
});
