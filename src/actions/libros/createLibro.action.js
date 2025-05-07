const db = require('../../config/db');

const createLibroAction = async ({ titulo, autor, genero, editorial, fecha_publicacion }) => {
  const result = await db.query(
    `INSERT INTO libros (titulo, autor, genero, editorial, fecha_publicacion)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [titulo, autor, genero, editorial, fecha_publicacion]
  );

  return result.rows[0];
};

module.exports = createLibroAction;
