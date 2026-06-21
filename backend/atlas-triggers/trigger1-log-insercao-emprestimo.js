// Trigger 1: Registrar em logs toda insercao de emprestimo
//
// Configuracao no Atlas:
// - Trigger Type: Database
// - Cluster: ClusterBiblioteca
// - Database: biblioteca
// - Collection: emprestimos
// - Operation Type: Insert

exports = async function (changeEvent) {
    const logsCollection = context.services
        .get("ClusterBiblioteca")
        .db("biblioteca")
        .collection("logs");

    await logsCollection.insertOne({
        colecao: "emprestimos",
        operacao: "insercao",
        data: new Date(),
        dados: changeEvent.fullDocument
    });
};
