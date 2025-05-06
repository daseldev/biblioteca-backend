// ───────────────────────────────────────────────
// 📦 Dependencias principales
// ───────────────────────────────────────────────
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ───────────────────────────────────────────────
// 🗃️ Configuración de base de datos
// ───────────────────────────────────────────────
const db = require('./config/db'); // Ejecuta conexión a PostgreSQL

// ───────────────────────────────────────────────
// 🚀 Inicializar aplicación
// ───────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;

// ───────────────────────────────────────────────
// 🧩 Middlewares
// ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ───────────────────────────────────────────────
// 🔌 Rutas
// ───────────────────────────────────────────────
const usuariosRoutes = require('./routes/usuariosRoutes');
const librosRoutes = require('./routes/librosRoutes');
const reservasRoutes = require('./routes/reservasRoutes');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/libros', librosRoutes);
app.use('/api/reservas', reservasRoutes);

// ───────────────────────────────────────────────
// 🏠 Ruta principal
// ───────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("API de biblioteca funcionando 🎉");
});

// ───────────────────────────────────────────────
// 🟢 Iniciar servidor
// ───────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
