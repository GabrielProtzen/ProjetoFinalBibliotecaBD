const Emprestimo = require('../models/Emprestimo');
const Livro = require('../models/Livro');

const DIAS_EMPRESTIMO = 15;

exports.listarEmprestimos = async (req, res) => {
    try {
        const emprestimos = await Emprestimo.find().limit(50);
        res.json(emprestimos);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.realizarEmprestimo = async (req, res) => {
    try {
        const { usuario_id, livro_id } = req.body;
        if (!usuario_id || !livro_id) {
            return res.status(400).json({ erro: 'Informe usuario_id e livro_id' });
        }

        const livro = await Livro.findById(livro_id);
        if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });
        if (livro.quantidade <= 0) {
            return res.status(400).json({ erro: 'Não há exemplares disponíveis para este livro' });
        }

        const dataEmprestimo = new Date();
        const dataPrevistaDevolucao = new Date(
            dataEmprestimo.getTime() + DIAS_EMPRESTIMO * 24 * 60 * 60 * 1000
        );

        const emprestimo = new Emprestimo({
            usuario_id,
            livro_id,
            dataEmprestimo,
            dataPrevistaDevolucao,
            dataDevolucao: null,
            status: 'emprestado'
        });
        await emprestimo.save();

        livro.quantidade -= 1;
        await livro.save();

        res.status(201).json(emprestimo);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.registrarDevolucao = async (req, res) => {
    try {
        const emprestimo = await Emprestimo.findById(req.params.id);
        if (!emprestimo) return res.status(404).json({ erro: 'Empréstimo não encontrado' });
        if (emprestimo.status === 'devolvido') {
            return res.status(400).json({ erro: 'Este empréstimo já foi devolvido' });
        }

        emprestimo.dataDevolucao = new Date();
        emprestimo.status = 'devolvido';
        await emprestimo.save();

        await Livro.findByIdAndUpdate(emprestimo.livro_id, { $inc: { quantidade: 1 } });

        res.json(emprestimo);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.renovarEmprestimo = async (req, res) => {
    try {
        const emprestimo = await Emprestimo.findById(req.params.id);
        if (!emprestimo) return res.status(404).json({ erro: 'Empréstimo não encontrado' });
        if (emprestimo.status === 'devolvido') {
            return res.status(400).json({ erro: 'Não é possível renovar um empréstimo já devolvido' });
        }

        emprestimo.dataPrevistaDevolucao = new Date(
            emprestimo.dataPrevistaDevolucao.getTime() + DIAS_EMPRESTIMO * 24 * 60 * 60 * 1000
        );
        await emprestimo.save();

        res.json(emprestimo);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};
