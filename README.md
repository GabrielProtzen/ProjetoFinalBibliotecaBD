# Sistema de Biblioteca Inteligente com MongoDB Atlas

Trabalho final da disciplina de Tópicos em Banco de Dados — IFSul Campus Pelotas, curso de Sistemas para Internet (TSI).

Sistema completo de gerenciamento de biblioteca, explorando modelagem de documentos, índices, agregações, Atlas Search, Atlas Triggers, transações multi-documento, controle de acesso e uma aplicação web integrada.

## Tecnologias

- Backend: Node.js, Express, Mongoose
- Frontend: React (Vite), React Router, Axios
- Banco de dados: MongoDB Atlas (cluster M0)
## Estrutura do projeto

```
projeto/
├── backend/
│   ├── config/db.js
│   ├── models/            (Usuario, Livro, Emprestimo, Reserva, Avaliacao, Log)
│   ├── controllers/
│   ├── routes/
│   ├── utils/auditoria.js
│   ├── atlas-triggers/    (código de referência dos 3 Atlas Triggers)
│   ├── dadosbiblioteca.js (script de carga inicial)
│   ├── indices.js         (script de criação de índices + comparação explain())
│   ├── dashboard-data.js  (materialização de dados para o MongoDB Charts)
│   ├── requests.http      (coleção de testes da API)
│   └── app.js
├── frontend/
│   └── src/
│       ├── components/Layout.jsx
│       ├── pages/         (Dashboard, BuscaLivros, Historico, Ranking)
│       └── services/api.js
└── README.md
└── dadosbiblioteca.js
```

## Pré-requisitos

- Node.js 18+
- Conta no MongoDB Atlas com um cluster criado (testado em tier M0 gratuito)
- mongosh instalado (para rodar os scripts auxiliares)

## Configuração

### 1. Backend

```bash
cd backend
npm install
```

**Obs: O .env com minhas credenciais esta diponivel para uso na pasta backend, abaixo esta apenas o passo a passo feito.**

Crie um arquivo `.env` dentro de `backend/` com suas credenciais do Atlas:
```
MONGODB_USERNAME="seu_usuario"
MONGODB_PASSWORD="sua_senha"
MONGODB_URI="mongodb+srv://usuario:senha@seu-cluster.mongodb.net/biblioteca?retryWrites=true&w=majority"
```

### 2. Carga inicial dos dados

Com o `.env` configurado, rode pelo mongosh:

```bash
mongosh "sua-connection-string" --file dadosbiblioteca.js
```

Isso popula o banco com 100 usuários, 500 livros, 1000 empréstimos, 300 reservas e 1000 avaliações.

### 3. Índices

```bash
mongosh "sua-connection-string" --file indices.js
```

### 4. Rodando o backend

```bash
npm run dev
```

API disponível em `http://localhost:3000`.

### 5. Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Principais rotas da API

### Livros
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/livros` | Lista livros |
| GET | `/api/livros/:id` | Busca livro por ID |
| POST | `/api/livros` | Insere livro |
| PATCH | `/api/livros/:id/quantidade` | Atualiza quantidade |
| PATCH | `/api/livros/:id/categoria` | Altera categoria |
| DELETE | `/api/livros/:id` | Remove livro |

### Usuários
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/usuarios` | Lista usuários |
| PATCH | `/api/usuarios/:id/bloquear` | Bloqueia usuário |
| PATCH | `/api/usuarios/:id/reativar` | Reativa usuário |
| PATCH | `/api/usuarios/:id/curso` | Altera curso |

### Empréstimos / Reservas / Avaliações
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/emprestimos` | Realiza empréstimo |
| PATCH | `/api/emprestimos/:id/devolucao` | Registra devolução |
| PATCH | `/api/emprestimos/:id/renovar` | Renova empréstimo |
| POST | `/api/reservas` | Realiza reserva |
| PATCH | `/api/reservas/:id/finalizar` | Finaliza reserva |
| DELETE | `/api/reservas/:id` | Cancela reserva |
| POST | `/api/avaliacoes` | Cria avaliação |

### Consultas, agregações e lookups (Partes 4, 5 e 6)
| Método | Rota |
|---|---|
| GET | `/api/consultas/livros-por-categoria-ano` |
| GET | `/api/consultas/usuarios-recentes` |
| GET | `/api/consultas/emprestimos-atrasados` |
| GET | `/api/consultas/livros-nunca-emprestados` |
| GET | `/api/consultas/top-usuarios-emprestimos` |
| GET | `/api/agregacoes/livros-por-categoria` |
| GET | `/api/agregacoes/media-avaliacoes-por-livro` |
| GET | `/api/agregacoes/top10-livros-mais-emprestados` |
| GET | `/api/agregacoes/cursos-que-mais-utilizam` |
| GET | `/api/agregacoes/taxa-devolucao-por-mes` |
| GET | `/api/agregacoes/ranking-autores-mais-lidos` |
| GET | `/api/agregacoes/livros-nota-media-baixa` |
| GET | `/api/lookups/emprestimos-detalhados` |
| GET | `/api/lookups/avaliacoes-detalhadas` |
| GET | `/api/lookups/relatorio-usuario/:id` |

### Atlas Search (Parte 8)
| Método | Rota |
|---|---|
| GET | `/api/search/livros?termo=` |
| GET | `/api/search/livros-similares?termo=` |
| GET | `/api/search/autocomplete-titulo?termo=` |

### Transações e Dashboard (Partes 12 e 16)
| Método | Rota |
|---|---|
| POST | `/api/transacoes/emprestimo` |
| GET | `/api/dashboard/resumo` |

## Observações

- **Atlas Triggers** (Parte 9), o índice de **Atlas Search**, a **IP Access List**, os **usuários/roles do banco** e o dashboard de **MongoDB Charts** (Parte 10) foram configurados manualmente pela interface web do Atlas, e não fazem parte do código desse repositório, e estão documentados com capturas de tela no PDF de entrega. O código de referência dos 3 Atlas Triggers está disponível em `backend/atlas-triggers/`.
- A auditoria de operações administrativas é feita em duas camadas complementares: Atlas Triggers (reagem a mudanças no banco) e chamadas explícitas de `utils/auditoria.js` a partir do próprio código da aplicação.

## Autor

Gabriel Protzen de Castro — Sistemas para Internet (TSI), IFSul Campus Pelotas
