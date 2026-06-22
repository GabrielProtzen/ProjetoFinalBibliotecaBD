const express = require('express');
const router = express.Router();
const avaliacaoController = require('../controllers/avaliacaoController');

router.get('/', avaliacaoController.listarAvaliacoes);
router.post('/', avaliacaoController.criarAvaliacao);
router.delete('/:id', avaliacaoController.removerAvaliacao);

module.exports = router;
