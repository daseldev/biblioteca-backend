const db = require('../../config/db');

const updateLibroAction = async (id, data) => {
  const campos = [];
  const valores = [];
  let contador = 1;

  for (const [key, value] of Object.entries(data)) {
    campos.push(`${key} = $${contador++}`);
    valores.push(value);
  }

  if (campos.length === 0) return null;

  valores.push(id);
  const query = `UPDATE libros SET ${campos.join(', ')} WHERE id = $${contador} AND eliminado = FALSE RETURNING *`;
  const result = await db.query(query, valores);

  return result.rows[0] || null;
};

module.exports = updateLibroAction;
