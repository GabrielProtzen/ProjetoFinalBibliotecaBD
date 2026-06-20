const Livro = require('../models/Livro');
const Usuario = require('../models/Usuario');
const Emprestimo = require('../models/Emprestimo');

// Questao 1: livros de uma categoria publicados depois de um ano
// Default: categoria=Computação, anoMin=2020
exports.livrosPorCategoriaEAno = async (req, res) => {
    try {
        const categoria = req.query.categoria || 'Computação';
        const anoMin = parseInt(req.query.anoMin) || 2020;

        const livros = await Livro.find({
            categoria,
            ano: { $gt: anoMin }
        });

        res.json(livros);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Questao 2: usuarios cadastrados nos ultimos N dias
// Default: dias=30
exports.usuariosRecentes = async (req, res) => {
    try {
        const dias = parseInt(req.query.dias) || 30;
        const dataLimite = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);

        const usuarios = await Usuario.find({
            dataCadastro: { $gte: dataLimite }
        });

        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Questao 3: emprestimos em atraso
// status ainda "emprestado" e a data prevista de devolucao ja passou
exports.emprestimosAtrasados = async (req, res) => {
    try {
        const emprestimos = await Emprestimo.find({
            status: 'emprestado',
            dataPrevistaDevolucao: { $lt: new Date() }
        })
            .populate('usuario_id', 'nome email')
            .populate('livro_id', 'titulo isbn');

        res.json(emprestimos);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Questao 4: livros que nunca foram emprestados
// busca os livro_id distintos que aparecem em emprestimos, e exclui esses do find de livros
exports.livrosNuncaEmprestados = async (req, res) => {
    try {
        const livrosEmprestadosIds = await Emprestimo.distinct('livro_id');

        const livros = await Livro.find({
            _id: { $nin: livrosEmprestadosIds }
        });

        res.json(livros);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Questao 5: top N usuarios com maior numero de emprestimos
// Default: limite=10
exports.topUsuariosEmprestimos = async (req, res) => {
    try {
        const limite = parseInt(req.query.limite) || 10;

        const ranking = await Emprestimo.aggregate([
            {
                $group: {
                    _id: '$usuario_id',
                    totalEmprestimos: { $sum: 1 }
                }
            },
            { $sort: { totalEmprestimos: -1 } },
            { $limit: limite },
            {
                $lookup: {
                    from: 'usuarios',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'usuario'
                }
            },
            { $unwind: '$usuario' },
            {
                $project: {
                    _id: 0,
                    usuario_id: '$_id',
                    nome: '$usuario.nome',
                    email: '$usuario.email',
                    totalEmprestimos: 1
                }
            }
        ]);

        res.json(ranking);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};
