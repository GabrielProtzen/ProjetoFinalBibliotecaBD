// Trigger 3: Enviar notificacao quando um livro ficar sem exemplares disponiveis
//
// Configuracao no Atlas:
// - Trigger Type: Database
// - Cluster: ClusterBiblioteca
// - Database: biblioteca
// - Collection: livros
// - Operation Type: Update
// - Full Document: ativado
//
// OBS: como o projeto nao tem um servico de email/SMS configurado 
// a "notificacao" e registrada em uma colecao dedicada (notificacoes)
// Isso comprova que o trigger disparou corretamente.

exports = async function (changeEvent) {
    const updatedFields = changeEvent.updateDescription
        ? changeEvent.updateDescription.updatedFields
        : {};

    // So notifica quando a quantidade foi alterada e chegou a zero
    if (updatedFields.quantidade === 0) {
        const notificacoesCollection = context.services
            .get("ClusterBiblioteca")
            .db("biblioteca")
            .collection("notificacoes");

        await notificacoesCollection.insertOne({
            tipo: "estoque_esgotado",
            livro_id: changeEvent.documentKey._id,
            titulo: changeEvent.fullDocument ? changeEvent.fullDocument.titulo : null,
            data: new Date(),
            mensagem: "Livro sem exemplares disponiveis"
        });
    }
};
