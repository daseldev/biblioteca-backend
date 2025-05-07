const db = require('../../config/db');

const devolverReservaAction = async (reserva_id, usuario_id) => {
  const reserva = await db.query(
    `SELECT * FROM reservas WHERE id = $1 AND usuario_id = $2 AND devuelto = FALSE`,
    [reserva_id, usuario_id]
  );

  if (reserva.rows.length === 0) return null;

  const libro_id = reserva.rows[0].libro_id;

  await db.query(
    `UPDATE reservas SET devuelto = TRUE WHERE id = $1`,
    [reserva_id]
  );

  await db.query(
    `UPDATE libros SET disponible = TRUE WHERE id = $1`,
    [libro_id]
  );

  return true;
};

module.exports = devolverReservaAction;
