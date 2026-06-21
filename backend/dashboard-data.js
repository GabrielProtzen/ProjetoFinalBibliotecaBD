// Materializa os dados dos Graficos 3 e 4 em colecoes auxiliares,
// com o join (lookup) feito aqui no mongosh.
// Não consegui usar a funcao de Lookup da interface do MongoDB Charts,
// nao funcionou de jeito algum.
//
// Roda: mongosh "connection" --file dashboard-data.js
//
// IMPORTANTE: rodar este script de novo sempre que os dados de
// emprestimos/avaliacoes/livros mudarem, para manter os graficos atualizados.

db.dashboard_top10_livros.drop();
db.dashboard_media_categoria.drop();

// ---------- Grafico 3: Top 10 livros mais emprestados ----------

const top10 = db.emprestimos.aggregate([
    { $group: { _id: "$livro_id", totalEmprestimos: { $sum: 1 } } },
    { $sort: { totalEmprestimos: -1 } },
    { $limit: 10 },
    {
        $lookup: {
            from: "livros",
            localField: "_id",
            foreignField: "_id",
            as: "livro"
        }
    },
    { $unwind: "$livro" },
    {
        $project: {
            _id: 0,
            titulo: "$livro.titulo",
            autor: "$livro.autor",
            totalEmprestimos: 1
        }
    }
]).toArray();

db.dashboard_top10_livros.insertMany(top10);

// ---------- Grafico 4: avaliacao media por categoria ----------

const mediaCategoria = db.avaliacoes.aggregate([
    {
        $lookup: {
            from: "livros",
            localField: "livro_id",
            foreignField: "_id",
            as: "livro"
        }
    },
    { $unwind: "$livro" },
    {
        $group: {
            _id: "$livro.categoria",
            mediaNota: { $avg: "$nota" }
        }
    },
    {
        $project: {
            _id: 0,
            categoria: "$_id",
            mediaNota: { $round: ["$mediaNota", 2] }
        }
    }
]).toArray();

db.dashboard_media_categoria.insertMany(mediaCategoria);

print("dashboard_top10_livros: " + db.dashboard_top10_livros.countDocuments() + " documentos");
print("dashboard_media_categoria: " + db.dashboard_media_categoria.countDocuments() + " documentos");
