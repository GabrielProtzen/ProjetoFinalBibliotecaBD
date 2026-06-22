const Log = require('../models/Log');

// Registra uma entrada de auditoria a partir da aplicacao (nao do banco).
// Diferente dos Triggers (Parte 9), que reage a mudancas no banco
// independente da origem, funcao e chamada pelo
// codigo do controller na operacao.
async function registrarAuditoria(colecao, operacao, dados) {
    try {
        await Log.create({
            colecao,
            operacao,
            data: new Date(),
            dados
        });
    } catch (err) {
        // Auditoria nao pode quebrar a operacao principal,
        // por isso o erro so e logado no console, nao propagado.
        console.error('Erro ao registrar auditoria:', err.message);
    }
}

module.exports = registrarAuditoria;
