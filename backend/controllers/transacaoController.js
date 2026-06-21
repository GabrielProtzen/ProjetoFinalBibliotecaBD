const mongoose = require('mongoose');
const Emprestimo = require('../models/Emprestimo');
const Livro = require('../models/Livro');
const Log = require('../models/Log');

const DIAS_EMPRESTIMO = 15;

// Questao da Parte 12: transacao que executa em conjunto:
// 1. Criar emprestimo
// 2. Diminuir quantidade do livro
// 3. Registrar log
// Se qualquer etapa falhar, TODAS sao desfeitas (rollback automatico).
//
// Parametro opcional no body: "forcarFalha": true
// Usei isso pra provar o rollback: a falha e disparada depois que o
// emprestimo ja foi criado e a quantidade ja foi decrementada (em memoria
// da transacao), mas antes do commit -- ou seja, nada disso deve sobrar
// no banco depois do erro. (eu espero...)
exports.realizarEmprestimoComTransacao = async (req, res) => {
    const { usuario_id, livro_id, forcarFalha } = req.body;

    if (!usuario_id || !livro_id) {
        return res.status(400).json({ erro: 'Informe usuario_id e livro_id' });
    }

    const session = await mongoose.startSession();
    let emprestimoCriado = null;

    try {
        await session.withTransaction(async () => {
            const livro = await Livro.findById(livro_id).session(session);

            if (!livro) {
                throw new Error('Livro não encontrado');
            }
            if (livro.quantidade <= 0) {
                throw new Error('Não há exemplares disponíveis para este livro');
            }

            const dataEmprestimo = new Date();
            const dataPrevistaDevolucao = new Date(
                dataEmprestimo.getTime() + DIAS_EMPRESTIMO * 24 * 60 * 60 * 1000
            );

            // 1. Criar emprestimo
            const [emprestimo] = await Emprestimo.create(
                [{
                    usuario_id,
                    livro_id,
                    dataEmprestimo,
                    dataPrevistaDevolucao,
                    dataDevolucao: null,
                    status: 'emprestado'
                }],
                { session }
            );
            emprestimoCriado = emprestimo;

            // 2. Diminuir quantidade do livro
            livro.quantidade -= 1;
            await livro.save({ session });

            // Ponto de falha simulada, pra mostrar o rollback
            if (forcarFalha) {
                throw new Error('Falha simulada pra mostrar o rollback da transação');
            }

            // 3. Registrar log
            await Log.create(
                [{
                    colecao: 'emprestimos',
                    operacao: 'insercao_transacao',
                    data: new Date(),
                    dados: emprestimo.toObject()
                }],
                { session }
            );
        });

        res.status(201).json({
            mensagem: 'Transação concluída com sucesso: empréstimo criado, estoque atualizado e log registrado',
            emprestimo: emprestimoCriado
        });
    } catch (err) {
        res.status(400).json({
            erro: err.message,
            mensagem: 'Transação cancelada (rollback): nenhuma alteração foi persistida no banco'
        });
    } finally {
        await session.endSession();
    }
};
