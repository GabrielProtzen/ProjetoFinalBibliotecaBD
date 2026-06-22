const Reserva = require('../models/Reserva');
const Livro = require('../models/Livro');
const registrarAuditoria = require('../utils/auditoria');

exports.listarReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find().limit(50);
        res.json(reservas);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.realizarReserva = async (req, res) => {
    try {
        const { usuario_id, livro_id } = req.body;
        if (!usuario_id || !livro_id) {
            return res.status(400).json({ erro: 'Informe usuario_id e livro_id' });
        }

        const livro = await Livro.findById(livro_id);
        if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });

        const reserva = new Reserva({
            usuario_id,
            livro_id,
            dataReserva: new Date(),
            status: 'ativa'
        });
        await reserva.save();

        await registrarAuditoria('reservas', 'insercao', reserva.toObject());

        res.status(201).json(reserva);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.finalizarReserva = async (req, res) => {
    try {
        const reserva = await Reserva.findById(req.params.id);
        if (!reserva) return res.status(404).json({ erro: 'Reserva não encontrada' });
        if (reserva.status === 'finalizada') {
            return res.status(400).json({ erro: 'Esta reserva já está finalizada' });
        }

        reserva.status = 'finalizada';
        await reserva.save();

        await registrarAuditoria('reservas', 'finalizacao', { reserva_id: reserva._id });

        res.json(reserva);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.cancelarReserva = async (req, res) => {
    try {
        const reserva = await Reserva.findByIdAndDelete(req.params.id);
        if (!reserva) return res.status(404).json({ erro: 'Reserva não encontrada' });

        await registrarAuditoria('reservas', 'remocao', { reserva_id: reserva._id });

        res.json({ mensagem: 'Reserva cancelada com sucesso' });
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};
