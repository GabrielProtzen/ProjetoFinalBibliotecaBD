const Livro = require('../models/Livro');
const registrarAuditoria = require('../utils/auditoria');

exports.listarLivros = async (req, res) => {
    try {
        const livros = await Livro.find().limit(50);
        res.json(livros);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.buscarLivroPorId = async (req, res) => {
    try {
        const livro = await Livro.findById(req.params.id);
        if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });
        res.json(livro);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.inserirLivro = async (req, res) => {
    try {
        const livro = new Livro(req.body);
        await livro.save();
        await registrarAuditoria('livros', 'insercao', livro.toObject());
        res.status(201).json(livro);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.atualizarQuantidade = async (req, res) => {
    try {
        const { quantidade } = req.body;
        if (quantidade === undefined) {
            return res.status(400).json({ erro: 'Informe o campo quantidade' });
        }

        const livro = await Livro.findByIdAndUpdate(
            req.params.id,
            { quantidade },
            { new: true, runValidators: true }
        );
        if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });
        await registrarAuditoria('livros', 'atualizacao_quantidade', { livro_id: livro._id, novaQuantidade: quantidade });
        res.json(livro);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.alterarCategoria = async (req, res) => {
    try {
        const { categoria } = req.body;
        if (!categoria) {
            return res.status(400).json({ erro: 'Informe o campo categoria' });
        }

        const livro = await Livro.findByIdAndUpdate(
            req.params.id,
            { categoria },
            { new: true, runValidators: true }
        );
        if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });
        await registrarAuditoria('livros', 'atualizacao_categoria', { livro_id: livro._id, novaCategoria: categoria });
        res.json(livro);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.removerLivro = async (req, res) => {
    try {
        const livro = await Livro.findByIdAndDelete(req.params.id);
        if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });
        await registrarAuditoria('livros', 'remocao', { livro_id: livro._id, titulo: livro.titulo });
        res.json({ mensagem: 'Livro removido com sucesso' });
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};
