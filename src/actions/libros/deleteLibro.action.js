const db = require('../../config/db');

const deleteLibroAction = async (id) => {
  const result = await db.query(
    `UPDATE libros SET eliminado = TRUE WHERE id = $1 AND eliminado = FALSE RETURNING *`,
    [id]
  );

  return result.rows[0] || null;
};

module.exports = deleteLibroAction;
