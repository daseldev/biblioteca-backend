const db = require('../../config/db');

const getPerfilUsuarioAction = async (id) => {
  const result = await db.query(
    'SELECT id, nombre, correo, permisos FROM usuarios WHERE id = $1 AND eliminado = FALSE',
    [id]
  );

  return result.rows[0] || null;
};

module.exports = getPerfilUsuarioAction;
