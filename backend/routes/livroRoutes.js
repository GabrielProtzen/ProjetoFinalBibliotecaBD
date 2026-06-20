const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');

router.get('/', livroController.listarLivros);
router.get('/:id', livroController.buscarLivroPorId);
router.post('/', livroController.inserirLivro);
router.patch('/:id/quantidade', livroController.atualizarQuantidade);
router.patch('/:id/categoria', livroController.alterarCategoria);
router.delete('/:id', livroController.removerLivro);

module.exports = router;
