const request = require('supertest');
const { Client } = require('pg');
const App = require('./app');
const DB = require('./db');
const UserModel = require('./model/user');
const SessionModel = require('./model/session');
let db;
let client;
let session;

const newUser1 = {
  username: 'testUser3',
  password: 'pass',
};
const newUser2 = {
  username: 'testUser4',
  password: 'pass',
};
const tag1 = {
  title: 'testTag2',
  user_id: 1,
};
const tag2 = {
  title: 'testTag3',
  user_id: 1,
};
const tag3 = {
  title: 'updatedTag',
  user_id: 1,
};
const note1 = {
  title: 'test title 2',
  text: 'test note text',
  tags: ['tag1', 'tag2'],
  user_id: 1,
};
const note2 = {
  title: 'test title 3',
  text: 'test note text',
  tags: ['tag2'],
  user_id: 1,
};
const note3 = {
  title: 'updated title',
  text: 'updated note text',
  tags: ['tag1'],
  user_id: 1,
};

beforeAll(() => {
  client = new Client({
    user: 'postgres',
    password: 'pass',
    database: 'notes_test',
  });
  client.connect();
  db = DB(client);
  app = App(client);
  userModel = UserModel(db);
  sessionModel = SessionModel(db);
});
afterAll(() => {
  client.end();
});

describe('USERS', () => {
  describe('POST /register', () => {
    it('should post to /register', done => {
      request(app)
        .post('/register')
        .send(newUser1)
        .expect(201, done);
    });
    it('should use userModel and register', done => {
      userModel.hashPass(newUser2.password, hashedPass => {
        db.registerUser(newUser2.username, hashedPass, (err, res) => {
          if (err) throw err;
          expect(res[0].id).toBe(3);
          expect(res[0].username).toBe(newUser2.username);
          done();
        });
      });
    });
    it('should refuse registering a duplicate username', done => {
      userModel.hashPass(newUser1.password, hashedPass => {
        db.registerUser(newUser1.username, hashedPass, (err, res) => {
          expect(err.code === 23505);
          done();
        });
      });
    });
  });

  describe('POST /login', () => {
    it('should post to /login', done => {
      request(app)
        .post('/login')
        .send(newUser1)
        .expect(200, done);
    });
    it('should use userModel and login', done => {
      db.loginUser(newUser1.username, (err, res) => {
        if (err) throw err;
        expect(res);
        userModel.checkPass(newUser1.password, res[0].password, passMatch => {
          expect(passMatch).toBe(true);
          sessionModel.signSession(res[0].id, newUser1.username, newSession => {
            session = {
              jwt: newSession.jwt,
              user_id: res[0].id,
              username: newUser1.username,
            };
            done();
          });
        });
      });
    });
    it('should return unauthorized for wrong password', done => {
      db.loginUser(newUser1.username, (err, res) => {
        if (err) throw err;
        expect(res);
        userModel.checkPass('wrongPass', res[0].password, passMatch => {
          expect(passMatch).toBe(false);
          done();
        });
      });
    });
  });
});

describe('TAGS', () => {
  describe('POST to /tags', () => {
    it('should post to /tags', done => {
      request(app)
        .post('/tags')
        .set('authorization', session.jwt)
        .send(tag1)
        .expect(201, done);
    });
    it('should call db.insertTag', done => {
      db.insertTag(tag2.title, tag2.user_id, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(3);
        expect(res[0].title).toBe(tag2.title);
        expect(res[0].user_id).toBe(tag2.user_id);
        done();
      });
    });
    it('should fail for repeated tags', done => {
      request(app)
        .post('/tags')
        .set('authorization', session.jwt)
        .send(tag1)
        .expect(422, done);
    });
    it('should fail for repeated tags', done => {
      db.insertTag(tag1.title, tag1.user_id, (err, res) => {
        expect(err.code === 23505);
        done();
      });
    });
  });
  describe('GET one from /tags', () => {
    it('should return second tag', done => {
      request(app)
        .get('/tags/2')
        .set('authorization', session.jwt)
        .expect(200, done);
    });
    it('should call db.selectOneTag', done => {
      db.selectOneTag(2, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(2);
        expect(res[0].title).toBe(tag1.title);
        expect(res[0].user_id).toBe(tag1.user_id);
        done();
      });
    });
    it('should fail when invalid tag', done => {
      request(app)
        .get('/tags/-1')
        .set('authorization', session.jwt)
        .expect(404, done);
    });
  });
  describe('GET all from /tags', () => {
    it('should return all tags', done => {
      request(app)
        .get(`/tags/user/${session.user_id}`)
        .set('authorization', session.jwt)
        .expect(200, done);
    });
    it('should call db.selectAllTags', done => {
      db.selectAllTags((err, res) => {
        if (err) throw err;
        expect(res).toHaveLength(3);
        done();
      });
    });
  });
  describe('PUT to /tags', () => {
    it('should update first tag', done => {
      request(app)
        .put('/tags/1')
        .set('authorization', session.jwt)
        .send(tag3)
        .expect(204, done);
      });
    it('should call db.updateTag', done => {
      db.updateTag(1, tag3.title, tag3.user_id, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(1);
        expect(res[0].title).toBe(tag3.title);
        expect(res[0].user_id).toBe(tag3.user_id);
        done();
      });
    });
    it('should fail when invalid tag', done => {
      request(app)
        .put('/tags/-1')
        .set('authorization', session.jwt)
        .send(tag2)
        .expect(404, done);
    });
  });
  describe('DELETE one from /tags', () => {
    it('should delete second tag', done => {
      request(app)
        .delete('/tags/2')
        .set('authorization', session.jwt)
        .expect(204, done);
    });
    it('should call db.deleteOneTag', done => {
      db.deleteOneTag(2, done);
    });
    it('should fail when invalid tag', done => {
      request(app)
        .delete('/tags/-1')
        .set('authorization', session.jwt)
        .expect(404, done);
    });
  });
  describe('DELETE all from /tags', () => {
    it('should delete all tags', done => {
      request(app)
        .delete(`/tags/user/${session.user_id}`)
        .set('authorization', session.jwt)
        .expect(204, done);
    });
    it('should call db.deleteAllTags', done => {
      db.deleteAllTags(tag1.user_id, done);
    });
  });
  describe('GET all from /tags', () => {
    it('should return all tags', done => {
      request(app)
        .get(`/tags/user/${session.user_id}`)
        .set('authorization', session.jwt)
        .expect(200, done);
    });
    it('should call db.selectAllTags', done => {
      db.selectAllTags((err, res) => {
        if (err) throw err;
        expect(res).toHaveLength(0);
        done();
      });
    });
  });
});

