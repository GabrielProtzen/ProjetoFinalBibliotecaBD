import { useEffect, useState } from 'react';
import {
    dashboardResumo,
    livrosPorCategoria,
    cursosQueMaisUtilizam,
    topUsuariosEmprestimos
} from '../services/api';
import './Dashboard.css';

function Dashboard() {
    const [resumo, setResumo] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [topUsuarios, setTopUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        async function carregar() {
            try {
                const [resumoData, categoriasData, cursosData, usuariosData] = await Promise.all([
                    dashboardResumo(),
                    livrosPorCategoria(),
                    cursosQueMaisUtilizam(),
                    topUsuariosEmprestimos(5)
                ]);
                setResumo(resumoData);
                setCategorias(categoriasData);
                setCursos(cursosData);
                setTopUsuarios(usuariosData);
            } catch (err) {
                setErro('Não foi possível carregar o dashboard. Verifique se o backend está rodando em localhost:3000.');
            } finally {
                setCarregando(false);
            }
        }
        carregar();
    }, []);

    const maiorCategoria = categorias.length > 0 ? Math.max(...categorias.map((c) => c.totalLivros)) : 1;
    const maiorCurso = cursos.length > 0 ? Math.max(...cursos.map((c) => c.totalEmprestimos)) : 1;

    return (
        <div>
            <div className="page-header">
                <span className="page-eyebrow">Visão Geral</span>
                <h1>Dashboard Administrativo</h1>
                <p>Indicadores gerais do acervo, empréstimos e uso da biblioteca.</p>
            </div>

            {erro && <div className="feedback feedback--erro">{erro}</div>}

            {carregando ? (
                <p className="catalog-card-meta">Carregando indicadores...</p>
            ) : (
                <>
                    <div className="kpi-grid">
                        <div className="kpi-card">
                            <span className="kpi-value">{resumo.totalLivros}</span>
                            <span className="kpi-label">Livros no acervo</span>
                        </div>
                        <div className="kpi-card">
                            <span className="kpi-value">{resumo.usuariosAtivos}</span>
                            <span className="kpi-label">Usuários ativos</span>
                        </div>
                        <div className="kpi-card">
                            <span className="kpi-value">{resumo.emprestimosAtivos}</span>
                            <span className="kpi-label">Empréstimos em aberto</span>
                        </div>
                        <div className="kpi-card kpi-card--alerta">
                            <span className="kpi-value">{resumo.emprestimosAtrasados}</span>
                            <span className="kpi-label">Empréstimos atrasados</span>
                        </div>
                        <div className="kpi-card">
                            <span className="kpi-value">{resumo.reservasAtivas}</span>
                            <span className="kpi-label">Reservas ativas</span>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        <div>
                            <h2 className="section-title">Livros por Categoria</h2>
                            <div className="mini-bar-list">
                                {categorias.map((c) => (
                                    <div key={c._id} className="mini-bar-row">
                                        <span className="mini-bar-label">{c._id}</span>
                                        <div className="mini-bar-track">
                                            <div
                                                className="mini-bar-fill"
                                                style={{ width: `${(c.totalLivros / maiorCategoria) * 100}%` }}
                                            />
                                        </div>
                                        <span className="mini-bar-value mono">{c.totalLivros}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="section-title">Cursos que Mais Usam a Biblioteca</h2>
                            <div className="mini-bar-list">
                                {cursos.map((c) => (
                                    <div key={c.curso} className="mini-bar-row">
                                        <span className="mini-bar-label">{c.curso}</span>
                                        <div className="mini-bar-track mini-bar-track--brass">
                                            <div
                                                className="mini-bar-fill mini-bar-fill--brass"
                                                style={{ width: `${(c.totalEmprestimos / maiorCurso) * 100}%` }}
                                            />
                                        </div>
                                        <span className="mini-bar-value mono">{c.totalEmprestimos}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <h2 className="section-title">Top 5 Usuários com Mais Empréstimos</h2>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Posição</th>
                                <th>Usuário</th>
                                <th>Email</th>
                                <th>Total de Empréstimos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topUsuarios.map((u, index) => (
                                <tr key={u.usuario_id}>
                                    <td className="mono">{index + 1}</td>
                                    <td>{u.nome}</td>
                                    <td className="mono">{u.email}</td>
                                    <td className="mono">{u.totalEmprestimos}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default Dashboard;
