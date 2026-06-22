require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const livroRoutes = require('./routes/livroRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const emprestimoRoutes = require('./routes/emprestimoRoutes');
const consultaRoutes = require('./routes/consultaRoutes');
const agregacaoRoutes = require('./routes/agregacaoRoutes');
const lookupRoutes = require('./routes/lookupRoutes');
const searchRoutes = require('./routes/searchRoutes');
const transacaoRoutes = require('./routes/transacaoRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.json({ status: 'API Biblioteca rodando', timestamp: new Date() });
});

app.use('/api/livros', livroRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/emprestimos', emprestimoRoutes);
app.use('/api/consultas', consultaRoutes);
app.use('/api/agregacoes', agregacaoRoutes);
app.use('/api/lookups', lookupRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/transacoes', transacaoRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/avaliacoes', avaliacaoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
