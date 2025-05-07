const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createUsuarioAction = require('../actions/usuarios/createUsuario.action');
const findUsuarioByCorreoAction = require('../actions/usuarios/findUsuarioByCorreo.action');
const getPerfilUsuarioAction = require('../actions/usuarios/getPerfilUsuario.action');
const updateUsuarioAction = require('../actions/usuarios/updateUsuario.action');
const deleteUsuarioAction = require('../actions/usuarios/deleteUsuario.action');

const registrarUsuario = async (req, res) => {
  try {
    const usuario = await createUsuarioAction(req.body);
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario });
  } catch (error) {
    console.error('Error registrando usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

const loginUsuario = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await findUsuarioByCorreoAction(correo);

    if (!usuario) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const pepper = process.env.PEPPER;
    const passwordMatch = await bcrypt.compare(contraseña + pepper, usuario.contraseña);

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

    res.status(200).json({ mensaje: 'Login exitoso', token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
};

const obtenerPerfil = async (req, res) => {
  try {
    const perfil = await getPerfilUsuarioAction(req.usuario.id);
    if (!perfil) {
      return res.status(404).json({ error: 'Usuario no encontrado o eliminado' });
    }
    res.json(perfil);
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

const actualizarUsuario = async (req, res) => {
  const usuarioAutenticado = req.usuario;
  const usuarioId = parseInt(req.params.id);

  const esMismoUsuario = usuarioAutenticado.id === usuarioId;
  const tienePermiso = usuarioAutenticado.permisos.includes('modificar_usuarios');

  if (!esMismoUsuario && !tienePermiso) {
    return res.status(403).json({ error: 'No tienes permiso para modificar este usuario' });
  }

  try {
    const usuarioActualizado = await updateUsuarioAction(usuarioId, req.body);
    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado o eliminado' });
    }
    res.json({ mensaje: 'Usuario actualizado', usuario: usuarioActualizado });
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
    const usuarioEliminado = await deleteUsuarioAction(usuarioId);
    if (!usuarioEliminado) {
      return res.status(404).json({ error: 'Usuario no encontrado o ya eliminado' });
    }
    res.json({ mensaje: 'Usuario inhabilitado (soft delete)', usuario: usuarioEliminado });
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
