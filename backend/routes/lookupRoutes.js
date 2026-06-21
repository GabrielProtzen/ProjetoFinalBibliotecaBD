const express = require('express');
const router = express.Router();
const lookupController = require('../controllers/lookupController');

// Questao 13
router.get('/emprestimos-detalhados', lookupController.emprestimosDetalhados);
// Questao 14
router.get('/avaliacoes-detalhadas', lookupController.avaliacoesDetalhadas);
// Questao 15
router.get('/relatorio-usuario/:id', lookupController.relatorioUsuario);

module.exports = router;
