const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');

// Questao 1
router.get('/livros-por-categoria-ano', consultaController.livrosPorCategoriaEAno);
// Questao 2
router.get('/usuarios-recentes', consultaController.usuariosRecentes);
// Questao 3
router.get('/emprestimos-atrasados', consultaController.emprestimosAtrasados);
// Questao 4
router.get('/livros-nunca-emprestados', consultaController.livrosNuncaEmprestados);
// Questao 5
router.get('/top-usuarios-emprestimos', consultaController.topUsuariosEmprestimos);

module.exports = router;
