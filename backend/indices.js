// Script de comparacao de performance com e sem indices (Parte 7)

function rodarExplain(query, label) {
    const resultado = query.explain("executionStats");
    const stats = resultado.executionStats;
    const estagio = resultado.queryPlanner.winningPlan.inputStage
        ? resultado.queryPlanner.winningPlan.inputStage.stage
        : resultado.queryPlanner.winningPlan.stage;

    print("----- " + label + " -----");
    print("Estagio do plano: " + estagio);
    print("Documentos examinados: " + stats.totalDocsExamined);
    print("Documentos retornados: " + stats.nReturned);
    print("Tempo de execucao (ms): " + stats.executionTimeMillis);
    print("");
}

// amostra real do banco pra busca encontrar resultado
const livroAmostra = db.livros.findOne();
const usuarioAmostra = db.usuarios.findOne();

const tituloTeste = livroAmostra.titulo;
const autorTeste = livroAmostra.autor;
const isbnTeste = livroAmostra.isbn;
const categoriaTeste = livroAmostra.categoria;
const emailTeste = usuarioAmostra.email;
const cursoTeste = usuarioAmostra.curso;

print("Valores de teste usados:");
print("titulo=" + tituloTeste + " | autor=" + autorTeste + " | isbn=" + isbnTeste);
print("categoria=" + categoriaTeste + " | email=" + emailTeste + " | curso=" + cursoTeste);
print("");

print("================ ANTES DOS INDICES ================");
print("");

rodarExplain(db.livros.find({ titulo: tituloTeste }), "Busca por titulo");
rodarExplain(db.livros.find({ autor: autorTeste }), "Busca por autor");
rodarExplain(db.livros.find({ isbn: isbnTeste }), "Busca por isbn");
rodarExplain(db.livros.find({ categoria: categoriaTeste }), "Busca por categoria");
rodarExplain(db.usuarios.find({ email: emailTeste }), "Busca por email");
rodarExplain(db.usuarios.find({ curso: cursoTeste }), "Busca por curso");

print("================ CRIANDO INDICES ================");

db.livros.createIndex({ titulo: 1 });
db.livros.createIndex({ autor: 1 });
db.livros.createIndex({ isbn: 1 }, { unique: true });
db.livros.createIndex({ categoria: 1 });
db.usuarios.createIndex({ email: 1 }, { unique: true });
db.usuarios.createIndex({ curso: 1 });

print("Indices criados com sucesso.");
print("");

print("================ DEPOIS DOS INDICES ================");
print("");

rodarExplain(db.livros.find({ titulo: tituloTeste }), "Busca por titulo");
rodarExplain(db.livros.find({ autor: autorTeste }), "Busca por autor");
rodarExplain(db.livros.find({ isbn: isbnTeste }), "Busca por isbn");
rodarExplain(db.livros.find({ categoria: categoriaTeste }), "Busca por categoria");
rodarExplain(db.usuarios.find({ email: emailTeste }), "Busca por email");
rodarExplain(db.usuarios.find({ curso: cursoTeste }), "Busca por curso");

print("================ INDICES CRIADOS (CONFERENCIA) ================");
print("Indices em livros:");
db.livros.getIndexes().forEach(function (idx) { printjson(idx); });
print("Indices em usuarios:");
db.usuarios.getIndexes().forEach(function (idx) { printjson(idx); });
