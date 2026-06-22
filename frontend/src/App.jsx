import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BuscaLivros from './pages/BuscaLivros';
import Historico from './pages/Historico';
import Ranking from './pages/Ranking';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/buscar" element={<BuscaLivros />} />
                <Route path="/historico" element={<Historico />} />
                <Route path="/ranking" element={<Ranking />} />
            </Routes>
        </Layout>
    );
}

export default App;
