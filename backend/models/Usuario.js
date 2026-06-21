const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    curso: { type: String, required: true, index: true },
    cidade: { type: String, required: true },
    dataCadastro: { type: Date, default: Date.now },
    ativo: { type: Boolean, default: true }
});

module.exports = mongoose.model('Usuario', usuarioSchema, 'usuarios');
