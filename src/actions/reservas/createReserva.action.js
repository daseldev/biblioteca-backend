const db = require('../../config/db');

const createReservaAction = async ({ usuario_id, libro_id, fecha_entrega }) => {
  // Verificar disponibilidad
  const libro = await db.query(
    'SELECT * FROM libros WHERE id = $1 AND eliminado = FALSE AND disponible = TRUE',
    [libro_id]
  );

  if (libro.rows.length === 0) return null;

  // Crear la reserva
  const reserva = await db.query(
    `INSERT INTO reservas (usuario_id, libro_id, fecha_entrega)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [usuario_id, libro_id, fecha_entrega]
  );

  // Marcar el libro como no disponible
  await db.query('UPDATE libros SET disponible = FALSE WHERE id = $1', [libro_id]);

  return reserva.rows[0];
};

module.exports = createReservaAction;
