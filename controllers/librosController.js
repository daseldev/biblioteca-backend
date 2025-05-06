const db = require('../config/db');

const crearLibro = async (req, res) => {
  const { titulo, autor, genero, editorial, fecha_publicacion } = req.body;
  const usuario = req.usuario;

  // Verificar permiso
  if (!usuario.permisos.includes('crear_libros')) {
    return res.status(403).json({ error: 'No tienes permiso para crear libros' });
  }

  try {
    const result = await db.query(
      `INSERT INTO libros (titulo, autor, genero, editorial, fecha_publicacion)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [titulo, autor, genero, editorial, fecha_publicacion]
    );

    res.status(201).json({
      mensaje: 'Libro creado exitosamente',
      libro: result.rows[0],
    });
  } catch (error) {
    console.error('Error creando libro:', error);
    res.status(500).json({ error: 'Error al crear el libro' });
  }
};

const obtenerLibros = async (req, res) => {
    const {
      id,
      genero,
      autor,
      editorial,
      fecha_publicacion,
      titulo,
      disponible
    } = req.query;
  
    try {
      if (id) {
        // Búsqueda por ID
        const result = await db.query(
          'SELECT * FROM libros WHERE id = $1 AND eliminado = FALSE',
          [id]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }
        return res.json(result.rows[0]);
      }
  
      // Filtros dinámicos
      const condiciones = ['eliminado = FALSE'];
      const valores = [];
  
      if (genero) {
        valores.push(genero);
        condiciones.push(`genero ILIKE $${valores.length}`);
      }
      if (autor) {
        valores.push(autor);
        condiciones.push(`autor ILIKE $${valores.length}`);
      }
      if (editorial) {
        valores.push(editorial);
        condiciones.push(`editorial ILIKE $${valores.length}`);
      }
      if (fecha_publicacion) {
        valores.push(fecha_publicacion);
        condiciones.push(`fecha_publicacion = $${valores.length}`);
      }
      if (titulo) {
        valores.push(`%${titulo}%`);
        condiciones.push(`titulo ILIKE $${valores.length}`);
      }
      if (disponible !== undefined) {
        valores.push(disponible === 'true'); // convierte a boolean
        condiciones.push(`disponible = $${valores.length}`);
      }
  
      const query = `SELECT * FROM libros WHERE ${condiciones.join(' AND ')}`;
      const result = await db.query(query, valores);
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener libros:', error);
      res.status(500).json({ error: 'Error al obtener los libros' });
    }
  };
  
  const actualizarLibro = async (req, res) => {
    const libroId = req.params.id;
    const {
      titulo,
      autor,
      genero,
      editorial,
      fecha_publicacion,
      disponible
    } = req.body;
  
    const usuario = req.usuario;
  
    // Verificación de permiso
    if (!usuario.permisos.includes('modificar_libros')) {
      return res.status(403).json({ error: 'No tienes permiso para modificar libros' });
    }
  
    try {
      const campos = [];
      const valores = [];
      let contador = 1;
  
      if (titulo) {
        campos.push(`titulo = $${contador++}`);
        valores.push(titulo);
      }
      if (autor) {
        campos.push(`autor = $${contador++}`);
        valores.push(autor);
      }
      if (genero) {
        campos.push(`genero = $${contador++}`);
        valores.push(genero);
      }
      if (editorial) {
        campos.push(`editorial = $${contador++}`);
        valores.push(editorial);
      }
      if (fecha_publicacion) {
        campos.push(`fecha_publicacion = $${contador++}`);
        valores.push(fecha_publicacion);
      }
      if (disponible !== undefined) {
        campos.push(`disponible = $${contador++}`);
        valores.push(disponible);
      }
  
      if (campos.length === 0) {
        return res.status(400).json({ error: 'No hay campos para actualizar' });
      }
  
      valores.push(libroId); // último valor para el WHERE
  
      const query = `UPDATE libros SET ${campos.join(', ')} WHERE id = $${contador} AND eliminado = FALSE RETURNING *`;
      const result = await db.query(query, valores);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Libro no encontrado o eliminado' });
      }
  
      res.json({ mensaje: 'Libro actualizado', libro: result.rows[0] });
    } catch (error) {
      console.error('Error actualizando libro:', error);
      res.status(500).json({ error: 'Error al actualizar el libro' });
    }
  };
  
  const eliminarLibro = async (req, res) => {
    const libroId = req.params.id;
    const usuario = req.usuario;
  
    if (!usuario.permisos.includes('inhabilitar_libros')) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar libros' });
    }
  
    try {
      const result = await db.query(
        `UPDATE libros SET eliminado = TRUE WHERE id = $1 AND eliminado = FALSE RETURNING *`,
        [libroId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Libro no encontrado o ya eliminado' });
      }
  
      res.json({ mensaje: 'Libro inhabilitado (soft delete)', libro: result.rows[0] });
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
  
