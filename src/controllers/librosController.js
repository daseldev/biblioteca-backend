const createLibroAction = require('../actions/libros/createLibro.action');
const findLibrosAction = require('../actions/libros/findLibros.action');
const updateLibroAction = require('../actions/libros/updateLibro.action');
const deleteLibroAction = require('../actions/libros/deleteLibro.action');

const crearLibro = async (req, res) => {
  const usuario = req.usuario;
  if (!usuario.permisos.includes('crear_libros')) {
    return res.status(403).json({ error: 'No tienes permiso para crear libros' });
  }

  try {
    const libro = await createLibroAction(req.body);
    res.status(201).json({ mensaje: 'Libro creado exitosamente', libro });
  } catch (error) {
    console.error('Error creando libro:', error);
    res.status(500).json({ error: 'Error al crear el libro' });
  }
};

const obtenerLibros = async (req, res) => {
  try {
    const libros = await findLibrosAction(req.query);
    if (req.query.id && libros.length === 0) {
      return res.status(404).json({ mensaje: 'Libro no encontrado' });
    }
    res.json(req.query.id ? libros[0] : libros);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ error: 'Error al obtener los libros' });
  }
};

const actualizarLibro = async (req, res) => {
  const usuario = req.usuario;
  if (!usuario.permisos.includes('modificar_libros')) {
    return res.status(403).json({ error: 'No tienes permiso para modificar libros' });
  }

  try {
    const libro = await updateLibroAction(req.params.id, req.body);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado o eliminado' });
    }
    res.json({ mensaje: 'Libro actualizado', libro });
  } catch (error) {
    console.error('Error actualizando libro:', error);
    res.status(500).json({ error: 'Error al actualizar el libro' });
  }
};

const eliminarLibro = async (req, res) => {
  const usuario = req.usuario;
  if (!usuario.permisos.includes('inhabilitar_libros')) {
    return res.status(403).json({ error: 'No tienes permiso para eliminar libros' });
  }

  try {
    const libro = await deleteLibroAction(req.params.id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado o ya eliminado' });
    }
    res.json({ mensaje: 'Libro inhabilitado (soft delete)', libro });
  } catch (error) {
    console.error('Error al eliminar libro:', error);
    res.status(500).json({ error: 'Error al eliminar el libro' });
  }
};

module.exports = {
  crearLibro,
  obtenerLibros,
  actualizarLibro,
  eliminarLibro
};
