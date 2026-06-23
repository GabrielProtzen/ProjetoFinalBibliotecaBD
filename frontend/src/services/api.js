import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

// ---------- Livros ----------
export const listarLivros = () => api.get('/livros').then((res) => res.data);
export const buscarLivroPorId = (id) => api.get(`/livros/${id}`).then((res) => res.data);
export const inserirLivro = (dados) => api.post('/livros', dados).then((res) => res.data);
export const atualizarQuantidadeLivro = (id, quantidade) =>
    api.patch(`/livros/${id}/quantidade`, { quantidade }).then((res) => res.data);
export const alterarCategoriaLivro = (id, categoria) =>
    api.patch(`/livros/${id}/categoria`, { categoria }).then((res) => res.data);
export const removerLivro = (id) => api.delete(`/livros/${id}`).then((res) => res.data);

// ---------- Usuarios ----------
export const listarUsuarios = (limite) => api.get('/usuarios', { params: { limite } }).then((res) => res.data);
export const buscarUsuarioPorId = (id) => api.get(`/usuarios/${id}`).then((res) => res.data);
export const bloquearUsuario = (id) => api.patch(`/usuarios/${id}/bloquear`).then((res) => res.data);
export const reativarUsuario = (id) => api.patch(`/usuarios/${id}/reativar`).then((res) => res.data);
export const alterarCursoUsuario = (id, curso) =>
    api.patch(`/usuarios/${id}/curso`, { curso }).then((res) => res.data);

// ---------- Emprestimos ----------
export const listarEmprestimos = () => api.get('/emprestimos').then((res) => res.data);
export const realizarEmprestimo = (usuario_id, livro_id) =>
    api.post('/emprestimos', { usuario_id, livro_id }).then((res) => res.data);
export const registrarDevolucao = (id) => api.patch(`/emprestimos/${id}/devolucao`).then((res) => res.data);
export const renovarEmprestimo = (id) => api.patch(`/emprestimos/${id}/renovar`).then((res) => res.data);

// ---------- Reservas ----------
export const listarReservas = () => api.get('/reservas').then((res) => res.data);
export const realizarReserva = (usuario_id, livro_id) =>
    api.post('/reservas', { usuario_id, livro_id }).then((res) => res.data);
export const finalizarReserva = (id) => api.patch(`/reservas/${id}/finalizar`).then((res) => res.data);
export const cancelarReserva = (id) => api.delete(`/reservas/${id}`).then((res) => res.data);

// ---------- Avaliacoes ----------
export const listarAvaliacoes = () => api.get('/avaliacoes').then((res) => res.data);
export const criarAvaliacao = (usuario_id, livro_id, nota, comentario) =>
    api.post('/avaliacoes', { usuario_id, livro_id, nota, comentario }).then((res) => res.data);
export const removerAvaliacao = (id) => api.delete(`/avaliacoes/${id}`).then((res) => res.data);

// ---------- Consultas (Parte 4) ----------
export const usuariosRecentes = (dias) =>
    api.get('/consultas/usuarios-recentes', { params: { dias } }).then((res) => res.data);
export const emprestimosAtrasados = () =>
    api.get('/consultas/emprestimos-atrasados').then((res) => res.data);
export const livrosNuncaEmprestados = () =>
    api.get('/consultas/livros-nunca-emprestados').then((res) => res.data);
export const topUsuariosEmprestimos = (limite) =>
    api.get('/consultas/top-usuarios-emprestimos', { params: { limite } }).then((res) => res.data);

// ---------- Agregacoes (Parte 5) ----------
export const livrosPorCategoria = () => api.get('/agregacoes/livros-por-categoria').then((res) => res.data);
export const top10LivrosMaisEmprestados = () =>
    api.get('/agregacoes/top10-livros-mais-emprestados').then((res) => res.data);
export const rankingAutoresMaisLidos = () =>
    api.get('/agregacoes/ranking-autores-mais-lidos').then((res) => res.data);

// ---------- Lookups (Parte 6) ----------
export const relatorioUsuario = (id) => api.get(`/lookups/relatorio-usuario/${id}`).then((res) => res.data);

// ---------- Atlas Search (Parte 8) ----------
export const buscarLivrosPorTermo = (termo) =>
    api.get('/search/livros', { params: { termo } }).then((res) => res.data);
export const buscarLivrosSimilares = (termo) =>
    api.get('/search/livros-similares', { params: { termo } }).then((res) => res.data);
export const autocompleteTitulo = (termo) =>
    api.get('/search/autocomplete-titulo', { params: { termo } }).then((res) => res.data);

export default api;
