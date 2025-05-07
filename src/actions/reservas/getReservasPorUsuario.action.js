const db = require('../../config/db');

const getReservasPorUsuarioAction = async (usuario_id) => {
  const result = await db.query(
    `SELECT r.*, l.titulo FROM reservas r
     JOIN libros l ON r.libro_id = l.id
     WHERE r.usuario_id = $1`,
    [usuario_id]
  );

  return result.rows;
};

module.exports = getReservasPorUsuarioAction;
