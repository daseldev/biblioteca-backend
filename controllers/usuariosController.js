const bcrypt = require('bcrypt');
const db = require('../config/db');

const registrarUsuario = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const result = await db.query(
      'INSERT INTO usuarios (nombre, correo, contraseña) VALUES ($1, $2, $3) RETURNING id, nombre, correo',
      [nombre, correo, hashedPassword]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error('Error registrando usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

const jwt = require('jsonwebtoken');

const loginUsuario = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM usuarios WHERE correo = $1 AND eliminado = FALSE',
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const usuario = result.rows[0];
    const passwordMatch = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        correo: usuario.correo,
        permisos: usuario.permisos
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      mensaje: 'Login exitoso',
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
};

module.exports = { registrarUsuario, loginUsuario };

