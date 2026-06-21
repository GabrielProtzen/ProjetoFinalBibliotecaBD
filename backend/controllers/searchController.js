const Livro = require('../models/Livro');

// Questao 16: pesquisar livros contendo um termo (ex: "mongodb")
exports.buscarLivros = async (req, res) => {
    try {
        const termo = req.query.termo || 'mongodb';

        const resultado = await Livro.aggregate([
            {
                $search: {
                    index: 'livros_search',
                    text: {
                        query: termo,
                        path: ['titulo', 'autor', 'categoria', 'palavrasChave']
                    }
                }
            },
            { $limit: 20 },
            {
                $project: {
                    titulo: 1,
                    autor: 1,
                    categoria: 1,
                    palavrasChave: 1,
                    score: { $meta: 'searchScore' }
                }
            }
        ]);

        res.json(resultado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Questao 17: pesquisar termos semelhantes
exports.buscarLivrosSimilares = async (req, res) => {
    try {
        const termo = req.query.termo || 'algoritmo';

        const resultado = await Livro.aggregate([
            {
                $search: {
                    index: 'livros_search',
                    text: {
                        query: termo,
                        path: ['palavrasChave', 'titulo', 'autor'],
                        fuzzy: { maxEdits: 2 }
                    }
                }
            },
            { $limit: 20 },
            {
                $project: {
                    titulo: 1,
                    autor: 1,
                    palavrasChave: 1,
                    score: { $meta: 'searchScore' }
                }
            }
        ]);

        res.json(resultado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Questao 18: autocomplete para titulos
exports.autocompleteTitulo = async (req, res) => {
    try {
        const termo = req.query.termo || 'Livro';

        const resultado = await Livro.aggregate([
            {
                $search: {
                    index: 'livros_search',
                    autocomplete: {
                        query: termo,
                        path: 'titulo'
                    }
                }
            },
            { $limit: 10 },
            { $project: { _id: 0, titulo: 1, autor: 1 } }
        ]);

        res.json(resultado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};
