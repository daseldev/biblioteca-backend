const express = require('express');
const router = express.Router();

const {
    crearReserva,
    obtenerReservasPorUsuario,
    obtenerReservasPorLibro,
    devolverReserva
  } = require('../controllers/reservasController');
  

const verificarToken = require('../middlewares/verificarToken');

router.post('/', verificarToken, crearReserva);
router.get('/usuario', verificarToken, obtenerReservasPorUsuario);
router.get('/libro/:id', obtenerReservasPorLibro);
router.put('/:id/devolver', verificarToken, devolverReserva);


module.exports = router;
