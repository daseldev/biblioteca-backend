// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // Esto importa y ejecuta la conexión


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API de biblioteca funcionando 🎉");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

const usuariosRoutes = require('./routes/usuariosRoutes');
app.use('/api/usuarios', usuariosRoutes);

const librosRoutes = require('./routes/librosRoutes');
app.use('/api/libros', librosRoutes);

const reservasRoutes = require('./routes/reservasRoutes');
app.use('/api/reservas', reservasRoutes);


