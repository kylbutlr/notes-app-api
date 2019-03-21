module.exports = client => ({
  // Notes
  selectAllNotes: cb =>
    client.query('SELECT * FROM notes', (err, res) => {
      if (err) return cb(err);
      cb(null, res.rows);
    }),
  selectOneNote: (id, cb) =>
    client.query('SELECT * FROM notes WHERE id = $1', [id], (err, res) => {
      if (err) return cb(err);
      cb(null, res.rows);
    }),
  selectAllNotesByUserID: (user_id, cb) =>
    client.query('SELECT * FROM notes WHERE user_id = $1', [user_id], (err, res) => {
      if (err) return cb(err);
      cb(null, res.rows);
    }),
  insertNote: (title, text, tags, user_id, cb) =>
    client.query(
      'INSERT INTO notes (title, text, tags, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, text, tags, user_id],
      (err, res) => {
        if (err) return cb(err);
        cb(null, res.rows);
      }
    ),
  updateNote: (id, title, text, tags, user_id, cb) =>
    client.query(
      'UPDATE notes SET title = $2, text = $3, tags = $4, user_id = $5 WHERE id = $1 RETURNING *',
      [id, title, text, tags, user_id],
      (err, res) => {
        if (err) return cb(err);
        cb(null, res.rows);
      }
    ),
  deleteAllNotes: (user_id, cb) =>
    client.query('DELETE FROM notes WHERE user_id = $1 RETURNING *', [user_id], (err, res) => {
      if (err) return cb(err);
      cb(null, res.rows);
    }),
  deleteOneNote: (id, cb) =>
    client.query('DELETE FROM notes WHERE id = $1 RETURNING *', [id], (err, res) => {
      if (err) return cb(err);
      cb(null, res.rows);
    }),

  // Tags
  selectAllTags: cb =>
    client.query('SELECT * FROM tags', (err, res) => {
      if (err) return cb(err);
      cb(null, res.rows);
    }),
  selectOneTag: (id, cb) =>
    client.query('SELECT * FROM tags WHERE id IN ($1)', [id], (err, res) => {
      if (err) return cb(err);
      cb(null, res.rows);
    }),
  selectAllTagsByUserID: (user_id, cb) =>
    client.query('SELECT * FROM tags WHERE user_id = $1', [user_id], (err, res) => {
      if (err) return cb(err);
      cb(null, res.rows);
    }),
  insertTag: (title, user_id, cb) =>
    client.query(
      'INSERT INTO tags (title, user_id) VALUES ($1, $2) RETURNING *',
      [title, user_id],
      (err, res) => {
        if (err) return cb(err);
        cb(null, res.rows);
      }
    ),
  updateTag: (id, title, user_id, cb) =>
    client.query(
      'UPDATE tags SET title = $2, user_id = $3 WHERE id = $1 RETURNING *',
      [id, title, user_id],
      (err, res) => {
        if (err) return cb(err);
        cb(null, res.rows);
      }
    ),
  deleteAllTags: cb =>
    client.query('DELETE FROM tags RETURNING *', (err, res) => {
      if (err) return cb(err);
      cb(null, res.rows);
    }),
  deleteOneTag: (id, cb) =>
    client.query('DELETE FROM tags WHERE id = $1 RETURNING *', [id], (err, res) => {
      if (err) return cb(err);
      cb(null, res.rows);
    }),
  loginUser: (username, cb) =>
    client.query('SELECT * FROM users WHERE username = $1', [username], (err, res) => {
      if (err) return cb(err);
      cb(null, res.rows);
    }),
  registerUser: (username, password, cb) =>
    client.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, password],
      (err, res) => {
        if (err) return cb(err);
        cb(null, res.rows);
      }
    ),
});
