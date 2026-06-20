const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    livro_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Livro', required: true },
    dataReserva: { type: Date, default: Date.now },
    status: { type: String, enum: ['ativa', 'finalizada'], default: 'ativa' }
});

module.exports = mongoose.model('Reserva', reservaSchema, 'reservas');
