const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    colecao: { type: String, required: true },
    operacao: { type: String, required: true },
    data: { type: Date, default: Date.now },
    dados: { type: mongoose.Schema.Types.Mixed, default: {} }
});

module.exports = mongoose.model('Log', logSchema, 'logs');
