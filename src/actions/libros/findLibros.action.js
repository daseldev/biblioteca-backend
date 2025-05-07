const db = require('../../config/db');

const findLibrosAction = async (filtros) => {
  const {
    id,
    genero,
    autor,
    editorial,
    fecha_publicacion,
    titulo,
    disponible
  } = filtros;

  if (id) {
    const result = await db.query(
      'SELECT * FROM libros WHERE id = $1 AND eliminado = FALSE',
      [id]
    );
    return result.rows;
  }

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
    valores.push(disponible === 'true');
    condiciones.push(`disponible = $${valores.length}`);
  }

  const query = `SELECT * FROM libros WHERE ${condiciones.join(' AND ')}`;
  const result = await db.query(query, valores);

  return result.rows;
};

module.exports = findLibrosAction;
