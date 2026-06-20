const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.listarUsuarios);
router.get('/:id', usuarioController.buscarUsuarioPorId);
router.patch('/:id/bloquear', usuarioController.bloquearUsuario);
router.patch('/:id/reativar', usuarioController.reativarUsuario);
router.patch('/:id/curso', usuarioController.alterarCurso);

module.exports = router;
