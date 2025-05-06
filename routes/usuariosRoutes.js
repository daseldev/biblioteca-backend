const express = require('express');
const router = express.Router();
const {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  actualizarUsuario
} = require('../controllers/usuariosController');
const verificarToken = require('../middlewares/verificarToken');

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/:id', verificarToken, actualizarUsuario);

module.exports = router;
