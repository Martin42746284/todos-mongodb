import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { DATABASE_URL, PORT } = process.env;

mongoose.connect(DATABASE_URL || 'mongodb://127.0.0.1:27017', {
  dbName: 'todos'
})
  .then(() => {
    console.log('MongoDB connecté à la base "todos"');
    app.listen(PORT || 5000, () => {
      console.log(`Serveur lancé sur le port ${PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('Erreur MongoDB :', err);
  });
