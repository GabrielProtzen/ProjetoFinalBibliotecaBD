const express = require('express');
const router = express.Router();
const agregacaoController = require('../controllers/agregacaoController');

// Questao 6
router.get('/livros-por-categoria', agregacaoController.livrosPorCategoria);
// Questao 7
router.get('/media-avaliacoes-por-livro', agregacaoController.mediaAvaliacoesPorLivro);
// Questao 8
router.get('/top10-livros-mais-emprestados', agregacaoController.top10LivrosMaisEmprestados);
// Questao 9
router.get('/cursos-que-mais-utilizam', agregacaoController.cursosQueMaisUtilizam);
// Questao 10
router.get('/taxa-devolucao-por-mes', agregacaoController.taxaDevolucaoPorMes);
// Questao 11
router.get('/ranking-autores-mais-lidos', agregacaoController.rankingAutoresMaisLidos);
// Questao 12
router.get('/livros-nota-media-baixa', agregacaoController.livrosNotaMediaBaixa);

module.exports = router;
