const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'biblioteca'
        });
        console.log('MongoDB conectado com sucesso');
    } catch (err) {
        console.error('Erro ao conectar no MongoDB:', err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