describe('NOTES', () => {
  describe('POST to /notes', () => {
    it('should create notes', done => {
      request(app)
        .post('/notes')
        .set('authorization', session.jwt)
        .send(note1)
        .expect(201, done);
    });
    it('should call db.insertNote', done => {
      const { title, text, tags, user_id } = note2;
      db.insertNote(title, text, tags, user_id, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(3);
        expect(res[0].title).toBe(note2.title);
        expect(res[0].text).toBe(note2.text);
        done();
      });
    });
  });
  describe('GET one from /notes', () => {
    it('should return second note', done => {
      request(app)
        .get('/notes/2')
        .set('authorization', session.jwt)
        .expect(200, done);
    });
    it('should call db.selectOneNote', done => {
      db.selectOneNote(2, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(2);
        expect(res[0].title).toBe(note1.title);
        expect(res[0].text).toBe(note1.text);
        done();
      });
    });
    it('should fail when invalid note', done => {
      request(app)
        .get('/notes/-1')
        .set('authorization', session.jwt)
        .expect(404, done);
    });
  });
  describe('GET all from /notes', () => {
    it('should return all notes', done => {
      request(app)
        .get(`/notes/user/${session.user_id}`)
        .set('authorization', session.jwt)
        .expect(200, done);
    });
    it('should call db.selectAllNotes', done => {
      db.selectAllNotes((err, res) => {
        if (err) throw err;
        expect(res).toHaveLength(3);
        done();
      });
    });
  });
  describe('PUT to /notes', () => {
    it('should update first note', done => {
      request(app)
        .put('/notes/1')
        .set('authorization', session.jwt)
        .send(note2)
        .expect(204, done);
    });
    it('should call db.updateNote', done => {
      const { title, text, tags, user_id } = note2;
      db.updateNote(1, title, text, tags, user_id, (err, res) => {
          if (err) throw err;
          expect(res[0].id).toBe(1);
          expect(res[0].title).toBe(note2.title);
          expect(res[0].text).toBe(note2.text);
          done();
        }
      );
    });
    it('should fail when invalid note', done => {
      request(app)
        .put('/notes/-1')
        .set('authorization', session.jwt)
        .send(note2)
        .expect(404, done);
    });
  });
  describe('DELETE one from /notes', () => {
    it('should delete second note', done => {
      request(app)
        .delete('/notes/2')
        .set('authorization', session.jwt)
        .expect(204, done);
    });
    it('should call db.deleteOneNote', done => {
      db.deleteOneNote(2, done);
    });
    it('should fail when invalid note', done => {
      request(app)
        .delete('/notes/-1')
        .set('authorization', session.jwt)
        .expect(404, done);
    });
  });
  describe('DELETE all from /notes', () => {
    it('should delete all notes', done => {
      request(app)
        .delete(`/notes/user/${session.user_id}`)
        .set('authorization', session.jwt)
        .expect(204, done);
    });
    it('should call db.deleteAllNotes', done => {
      db.deleteAllNotes(note1.user_id, done);
    });
  });
  describe('GET all from /notes', () => {
    it('should return all notes', done => {
      request(app)
        .get(`/notes/user/${session.user_id}`)
        .set('authorization', session.jwt)
        .expect(200, done);
    });
    it('should call db.selectAllNotes', done => {
      db.selectAllNotes((err, res) => {
        if (err) throw err;
        expect(res).toHaveLength(0);
        done();
      });
    });
  });
});
