// Trigger 2: Registrar devolucoes
//
// Configuracao no Atlas:
// - Trigger Type: Database
// - Cluster: ClusterBiblioteca
// - Database: biblioteca
// - Collection: emprestimos
// - Operation Type: Update
// - Full Document: ativado

exports = async function (changeEvent) {
    const updatedFields = changeEvent.updateDescription
        ? changeEvent.updateDescription.updatedFields
        : {};

    // So registra o log se o campo "status" foi alterado para "devolvido"
    if (updatedFields.status === "devolvido") {
        const logsCollection = context.services
            .get("ClusterBiblioteca")
            .db("biblioteca")
            .collection("logs");

        await logsCollection.insertOne({
            colecao: "emprestimos",
            operacao: "devolucao",
            data: new Date(),
            dados: changeEvent.fullDocument
        });
    }
};
