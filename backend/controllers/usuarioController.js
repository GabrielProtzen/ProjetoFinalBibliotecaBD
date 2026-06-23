const Usuario = require('../models/Usuario');
const registrarAuditoria = require('../utils/auditoria');

exports.listarUsuarios = async (req, res) => {
    try {
        const limite = parseInt(req.query.limite) || 50;
        const usuarios = await Usuario.find().sort({ nome: 1 }).limit(limite);
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.buscarUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
        res.json(usuario);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.bloquearUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { ativo: false },
            { new: true }
        );
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
        await registrarAuditoria('usuarios', 'bloqueio', { usuario_id: usuario._id, nome: usuario.nome });
        res.json(usuario);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.reativarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { ativo: true },
            { new: true }
        );
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
        await registrarAuditoria('usuarios', 'reativacao', { usuario_id: usuario._id, nome: usuario.nome });
        res.json(usuario);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.alterarCurso = async (req, res) => {
    try {
        const { curso } = req.body;
        if (!curso) {
            return res.status(400).json({ erro: 'Informe o campo curso' });
        }

        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { curso },
            { new: true, runValidators: true }
        );
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
        await registrarAuditoria('usuarios', 'atualizacao_curso', { usuario_id: usuario._id, novoCurso: curso });
        res.json(usuario);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};
