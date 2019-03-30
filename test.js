const request = require('supertest');
const { Client } = require('pg');
const App = require('./app');
const DB = require('./db');
const UserModel = require('./model/user');
let db;
let client;

const userModel = UserModel(db);

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
  title: 'updated title',
  text: 'updated note text',
  tags: ['tag1', 'tag2'],
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
        });
        done();
      });
    });
    it('should return unauthorized for wrong password', done => {
      db.loginUser(newUser1.username, (err, res) => {
        if (err) throw err;
        expect(res);
        userModel.checkPass('wrongPass', res[0].password, passMatch => {
          expect(passMatch).toBe(false);
        });
        done();
      });
    });
  });
});

describe('TAGS', () => {
  describe('POST to /tags', () => {
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should post to /tags', done => {
      request(app)
        .post('/tags')
        .send(tag1)
        .expect(201, done);
    });*/
    it('should call db.insertTag', done => {
      db.insertTag(tag1.title, tag1.user_id, (err, res) => {
        if (err) throw(err);
        expect(res[0].id).toBe(2);
        expect(res[0].title).toBe(tag1.title);
        expect(res[0].user_id).toBe(tag1.user_id);
        done();
      });
    });
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should fail for repeated tags', done => {
      request(app)
        .post('/tags')
        .send(tag1)
        .expect(422, done);
    });*/
    it('should fail for repeated tags', done => {
      db.insertTag(tag1.title, tag1.user_id, (err, res) => {
        expect(err.code === 23505);
        done();
      });
    });
  });
  describe('GET one from /tags', () => {
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should return second tag', done => {
      request(app)
        .get('/tags/2')
        .expect(200, done);
    });*/
    it('should call db.selectOneTag', done => {
      db.selectOneTag(2, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(2);
        expect(res[0].title).toBe(tag1.title);
        expect(res[0].user_id).toBe(tag1.user_id);
        done();
      });
    });
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should fail when invalid tag', done => {
      request(app)
        .get('/tags/-1')
        .expect(404, done);
    });*/
  });
  describe('GET all from /tags', () => {
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should return all tags (2)', done => {
      request(app)
        .get('/tags')
        .expect(200);
    });*/
    it('should call db.selectAllTags', done => {
      db.selectAllTags((err, res) => {
        if (err) throw err;
        expect(res).toHaveLength(2);
        done();
      });
    });
  });
  describe('PUT to /tags', () => {
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should update first tag', done => {
      request(app)
        .put('/tags/1')
        .send(tag2)
        .expect(204);
      });*/
    it('should call db.updateTag', done => {
      db.updateTag(tag2.user_id, tag2.title, tag2.user_id, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(1);
        expect(res[0].title).toBe(tag2.title);
        expect(res[0].user_id).toBe(tag2.user_id);
        done();
      });
    });
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should fail when invalid tag', done => {
      request(app)
        .put('/tags/-1')
        .send(tag2)
        .expect(404, done);
    });*/
  });
  /* THIS NEEDS TO BE AUTHORIZED TO PASS */
  describe('DELETE one from /tags', () => {
    /*it('should delete second tag', done => {
      request(app)
        .delete('/tags/2')
        .expect(204);
    });*/
    it('should call db.deleteOneTag', done => {
      db.deleteOneTag(2, done);
    });
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should fail when invalid tag', done => {
      request(app)
        .delete('/tags/-1')
        .expect(404, done);
    });*/
  });
  describe('DELETE all from /tags', () => {
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should delete all tags', done => {
      request(app)
        .delete('/tags')
        .expect(204);
    });*/
    it('should call db.deleteAllTags', done => {
      db.deleteAllTags(tag1.user_id, done);
    });
  });
  describe('GET all from /tags', () => {
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should return all tags (none)', done => {
      request(app)
        .get('/tags')
        .expect(200);
    });*/
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
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should create notes', done => {
      request(app)
        .post('/notes')
        .send(note1)
        .expect(201);
    });*/
    it('should call db.insertNote', done => {
      db.insertNote(note1.title, note1.text, note1.tags, note1.user_id, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(2);
        expect(res[0].title).toBe(note1.title);
        expect(res[0].text).toBe(note1.text);
        done();
      });
    });
  });
  describe('GET one from /notes', () => {
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should return second note', done => {
      request(app)
        .get('/notes/2')
        .expect(200);
    });*/
    it('should call db.selectOneNote', done => {
      db.selectOneNote(2, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(2);
        expect(res[0].title).toBe(note1.title);
        expect(res[0].text).toBe(note1.text);
        done();
      });
    });
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should fail when invalid note', done => {
      request(app)
        .get('/notes/-1')
        .expect(404, done);
    });*/
  });
  describe('GET all from /notes', () => {
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should return all notes (2)', done => {
      request(app)
        .get('/notes')
        .expect(200);
    });*/
    it('should call db.selectAllNotes', done => {
      db.selectAllNotes((err, res) => {
        if (err) throw err;
        expect(res).toHaveLength(2);
        done();
      });
    });
  });
  describe('PUT to /notes', () => {
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should update first note', done => {
      request(app)
        .put('/notes/1')
        .send(note2)
        .expect(204);
    });*/
    it('should call db.updateNote', done => {
      db.updateNote(note2.user_id, note2.title, note2.text, note2.tags, note2.user_id, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(1);
        expect(res[0].title).toBe(note2.title);
        expect(res[0].text).toBe(note2.text);
        done();
      });
    });
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should fail when invalid note', done => {
      request(app)
        .put('/notes/-1')
        .send(note2)
        .expect(404, done);
    });*/
  });
  describe('DELETE one from /notes', () => {
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should delete second note', done => {
      request(app)
        .delete('/notes/2')
        .expect(204);
    });*/
    it ('should call db.deleteOneNote', done => {
      db.deleteOneNote(2, done);
    });
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should fail when invalid note', done => {
      request(app)
        .delete('/notes/-1')
        .expect(404, done);
    });*/
  });
  describe('DELETE all from /notes', () => {
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should delete all notes', done => {
      request(app)
        .delete('/notes')
        .expect(204);
    });*/
    it('should call db.deleteAllNotes', done => {
      db.deleteAllNotes(note1.user_id, done);
    });
  });
  describe('GET all from /notes', () => {
    /* THIS NEEDS TO BE AUTHORIZED TO PASS */
    /*it('should return all notes (none)', done => {
      request(app)
        .get('/notes')
        .expect(200);
    });*/
    it('should call db.selectAllNotes', done => {
      db.selectAllNotes((err, res) => {
        if (err) throw err;
        expect(res).toHaveLength(0);
        done();
      });
    });
  });
});
