// Inkluderar Express, router och item-modellen.
const express = require("express");
const router = express.Router();
const Item = require("../models/item");

// ROUTING (CRUD):

// Hämtar in API:et.
router.get("/api", async (req, res) => {

    res.json({ message: "Välkommen till lagerhanteringssystemet!" });
});

// Hämtar lagrade varor.
router.get("/item", async (req, res) => {
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
router.post("/item", async (req, res) => {
    try {
        let result = await Item.create(req.body);

        // Respons vid lyckad input-inmatning.
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
router.get("/item/:id", async (req, res) => {

    const itemId = req.params.id;

    try {
        let result = await Item.findById(itemId);

        // Kontroll av innehåll och meddelande om angivet id saknas.
        if (!result) {
            return res.status(404).json({ error: "Kunde inte hitta varan med angivet ID." });

        // Om varan med matchande id hittas, skrivs det ut.
        } else {
            // Respons vid lyckad hämtning.
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
router.put("/item/:id", async (req, res) => {
    try {
        const itemId = req.params.id;
        const updatedItem = req.body;

        let result = await Item.findByIdAndUpdate(itemId, updatedItem, { new: true });

        // Kontroll av innehåll och meddelande om angivet id saknas.
        if (!result) {
            return res.status(400).json({ error: error.message || "Kunde inte uppdatera varan." });
        } else {
            // Respons vid lyckad uppdatering.
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
router.delete("/item/:id", async (req, res) => {

    // Raderar med findByIdAndDelete(), kontrollerar innehåll och skriver ut uppdaterad post. 
    try {
        const itemId = req.params.id;

        let result = await Item.findByIdAndDelete(itemId);

        // Kontroll av innehåll och meddelande om angivet id saknas.
        if (!result) {
            return res.status(404).json({ message: "En vara med detta ID hittas inte." });
        } else {
            // Respons vid lyckad radering.
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

// Exporterar koden till server.js.
module.exports = router;