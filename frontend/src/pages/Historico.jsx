import { useEffect, useState } from 'react';
import { listarUsuarios, relatorioUsuario } from '../services/api';
import './Historico.css';

function formatarData(dataIso) {
    if (!dataIso) return '—';
    return new Date(dataIso).toLocaleDateString('pt-BR');
}

function Historico() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioId, setUsuarioId] = useState('');
    const [relatorio, setRelatorio] = useState(null);
    const [carregandoLista, setCarregandoLista] = useState(true);
    const [carregandoRelatorio, setCarregandoRelatorio] = useState(false);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        listarUsuarios(200)
            .then(setUsuarios)
            .catch(() => setErro('Não foi possível carregar a lista de usuários.'))
            .finally(() => setCarregandoLista(false));
    }, []);

    useEffect(() => {
        if (!usuarioId) {
            setRelatorio(null);
            return;
        }

        setCarregandoRelatorio(true);
        setErro(null);

        relatorioUsuario(usuarioId)
            .then(setRelatorio)
            .catch(() => setErro('Não foi possível carregar o histórico desse usuário.'))
            .finally(() => setCarregandoRelatorio(false));
    }, [usuarioId]);

    return (
        <div>
            <div className="page-header">
                <span className="page-eyebrow">Ficha do Leitor</span>
                <h1>Histórico do Usuário</h1>
                <p>Selecione um usuário para consultar seus empréstimos, reservas e avaliações.</p>
            </div>

            <div className="field-group historico-select">
                <label htmlFor="usuario-select">Usuário</label>
                <select
                    id="usuario-select"
                    value={usuarioId}
                    onChange={(e) => setUsuarioId(e.target.value)}
                    disabled={carregandoLista}
                >
                    <option value="">
                        {carregandoLista ? 'Carregando usuários...' : 'Selecione um usuário...'}
                    </option>
                    {usuarios.map((u) => (
                        <option key={u._id} value={u._id}>
                            {u.nome} — {u.curso}
                        </option>
                    ))}
                </select>
            </div>

            {erro && <div className="feedback feedback--erro">{erro}</div>}

            {carregandoRelatorio && <p className="catalog-card-meta">Carregando histórico...</p>}

            {!carregandoRelatorio && relatorio && (
                <div className="historico-content">
                    <div className="catalog-card ficha-pessoal">
                        <div className="catalog-card-title">{relatorio.nome}</div>
                        <div className="catalog-card-meta">{relatorio.email}</div>
                        <div className="ficha-pessoal-grid">
                            <span>
                                <strong>Curso:</strong> {relatorio.curso}
                            </span>
                            <span>
                                <strong>Cidade:</strong> {relatorio.cidade}
                            </span>
                            <span>
                                <strong>Cadastro:</strong> {formatarData(relatorio.dataCadastro)}
                            </span>
                            <span className={`stamp ${relatorio.ativo ? 'stamp--ativo' : 'stamp--bloqueado'}`}>
                                {relatorio.ativo ? 'Ativo' : 'Bloqueado'}
                            </span>
                        </div>
                    </div>

                    <h2 className="section-title">Empréstimos ({relatorio.emprestimos.length})</h2>
                    {relatorio.emprestimos.length === 0 ? (
                        <div className="empty-state">Nenhum empréstimo registrado.</div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Livro</th>
                                    <th>Empréstimo</th>
                                    <th>Devolução prevista</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {relatorio.emprestimos.map((emp) => {
                                    const atrasado =
                                        emp.status === 'emprestado' &&
                                        new Date(emp.dataPrevistaDevolucao) < new Date();
                                    return (
                                        <tr key={emp._id}>
                                            <td>{emp.livro?.titulo || '—'}</td>
                                            <td className="mono">{formatarData(emp.dataEmprestimo)}</td>
                                            <td className="mono">{formatarData(emp.dataPrevistaDevolucao)}</td>
                                            <td>
                                                <span
                                                    className={`stamp ${
                                                        atrasado
                                                            ? 'stamp--atrasado'
                                                            : emp.status === 'devolvido'
                                                              ? 'stamp--disponivel'
                                                              : 'stamp--emprestado'
                                                    }`}
                                                >
                                                    {atrasado ? 'Atrasado' : emp.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    <h2 className="section-title">Reservas ({relatorio.reservas.length})</h2>
                    {relatorio.reservas.length === 0 ? (
                        <div className="empty-state">Nenhuma reserva registrada.</div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Livro</th>
                                    <th>Data da reserva</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {relatorio.reservas.map((res) => (
                                    <tr key={res._id}>
                                        <td>{res.livro?.titulo || '—'}</td>
                                        <td className="mono">{formatarData(res.dataReserva)}</td>
                                        <td>
                                            <span
                                                className={`stamp ${
                                                    res.status === 'ativa' ? 'stamp--ativo' : 'stamp--disponivel'
                                                }`}
                                            >
                                                {res.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <h2 className="section-title">Avaliações ({relatorio.avaliacoes.length})</h2>
                    {relatorio.avaliacoes.length === 0 ? (
                        <div className="empty-state">Nenhuma avaliação registrada.</div>
                    ) : (
                        <div className="avaliacoes-list">
                            {relatorio.avaliacoes.map((av) => (
                                <div key={av._id} className="catalog-card">
                                    <div className="catalog-card-title">{av.livro?.titulo || '—'}</div>
                                    <div className="catalog-card-meta">
                                        {'★'.repeat(av.nota)}
                                        {'☆'.repeat(5 - av.nota)} · {formatarData(av.data)}
                                    </div>
                                    {av.comentario && <p className="avaliacao-comentario">&quot;{av.comentario}&quot;</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {!usuarioId && !carregandoLista && (
                <div className="empty-state">Selecione um usuário acima para ver o histórico.</div>
            )}
        </div>
    );
}

export default Historico;
