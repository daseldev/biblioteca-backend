const db = require('../../config/db');

const deleteUsuarioAction = async (id) => {
  const result = await db.query(
    `UPDATE usuarios SET eliminado = TRUE WHERE id = $1 AND eliminado = FALSE RETURNING id, nombre, correo`,
    [id]
  );

  return result.rows[0] || null;
};

module.exports = deleteUsuarioAction;
