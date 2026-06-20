const mongoose = require('mongoose');

const avaliacaoSchema = new mongoose.Schema({
    usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    livro_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Livro', required: true },
    nota: { type: Number, required: true, min: 1, max: 5 },
    comentario: { type: String, default: '' },
    data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Avaliacao', avaliacaoSchema, 'avaliacoes');
