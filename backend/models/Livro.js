const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
    isbn: { type: String, required: true, unique: true },
    titulo: { type: String, required: true, index: true },
    autor: { type: String, required: true, index: true },
    editora: { type: String, required: true },
    ano: { type: Number, required: true },
    categoria: { type: String, required: true, index: true },
    palavrasChave: { type: [String], default: [] },
    quantidade: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('Livro', livroSchema, 'livros');
