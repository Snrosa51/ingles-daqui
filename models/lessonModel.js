const db = require('../db/connection');

exports.getAll = async () => {
  const [rows] = await db.query("SELECT * FROM lessons ORDER BY id DESC");
  return rows;
};

exports.create = async (data) => {
  const [result] = await db.query(
    "INSERT INTO lessons (title, level, description) VALUES (?, ?, ?)",
    [data.title, data.level, data.description]
  );
  return result.insertId;
};
