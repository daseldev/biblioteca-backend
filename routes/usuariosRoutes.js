const express = require('express');
const router = express.Router();

const {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuariosController');

const verificarToken = require('../middlewares/verificarToken');

router.post('/register', registrarUsuario);               // Registro
router.post('/login', loginUsuario);                      // Login
router.get('/perfil', verificarToken, obtenerPerfil);     // Ver perfil propio
router.put('/:id', verificarToken, actualizarUsuario);    // Actualizar usuario
router.delete('/:id', verificarToken, eliminarUsuario);   // Eliminar (soft delete)

module.exports = router;
