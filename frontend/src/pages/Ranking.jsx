import { useEffect, useState } from 'react';
import { top10LivrosMaisEmprestados, rankingAutoresMaisLidos } from '../services/api';
import './Ranking.css';

function Ranking() {
    const [livros, setLivros] = useState([]);
    const [autores, setAutores] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        async function carregar() {
            try {
                const [livrosData, autoresData] = await Promise.all([
                    top10LivrosMaisEmprestados(),
                    rankingAutoresMaisLidos()
                ]);
                setLivros(livrosData);
                setAutores(autoresData.slice(0, 10));
            } catch (err) {
                setErro('Não foi possível carregar o ranking. Verifique se o backend está rodando em localhost:3000.');
            } finally {
                setCarregando(false);
            }
        }
        carregar();
    }, []);

    const maiorTotal = livros.length > 0 ? livros[0].totalEmprestimos : 1;

    return (
        <div>
            <div className="page-header">
                <span className="page-eyebrow">Mais Procurados</span>
                <h1>Ranking de Livros</h1>
                <p>Os títulos mais emprestados da biblioteca, calculados a partir do histórico de empréstimos.</p>
            </div>

            {erro && <div className="feedback feedback--erro">{erro}</div>}

            {carregando ? (
                <p className="catalog-card-meta">Carregando ranking...</p>
            ) : livros.length === 0 ? (
                <div className="empty-state">Nenhum empréstimo registrado ainda.</div>
            ) : (
                <div className="ranking-list">
                    {livros.map((livro, index) => (
                        <div key={`${livro.titulo}-${index}`} className="ranking-item">
                            <span className="ranking-position">{index + 1}</span>
                            <div className="ranking-info">
                                <span className="catalog-card-title">{livro.titulo}</span>
                                <span className="catalog-card-meta">{livro.autor}</span>
                            </div>
                            <div className="ranking-bar-track">
                                <div
                                    className="ranking-bar-fill"
                                    style={{ width: `${(livro.totalEmprestimos / maiorTotal) * 100}%` }}
                                />
                            </div>
                            <span className="stamp stamp--emprestado">{livro.totalEmprestimos}x</span>
                        </div>
                    ))}
                </div>
            )}

            <h2 className="section-title">Autores Mais Lidos</h2>

            {!carregando && autores.length > 0 && (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Autor</th>
                            <th>Total de Leituras</th>
                        </tr>
                    </thead>
                    <tbody>
                        {autores.map((autor, index) => (
                            <tr key={autor.autor}>
                                <td className="mono">{index + 1}</td>
                                <td>{autor.autor}</td>
                                <td className="mono">{autor.totalLeituras}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Ranking;
