const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Questao 16
router.get('/livros', searchController.buscarLivros);
// Questao 17
router.get('/livros-similares', searchController.buscarLivrosSimilares);
// Questao 18
router.get('/autocomplete-titulo', searchController.autocompleteTitulo);

module.exports = router;
