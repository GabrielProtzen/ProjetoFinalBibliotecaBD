const Livro = require('../models/Livro');
const Usuario = require('../models/Usuario');
const Emprestimo = require('../models/Emprestimo');
const Reserva = require('../models/Reserva');

// Dashboard Administrativo (Parte 16).
// Usando countDocuments em vez de listagens limitadas, pra mostrar o total
// real do banco, nao so uma amostra.
exports.resumo = async (req, res) => {
    try {
        const agora = new Date();

        const [
            totalLivros,
            totalUsuarios,
            usuariosAtivos,
            emprestimosAtivos,
            emprestimosAtrasados,
            reservasAtivas
        ] = await Promise.all([
            Livro.countDocuments(),
            Usuario.countDocuments(),
            Usuario.countDocuments({ ativo: true }),
            Emprestimo.countDocuments({ status: 'emprestado' }),
            Emprestimo.countDocuments({ status: 'emprestado', dataPrevistaDevolucao: { $lt: agora } }),
            Reserva.countDocuments({ status: 'ativa' })
        ]);

        res.json({
            totalLivros,
            totalUsuarios,
            usuariosAtivos,
            emprestimosAtivos,
            emprestimosAtrasados,
            reservasAtivas
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};
