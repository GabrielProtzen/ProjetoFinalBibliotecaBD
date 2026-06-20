const express = require('express');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimoController');

router.get('/', emprestimoController.listarEmprestimos);
router.post('/', emprestimoController.realizarEmprestimo);
router.patch('/:id/devolucao', emprestimoController.registrarDevolucao);
router.patch('/:id/renovar', emprestimoController.renovarEmprestimo);

module.exports = router;
