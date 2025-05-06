const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const registrarUsuario = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    const pepper = process.env.PEPPER;
    const contraseñaConPepper = contraseña + pepper;
    const hashedPassword = await bcrypt.hash(contraseñaConPepper, 10);
    

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
    const pepper = process.env.PEPPER;
    const contraseñaConPepper = contraseña + pepper;
    const passwordMatch = await bcrypt.compare(contraseñaConPepper, usuario.contraseña);
    

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

const obtenerPerfil = async (req, res) => {
  const { id } = req.usuario;

  try {
    const result = await db.query(
      'SELECT id, nombre, correo, permisos FROM usuarios WHERE id = $1 AND eliminado = FALSE',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado o eliminado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

const actualizarUsuario = async (req, res) => {
  const usuarioAutenticado = req.usuario;
  const usuarioId = parseInt(req.params.id);
  const { nombre, correo, contraseña } = req.body;

  const esMismoUsuario = usuarioAutenticado.id === usuarioId;
  const tienePermiso = usuarioAutenticado.permisos.includes('modificar_usuarios');

  if (!esMismoUsuario && !tienePermiso) {
    return res.status(403).json({ error: 'No tienes permiso para modificar este usuario' });
  }

  try {
    const campos = [];
    const valores = [];
    let i = 1;

    if (nombre) {
      campos.push(`nombre = $${i++}`);
      valores.push(nombre);
    }

    if (correo) {
      campos.push(`correo = $${i++}`);
      valores.push(correo);
    }

    if (contraseña) {
      const hashed = await bcrypt.hash(contraseña, 10);
      campos.push(`contraseña = $${i++}`);
      valores.push(hashed);
    }

    if (campos.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    valores.push(usuarioId); // para el WHERE

    const query = `UPDATE usuarios SET ${campos.join(', ')} WHERE id = $${i} AND eliminado = FALSE RETURNING id, nombre, correo`;
    const result = await db.query(query, valores);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado o eliminado' });
    }

    res.json({ mensaje: 'Usuario actualizado', usuario: result.rows[0] });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

const eliminarUsuario = async (req, res) => {
  const usuarioAutenticado = req.usuario;
  const usuarioId = parseInt(req.params.id);

  const esMismoUsuario = usuarioAutenticado.id === usuarioId;
  const tienePermiso = usuarioAutenticado.permisos.includes('inhabilitar_usuarios');

  if (!esMismoUsuario && !tienePermiso) {
    return res.status(403).json({ error: 'No tienes permiso para eliminar este usuario' });
  }

  try {
    const result = await db.query(
      `UPDATE usuarios SET eliminado = TRUE WHERE id = $1 AND eliminado = FALSE RETURNING id, nombre, correo`,
      [usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado o ya eliminado' });
    }

    res.json({ mensaje: 'Usuario inhabilitado (soft delete)', usuario: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  actualizarUsuario,
  eliminarUsuario
};
