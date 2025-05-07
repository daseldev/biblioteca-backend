const createReservaAction = require('../actions/reservas/createReserva.action');
const getReservasPorUsuarioAction = require('../actions/reservas/getReservasPorUsuario.action');
const getReservasPorLibroAction = require('../actions/reservas/getReservasPorLibro.action');
const devolverReservaAction = require('../actions/reservas/devolverReserva.action');

const crearReserva = async (req, res) => {
  const { libro_id, fecha_entrega } = req.body;
  const usuario_id = req.usuario.id;

  try {
    const reserva = await createReservaAction({ usuario_id, libro_id, fecha_entrega });
    if (!reserva) {
      return res.status(400).json({ error: 'Libro no disponible o no existe' });
    }
    res.status(201).json({ mensaje: 'Reserva realizada con éxito', reserva });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
};

const obtenerReservasPorUsuario = async (req, res) => {
  const usuario_id = req.usuario.id;

  try {
    const reservas = await getReservasPorUsuarioAction(usuario_id);
    res.json({ reservas });
  } catch (error) {
    console.error('Error al obtener reservas del usuario:', error);
    res.status(500).json({ error: 'Error al obtener historial de reservas del usuario' });
  }
};

const obtenerReservasPorLibro = async (req, res) => {
  const libro_id = req.params.id;

  try {
    const historial = await getReservasPorLibroAction(libro_id);
    res.json({ historial });
  } catch (error) {
    console.error('Error al obtener historial del libro:', error);
    res.status(500).json({ error: 'Error al obtener historial de reservas del libro' });
  }
};

const devolverReserva = async (req, res) => {
  const reserva_id = req.params.id;
  const usuario_id = req.usuario.id;

  try {
    const exito = await devolverReservaAction(reserva_id, usuario_id);
    if (!exito) {
      return res.status(403).json({ error: 'Reserva no encontrada o ya fue devuelta' });
    }
    res.json({ mensaje: 'Reserva devuelta con éxito' });
  } catch (error) {
    console.error('Error al devolver reserva:', error);
    res.status(500).json({ error: 'Error al procesar devolución' });
  }
};

module.exports = {
  crearReserva,
  obtenerReservasPorUsuario,
  obtenerReservasPorLibro,
  devolverReserva
};
