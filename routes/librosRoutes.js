const express = require('express');
const router = express.Router();
const { crearLibro, obtenerLibros } = require('../controllers/librosController');
const { actualizarLibro } = require('../controllers/librosController');
const verificarToken = require('../middlewares/verificarToken');
const { eliminarLibro } = require('../controllers/librosController');

router.post('/', verificarToken, crearLibro); // Solo autenticados
router.get('/', obtenerLibros); // GET /api/libros
router.put('/:id', verificarToken, actualizarLibro); // PUT /api/libros/:id

router.delete('/:id', verificarToken, eliminarLibro);


module.exports = router;
