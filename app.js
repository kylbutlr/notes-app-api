const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const DB = require('./db');
const UserModel = require('./model/user');
const SessionModel = require('./model/session');
const authMiddleware = require('./middleware/auth');

module.exports = client => {
  const app = express();
  const db = DB(client);
  const userModel = UserModel(db);
  const sessionModel = SessionModel(db);

  const getAllNotesByUserID = (req, res, next) => {
    const user_id = req.params.user_id;
    db.selectAllNotesByUserID(user_id, (err, data) => {
      if (err) return next(err);
      if (!data) return next();
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
  const postNote = (req, res, next) => {
      const { title, text, tags, user_id } = req.body;
      db.insertNote(title, text, tags, user_id, (err, data) => {
        if (err) return next(err);
        res.status(201).send(data[0]);
      });
  };
  const putNote = (req, res, next) => {
      const id = Number(req.params.id);
      const { title, text, tags, user_id } = req.body;
      db.updateNote(id, title, text, tags, user_id, (err, data) => {
        if (err) return next(err);
        if (!data[0]) return next();
        res.status(204).send(data[0]);
      });
  };
  const deleteAllNotes = (req, res, next) => {
    const user_id = Number(req.params.user_id);
    db.deleteAllNotes(user_id, (err, data) => {
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
  const getAllTagsByUserID = (req, res, next) => {
    const user_id = req.user.user_id;
    db.selectAllTagsByUserID(user_id, (err, data) => {
      if (err) return next(err);
      if (!data) return next();
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
  const postTag = (req, res, next) => {
      const { title, user_id } = req.body;
      db.insertTag(title, user_id, (err, data) => {
        if (err) {
          if (err.code === '23505') {
            res.status(422);
          }
          return next(err);
        }
        res.status(201).send(data[0]);
      });
  };
  const putTag = (req, res, next) => {
      const id = Number(req.params.id);
      const { title, user_id } = req.body;
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
  };
  const deleteAllTags = (req, res, next) => {
    const user_id = Number(req.params.user_id);
    db.deleteAllTags(user_id, (err, data) => {
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
  const registerUser = (req, res, next) => {
      const { username, password } = req.body;
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
  };
  const loginUser = (req, res, next) => {
      const { username, password } = req.body;
      db.loginUser(username, (err, data) => {
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
  };

  app.use(cors());
  app.use(bodyParser.json());
  app.get('/notes/:id', [authMiddleware(db), getOneNote]);
  app.post('/notes', [authMiddleware(db), postNote]);
  app.put('/notes/:id', [authMiddleware(db), putNote]);
  app.delete('/notes/:id', [authMiddleware(db), deleteOneNote]);
  app.delete('/notes/user/:user_id', [authMiddleware(db), deleteAllNotes]);
  app.get('/tags/:id', [authMiddleware(db), getOneTag]);
  app.post('/tags', [authMiddleware(db), postTag]);
  app.put('/tags/:id', [authMiddleware(db), putTag]);
  app.delete('/tags/:id', [authMiddleware(db), deleteOneTag]);
  app.delete('/tags/user/:user_id', [authMiddleware(db), deleteAllTags]);
  app.get('/notes/user/:user_id', [authMiddleware(db), getAllNotesByUserID]);
  app.get('/tags/user/:user_id', [authMiddleware(db), getAllTagsByUserID]);
  app.post('/register', registerUser);
  app.post('/login', loginUser);
  app.use((req, res) => res.status(404).send('404: Not Found'));
  return app;
};
