import { useState, useEffect, useRef } from 'react';
import { buscarLivrosSimilares, autocompleteTitulo } from '../services/api';
import './BuscaLivros.css';

function BuscaLivros() {
    const [termo, setTermo] = useState('');
    const [sugestoes, setSugestoes] = useState([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [resultados, setResultados] = useState(null); //nenhuma busca feita ainda
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (termo.trim().length < 2) {
            setSugestoes([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            try {
                const dados = await autocompleteTitulo(termo.trim());
                setSugestoes(dados);
            } catch {
                setSugestoes([]);
            }
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [termo]);

    async function buscar(termoBusca) {
        const valor = (termoBusca ?? termo).trim();
        if (!valor) return;

        setCarregando(true);
        setErro(null);
        setMostrarSugestoes(false);

        try {
            const dados = await buscarLivrosSimilares(valor);
            setResultados(dados);
        } catch (err) {
            setErro('Não foi possível buscar. Verifique se o backend está rodando em localhost:3000.');
            setResultados([]);
        } finally {
            setCarregando(false);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        buscar();
    }

    function selecionarSugestao(titulo) {
        setTermo(titulo);
        buscar(titulo);
    }

    return (
        <div>
            <div className="page-header">
                <span className="page-eyebrow">Catálogo</span>
                <h1>Buscar Livros</h1>
                <p>Pesquise por título, autor ou palavra-chave. A busca tolera pequenos erros de digitação.</p>
            </div>

            <form className="search-form" onSubmit={handleSubmit} autoComplete="off">
                <div className="search-input-wrap">
                    <input
                        type="text"
                        placeholder="Digite um título, autor ou palavra-chave..."
                        value={termo}
                        onChange={(e) => setTermo(e.target.value)}
                        onFocus={() => setMostrarSugestoes(true)}
                        onBlur={() => setTimeout(() => setMostrarSugestoes(false), 150)}
                    />
                    {mostrarSugestoes && sugestoes.length > 0 && (
                        <ul className="suggestions-list">
                            {sugestoes.map((s, i) => (
                                <li key={i} onMouseDown={() => selecionarSugestao(s.titulo)}>
                                    {s.titulo}
                                    <span className="catalog-card-meta"> · {s.autor}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button type="submit" className="btn btn--primary">
                    Buscar
                </button>
            </form>

            {erro && <div className="feedback feedback--erro">{erro}</div>}

            {carregando && <p className="catalog-card-meta">Buscando...</p>}

            {!carregando && resultados !== null && resultados.length === 0 && (
                <div className="empty-state">Nenhum livro encontrado para &quot;{termo}&quot;.</div>
            )}

            {!carregando && resultados !== null && resultados.length > 0 && (
                <div className="catalog-grid">
                    {resultados.map((livro) => (
                        <div key={livro._id || livro.titulo} className="catalog-card">
                            <div className="catalog-card-title">{livro.titulo}</div>
                            <div className="catalog-card-meta">
                                {livro.autor} · {livro.categoria}
                            </div>
                            {livro.palavrasChave && livro.palavrasChave.length > 0 && (
                                <div className="tag-list">
                                    {livro.palavrasChave.map((p) => (
                                        <span key={p} className="tag">
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {resultados === null && !carregando && (
                <div className="empty-state">Digite algo na busca acima para ver os resultados.</div>
            )}
        </div>
    );
}

export default BuscaLivros;
