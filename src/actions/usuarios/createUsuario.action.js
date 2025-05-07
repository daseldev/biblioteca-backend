const db = require('../../config/db');
const bcrypt = require('bcrypt');

const createUsuarioAction = async ({ nombre, correo, contraseña }) => {
  const pepper = process.env.PEPPER;
  const contraseñaConPepper = contraseña + pepper;
  const hashedPassword = await bcrypt.hash(contraseñaConPepper, 10);

  const result = await db.query(
    'INSERT INTO usuarios (nombre, correo, contraseña) VALUES ($1, $2, $3) RETURNING id, nombre, correo',
    [nombre, correo, hashedPassword]
  );

  return result.rows[0];
};

module.exports = createUsuarioAction;
