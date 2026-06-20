const Livro = require('../models/Livro');
const Avaliacao = require('../models/Avaliacao');
const Emprestimo = require('../models/Emprestimo');

// Questao 6: quantidade de livros por categoria
exports.livrosPorCategoria = async (req, res) => {
    try {
        const resultado = await Livro.aggregate([
            { $group: { _id: '$categoria', totalLivros: { $sum: 1 } } },
            { $sort: { totalLivros: -1 } }
        ]);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Questao 7: media de avaliacoes por livro
exports.mediaAvaliacoesPorLivro = async (req, res) => {
    try {
        const resultado = await Avaliacao.aggregate([
            {
                $group: {
                    _id: '$livro_id',
                    mediaNota: { $avg: '$nota' },
                    totalAvaliacoes: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'livros',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'livro'
                }
            },
            { $unwind: '$livro' },
            {
                $project: {
                    _id: 0,
                    livro_id: '$_id',
                    titulo: '$livro.titulo',
                    mediaNota: { $round: ['$mediaNota', 2] },
                    totalAvaliacoes: 1
                }
            },
            { $sort: { mediaNota: -1 } }
        ]);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Questao 8: os 10 livros mais emprestados
exports.top10LivrosMaisEmprestados = async (req, res) => {
    try {
        const resultado = await Emprestimo.aggregate([
            { $group: { _id: '$livro_id', totalEmprestimos: { $sum: 1 } } },
            { $sort: { totalEmprestimos: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'livros',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'livro'
                }
            },
            { $unwind: '$livro' },
            {
                $project: {
                    _id: 0,
                    livro_id: '$_id',
                    titulo: '$livro.titulo',
                    autor: '$livro.autor',
                    totalEmprestimos: 1
                }
            }
        ]);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Questao 9: cursos que mais utilizam a biblioteca
exports.cursosQueMaisUtilizam = async (req, res) => {
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
                $group: {
                    _id: '$usuario.curso',
                    totalEmprestimos: { $sum: 1 }
                }
            },
            { $sort: { totalEmprestimos: -1 } },
            {
                $project: {
                    _id: 0,
                    curso: '$_id',
                    totalEmprestimos: 1
                }
            }
        ]);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Questao 10: taxa de devolucao por mes
// agrupa por ano/mes da dataEmprestimo e calcula % de devolvidos sobre o total
exports.taxaDevolucaoPorMes = async (req, res) => {
    try {
        const resultado = await Emprestimo.aggregate([
            {
                $group: {
                    _id: {
                        ano: { $year: '$dataEmprestimo' },
                        mes: { $month: '$dataEmprestimo' }
                    },
                    total: { $sum: 1 },
                    devolvidos: {
                        $sum: { $cond: [{ $eq: ['$status', 'devolvido'] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    ano: '$_id.ano',
                    mes: '$_id.mes',
                    total: 1,
                    devolvidos: 1,
                    taxaDevolucao: {
                        $round: [
                            { $multiply: [{ $divide: ['$devolvidos', '$total'] }, 100] },
                            2
                        ]
                    }
                }
            },
            { $sort: { ano: 1, mes: 1 } }
        ]);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Questao 11: ranking dos autores mais lidos (baseado em numero de emprestimos)
exports.rankingAutoresMaisLidos = async (req, res) => {
    try {
        const resultado = await Emprestimo.aggregate([
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
                $group: {
                    _id: '$livro.autor',
                    totalLeituras: { $sum: 1 }
                }
            },
            { $sort: { totalLeituras: -1 } },
            {
                $project: {
                    _id: 0,
                    autor: '$_id',
                    totalLeituras: 1
                }
            }
        ]);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Questao 12: livros com nota media inferior a um limite (default: 3)
exports.livrosNotaMediaBaixa = async (req, res) => {
    try {
        const notaMaxima = parseFloat(req.query.notaMaxima) || 3;

        const resultado = await Avaliacao.aggregate([
            {
                $group: {
                    _id: '$livro_id',
                    mediaNota: { $avg: '$nota' }
                }
            },
            { $match: { mediaNota: { $lt: notaMaxima } } },
            {
                $lookup: {
                    from: 'livros',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'livro'
                }
            },
            { $unwind: '$livro' },
            {
                $project: {
                    _id: 0,
                    livro_id: '$_id',
                    titulo: '$livro.titulo',
                    mediaNota: { $round: ['$mediaNota', 2] }
                }
            },
            { $sort: { mediaNota: 1 } }
        ]);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};
