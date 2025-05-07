const db = require('../../config/db');

const findUsuarioByCorreoAction = async (correo) => {
  const result = await db.query(
    'SELECT * FROM usuarios WHERE correo = $1 AND eliminado = FALSE',
    [correo]
  );

  return result.rows[0] || null;
};

module.exports = findUsuarioByCorreoAction;
