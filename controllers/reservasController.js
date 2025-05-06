const db = require('../config/db');

const crearReserva = async (req, res) => {
  const { libro_id, fecha_entrega } = req.body;
  const usuario_id = req.usuario.id;

  try {
    // Verificar disponibilidad
    const libro = await db.query(
      'SELECT * FROM libros WHERE id = $1 AND eliminado = FALSE AND disponible = TRUE',
      [libro_id]
    );

    if (libro.rows.length === 0) {
      return res.status(400).json({ error: 'Libro no disponible o no existe' });
    }

    // Crear reserva
    const result = await db.query(
      `INSERT INTO reservas (usuario_id, libro_id, fecha_entrega)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [usuario_id, libro_id, fecha_entrega]
    );

    // Marcar libro como no disponible
    await db.query('UPDATE libros SET disponible = FALSE WHERE id = $1', [libro_id]);

    res.status(201).json({
      mensaje: 'Reserva realizada con éxito',
      reserva: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
};

const obtenerReservasPorUsuario = async (req, res) => {
  const usuario_id = req.usuario.id;

  try {
    const result = await db.query(
      `SELECT r.*, l.titulo FROM reservas r
       JOIN libros l ON r.libro_id = l.id
       WHERE r.usuario_id = $1`,
      [usuario_id]
    );

    res.json({ reservas: result.rows });
  } catch (error) {
    console.error('Error al obtener reservas del usuario:', error);
    res.status(500).json({ error: 'Error al obtener historial de reservas del usuario' });
  }
};

const obtenerReservasPorLibro = async (req, res) => {
  const libro_id = req.params.id;

  try {
    const result = await db.query(
      `SELECT r.*, u.nombre AS nombre_usuario FROM reservas r
       JOIN usuarios u ON r.usuario_id = u.id
       WHERE r.libro_id = $1`,
      [libro_id]
    );

    res.json({ historial: result.rows });
  } catch (error) {
    console.error('Error al obtener historial del libro:', error);
    res.status(500).json({ error: 'Error al obtener historial de reservas del libro' });
  }
};

const devolverReserva = async (req, res) => {
  const reserva_id = req.params.id;
  const usuario_id = req.usuario.id;

  try {
    // Verificar que la reserva existe y pertenece al usuario
    const reserva = await db.query(
      `SELECT * FROM reservas WHERE id = $1 AND usuario_id = $2 AND devuelto = FALSE`,
      [reserva_id, usuario_id]
    );

    if (reserva.rows.length === 0) {
      return res.status(403).json({ error: 'Reserva no encontrada o ya fue devuelta' });
    }

    const libro_id = reserva.rows[0].libro_id;

    // Marcar reserva como devuelta
    await db.query(
      `UPDATE reservas SET devuelto = TRUE WHERE id = $1`,
      [reserva_id]
    );

    // Marcar libro como disponible
    await db.query(
      `UPDATE libros SET disponible = TRUE WHERE id = $1`,
      [libro_id]
    );

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

