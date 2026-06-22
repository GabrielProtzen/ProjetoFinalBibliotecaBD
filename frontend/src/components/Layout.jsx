import { NavLink } from 'react-router-dom';
import './Layout.css';

const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/buscar', label: 'Buscar Livros' },
    { to: '/historico', label: 'Histórico do Usuário' },
    { to: '/ranking', label: 'Ranking de Livros' }
];

function Layout({ children }) {
    return (
        <div className="app-shell">
            <aside className="catalog-drawer">
                <div className="drawer-header">
                    <span className="drawer-eyebrow">Sistema de Biblioteca</span>
                    <h1 className="drawer-title">Catálogo</h1>
                </div>

                <nav className="drawer-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                'drawer-tab' + (isActive ? ' drawer-tab--active' : '')
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="drawer-footer">
                    <span className="drawer-footer-text">IFSul · Tópicos em Banco de Dados</span>
                </div>
            </aside>

            <main className="app-content">{children}</main>
        </div>
    );
}

export default Layout;
