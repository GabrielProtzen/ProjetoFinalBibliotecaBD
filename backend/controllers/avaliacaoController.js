const Avaliacao = require('../models/Avaliacao');
const registrarAuditoria = require('../utils/auditoria');

exports.listarAvaliacoes = async (req, res) => {
    try {
        const avaliacoes = await Avaliacao.find().limit(50);
        res.json(avaliacoes);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.criarAvaliacao = async (req, res) => {
    try {
        const { usuario_id, livro_id, nota, comentario } = req.body;
        if (!usuario_id || !livro_id || nota === undefined) {
            return res.status(400).json({ erro: 'Informe usuario_id, livro_id e nota' });
        }

        const avaliacao = new Avaliacao({
            usuario_id,
            livro_id,
            nota,
            comentario: comentario || '',
            data: new Date()
        });
        await avaliacao.save();

        await registrarAuditoria('avaliacoes', 'insercao', avaliacao.toObject());

        res.status(201).json(avaliacao);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.removerAvaliacao = async (req, res) => {
    try {
        const avaliacao = await Avaliacao.findByIdAndDelete(req.params.id);
        if (!avaliacao) return res.status(404).json({ erro: 'Avaliação não encontrada' });

        await registrarAuditoria('avaliacoes', 'remocao', { avaliacao_id: avaliacao._id });

        res.json({ mensagem: 'Avaliação removida com sucesso' });
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};
