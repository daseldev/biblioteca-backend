const db = require('../../config/db');

const getReservasPorLibroAction = async (libro_id) => {
  const result = await db.query(
    `SELECT r.*, u.nombre AS nombre_usuario FROM reservas r
     JOIN usuarios u ON r.usuario_id = u.id
     WHERE r.libro_id = $1`,
    [libro_id]
  );

  return result.rows;
};

module.exports = getReservasPorLibroAction;
