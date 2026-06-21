const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');
const Emprestimo = require('../models/Emprestimo');
const Avaliacao = require('../models/Avaliacao');

// Questao 13: nome do usuario, titulo do livro, data de emprestimo
exports.emprestimosDetalhados = async (req, res) => {
    try {
        const resultado = await Emprestimo.aggregate([
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'usuario_id',
                    foreignField: '_id',
                    as: 'usuario'
                }
            },
            { $unwind: '$usuario' },
            {
                $lookup: {
                    from: 'livros',
                    localField: 'livro_id',
                    foreignField: '_id',
                    as: 'livro'
                }
            },
            { $unwind: '$livro' },
            {
                $project: {
                    _id: 0,
                    nomeUsuario: '$usuario.nome',
                    tituloLivro: '$livro.titulo',
                    dataEmprestimo: 1
                }
            },
            { $sort: { dataEmprestimo: -1 } },
            { $limit: 100 }
        ]);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Questao 14: usuario, livro, nota e comentario das avaliacoes
exports.avaliacoesDetalhadas = async (req, res) => {
    try {
        const resultado = await Avaliacao.aggregate([
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'usuario_id',
                    foreignField: '_id',
                    as: 'usuario'
                }
            },
            { $unwind: '$usuario' },
            {
                $lookup: {
                    from: 'livros',
                    localField: 'livro_id',
                    foreignField: '_id',
                    as: 'livro'
                }
            },
            { $unwind: '$livro' },
            {
                $project: {
                    _id: 0,
                    nomeUsuario: '$usuario.nome',
                    tituloLivro: '$livro.titulo',
                    nota: 1,
                    comentario: 1
                }
            },
            { $limit: 100 }
        ]);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Questao 15: relatorio completo de um usuario
// dados pessoais + emprestimos + reservas + avaliacoes em um unico documento
exports.relatorioUsuario = async (req, res) => {
    try {
        const usuarioId = new mongoose.Types.ObjectId(req.params.id);

        const resultado = await Usuario.aggregate([
            { $match: { _id: usuarioId } },
            {
                $lookup: {
                    from: 'emprestimos',
                    localField: '_id',
                    foreignField: 'usuario_id',
                    as: 'emprestimos'
                }
            },
            {
                $lookup: {
                    from: 'reservas',
                    localField: '_id',
                    foreignField: 'usuario_id',
                    as: 'reservas'
                }
            },
            {
                $lookup: {
                    from: 'avaliacoes',
                    localField: '_id',
                    foreignField: 'usuario_id',
                    as: 'avaliacoes'
                }
            }
        ]);

        if (resultado.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        res.json(resultado[0]);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};
