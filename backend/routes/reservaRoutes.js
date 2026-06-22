const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

router.get('/', reservaController.listarReservas);
router.post('/', reservaController.realizarReserva);
router.patch('/:id/finalizar', reservaController.finalizarReserva);
router.delete('/:id', reservaController.cancelarReserva);

module.exports = router;
