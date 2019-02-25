const express = require('express');
const cors = require('cors');
const DB = require('./db');
const UserModel = require('./model/user');
const SessionModel = require('./model/session');
const authMiddleware = require('./middleware/auth');

module.exports = client => {
  const app = express();
  const db = DB(client);
  const userModel = UserModel(db);
  const sessionModel = SessionModel(db);

  // Notes
  const getAllNotes = (req, res, next) => {
    db.selectAllNotes((err, data) => {
      if (err) return next(err);
      res.status(200).send(data);
    });
  };
  const getOneNote = (req, res, next) => {
    const id = Number(req.params.id);
    db.selectOneNote(id, (err, data) => {
      if (err) return next(err);
      if (!data[0]) return next();
      res.status(200).send(data[0]);
    });
  };
  const getAllNotesByUserID = (req, res, next) => {
    const user_id = req.params.user_id;
    db.selectAllNotesByUserID(user_id, (err, data) => {
      if (err) return next(err);
      if (!data) return next();
      res.status(200).send(data);
    });
  };
  const postNote = (req, res, next) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { title, text, tags, user_id } = JSON.parse(body);
      db.insertNote(title, text, tags, user_id, (err, data) => {
        if (err) return next(err);
        res.status(201).send(data[0]);
      });
    });
  };
  const putNote = (req, res, next) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const id = Number(req.params.id);
      const { title, text, tags, user_id } = JSON.parse(body);
      db.updateNote(id, title, text, tags, user_id, (err, data) => {
        if (err) return next(err);
        if (!data[0]) return next();
        res.status(204).send(data[0]);
      });
    });
  };
  const deleteAllNotes = (req, res, next) => {
    db.deleteAllNotes((err, data) => {
      if (err) return next(err);
      res.status(204).send(data);
    });
  };
  const deleteOneNote = (req, res, next) => {
    const id = Number(req.params.id);
    db.deleteOneNote(id, (err, data) => {
      if (err) return next(err);
      if (!data[0]) return next();
      res.status(204).send(data[0]);
    });
  };

  // Tags
  const getAllTags = (req, res, next) => {
    db.selectAllTags((err, data) => {
      if (err) return next(err);
      res.status(200).send(data);
    });
  };
  const getOneTag = (req, res, next) => {
    let id = req.params.id;
    if (id.indexOf(',') >= 0) {
      id = id.split(',');
    }
    db.selectOneTag(id, (err, data) => {
      if (err) return next(err);
      if (!data[0]) return next();
      res.status(200).send(data[0]);
    });
  };
  const getAllTagsByUserID = (req, res, next) => {
    const user_id = req.user.user_id;
    db.selectAllTagsByUserID(user_id, (err, data) => {
      if (err) return next(err);
      if (!data) return next();
      res.status(200).send(data);
    });
  };
  const postTag = (req, res, next) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { title, user_id } = JSON.parse(body);
      db.insertTag(title, user_id, (err, data) => {
        if (err) {
          if (err.code === '23505') {
            res.status(422);
          }
          return next(err);
        }
        res.status(201).send(data[0]);
      });
    });
  };
  const putTag = (req, res, next) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const id = Number(req.params.id);
      const { title, user_id } = JSON.parse(body);
      db.updateTag(id, title, user_id, (err, data) => {
        if (err) {
          if (err.code === '23505') {
            res.status(422);
          }
          return next(err);
        }
        if (!data[0]) return next();
        res.status(204).send(data[0]);
      });
    });
  };
  const deleteAllTags = (req, res, next) => {
    db.deleteAllTags((err, data) => {
      if (err) return next(err);
      res.status(204).send(data);
    });
  };
  const deleteOneTag = (req, res, next) => {
    const id = Number(req.params.id);
    db.deleteOneTag(id, (err, data) => {
      if (err) return next(err);
      if (!data[0]) return next();
      res.status(204).send(data[0]);
    });
  };

  // Users
  const getAllUsers = (req, res, next) => {
    db.selectAllUsers((err, data) => {
      if (err) return next(err);
      res.status(200).send(data);
    });
  };
  const getOneUserByID = (req, res, next) => {
    const id = Number(req.params.id);
    db.selectOneUserByID(id, (err, data) => {
      if (err) return next(err);
      if (!data[0]) return next();
      res.status(200).send(data[0]);
    });
  };
  const getOneUserByUsername = (req, res, next) => {
    const username = req.params.username;
    db.selectOneUserByUsername(username, (err, data) => {
      if (err) return next(err);
      if (!data[0]) return next();
      res.status(200).send(data[0]);
    });
  };
  const putOneUser = (req, res, next) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const id = Number(req.params.id);
      const { username, password } = JSON.parse(body);
      db.updateUser(id, username, password, (err, data) => {
        if (err) {
          if (err.code === '23505') {
            res.status(422);
          }
          return next(err);
        }
        if (!data[0]) return next();
        res.status(204).send(data[0]);
      });
    });
  };
  const deleteAllUsers = (req, res, next) => {
    db.deleteAllUsers((err, data) => {
      if (err) return next(err);
      res.status(204).send(data);
    });
  };
  const deleteOneUser = (req, res, next) => {
    const id = Number(req.params.id);
    db.deleteOneUser(id, (err, data) => {
      if (err) return next(err);
      if (!data[0]) return next();
      res.status(204).send(data[0]);
    });
  };

  const registerUser = (req, res, next) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
      userModel.hashPass(password, hashedPass => {
        db.registerUser(username, hashedPass, (err, data) => {
          if (err) {
            if (err.code === '23505') {
              res.status(422);
            }
            return next(err);
          }
          res.status(201).send(data[0]);
        });
      });
    });
  };
  const loginUser = (req, res, next) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
      db.selectOneUserByUsername(username, (err, data) => {
        if (err) return next(err);
        if (!data[0]) return next();
        const user_id = data[0].id;
        const hashedPass = data[0].password;
        userModel.checkPass(password, hashedPass, passMatch => {
          if (passMatch === true) {
            sessionModel.signSession(user_id, username, newData => {
              res.status(200).send(newData);
            });
          } else {
            return next();
          }
        });
      });
    });
  };

  app.use(cors());
  app.get('/notes', [authMiddleware(db), getAllNotes]);
  app.get('/notes/:id', [authMiddleware(db), getOneNote]);
  app.get('/user/:user_id/notes', [getAllNotesByUserID]);
  app.post('/notes', [authMiddleware(db), postNote]);
  app.put('/notes/:id', [authMiddleware(db), putNote]);
  app.delete('/notes/:id', [authMiddleware(db), deleteOneNote]);
  app.delete('/notes', [authMiddleware(db), deleteAllNotes]);
  app.get('/tags', [authMiddleware(db), getAllTags]);
  app.get('/tags/:id', [authMiddleware(db), getOneTag]);
  app.get('/user/:user_id/tags', [authMiddleware(db), getAllTagsByUserID]);
  app.post('/tags', [authMiddleware(db), postTag]);
  app.put('/tags/:id', [authMiddleware(db), putTag]);
  app.delete('/tags/:id', [authMiddleware(db), deleteOneTag]);
  app.delete('/tags', [authMiddleware(db), deleteAllTags]);
  app.get('/users', [authMiddleware(db), getAllUsers]);
  app.get('/users/:id', [authMiddleware(db), getOneUserByID]);
  app.get('/users/user/:username', [authMiddleware(db), getOneUserByUsername]);
  app.put('/users/:id', [authMiddleware(db), putOneUser]);
  app.delete('/users/:id', [authMiddleware(db), deleteOneUser]);
  app.delete('/users', [authMiddleware(db), deleteAllUsers]);
  app.post('/register', registerUser);
  app.post('/login', loginUser);
  app.use((req, res) => res.status(404).send('404: Not Found'));
  return app;
};
