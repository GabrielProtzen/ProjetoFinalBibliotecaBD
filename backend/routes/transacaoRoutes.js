const express = require('express');
const router = express.Router();
const transacaoController = require('../controllers/transacaoController');

router.post('/emprestimo', transacaoController.realizarEmprestimoComTransacao);

module.exports = router;
