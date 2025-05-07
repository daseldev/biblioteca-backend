const db = require('../../config/db');
const bcrypt = require('bcrypt');

const updateUsuarioAction = async (id, data) => {
  const campos = [];
  const valores = [];
  let i = 1;

  if (data.nombre) {
    campos.push(`nombre = $${i++}`);
    valores.push(data.nombre);
  }

  if (data.correo) {
    campos.push(`correo = $${i++}`);
    valores.push(data.correo);
  }

  if (data.contraseña) {
    const pepper = process.env.PEPPER;
    const hashed = await bcrypt.hash(data.contraseña + pepper, 10);
    campos.push(`contraseña = $${i++}`);
    valores.push(hashed);
  }

  if (campos.length === 0) return null;

  valores.push(id);
  const result = await db.query(
    `UPDATE usuarios SET ${campos.join(', ')} WHERE id = $${i} AND eliminado = FALSE RETURNING id, nombre, correo`,
    valores
  );

  return result.rows[0] || null;
};

module.exports = updateUsuarioAction;
