const mongoose = require('mongoose');

const emprestimoSchema = new mongoose.Schema({
    usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    livro_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Livro', required: true },
    dataEmprestimo: { type: Date, default: Date.now },
    dataPrevistaDevolucao: { type: Date, required: true },
    dataDevolucao: { type: Date, default: null },
    status: { type: String, enum: ['emprestado', 'devolvido'], default: 'emprestado' }
});

module.exports = mongoose.model('Emprestimo', emprestimoSchema, 'emprestimos');
