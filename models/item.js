// Inkluderar Mongoose.
const mongoose = require("mongoose");

// Skapar item-schema för struktur.
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Du behöver ange varans namn"],
        trim: true
    },
    category: {
        type: String,
        enum: ["Pussel", "Spel", "Ingen kategori"],
        default: "Ingen kategori"
    },
    price: {
        type: Number,
        required: [true, "Du behöver ange varans pris"]
    },
    status: {
        type: Boolean,
        default: true 
    },
});

// Inkluderar schemat i databasen.
const Item = mongoose.model("Item", itemSchema);
// Exporterar koden till server.js.
module.exports = Item;