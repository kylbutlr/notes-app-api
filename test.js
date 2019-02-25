const request = require('supertest');
const { Client } = require('pg');
const App = require('./app');
const DB = require('./db');
let db;
let client;

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

describe('tags', () => {
  const tag1 = {
    title: 'testTag2',
    user_id: 1,
  };
  const tag2 = {
    title: 'updatedTag',
    user_id: 1,
  };
  describe('POST to /tags', () => {
    it('should create tags', done => {
      request(app)
        .post('/tags')
        .send(tag1)
        .expect(201);
      db.insertTag(tag1, (err, res) => {
        if (err) {
          console.log(err);
          throw err;
        }
        expect(res[0].id).toBe(2);
        expect(res[0].tag).toBe(tag1);
        done();
      });
    });
    it('should fail for repeated tags', done => {
      request(app)
        .post('/tags')
        .send(tag1)
        .expect(422, done);
    });
  });
  describe('GET one from /tags', () => {
    it('should return second tag', done => {
      request(app)
        .get('/tags/2')
        .expect(200);
      db.selectOneTag(2, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(2);
        expect(res[0].tag).toBe(tag1);
        done();
      });
    });
    it('should fail when invalid tag', done => {
      request(app)
        .get('/tags/-1')
        .expect(404, done);
    });
  });
  describe('GET all from /tags', () => {
    it('should return all tags (2)', done => {
      request(app)
        .get('/tags')
        .expect(200);
      db.selectAllTags((err, res) => {
        if (err) throw err;
        expect(res).toHaveLength(2);
        done();
      });
    });
  });
  describe('PUT to /tags', () => {
    it('should update first tag', done => {
      request(app)
        .put('/tags/1')
        .send(tag2)
        .expect(204);
      db.updateTag(1, tag2, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(1);
        expect(res[0].tag).toBe(tag2);
        done();
      });
    });
    it('should fail when invalid tag', done => {
      request(app)
        .put('/tags/-1')
        .send(tag2)
        .expect(404, done);
    });
  });
  describe('DELETE one from /tags', () => {
    it('should delete second tag', done => {
      request(app)
        .delete('/tags/2')
        .expect(204);
      db.deleteOneTag(2, done);
    });
    it('should fail when invalid tag', done => {
      request(app)
        .delete('/tags/-1')
        .expect(404, done);
    });
  });
  describe('DELETE all from /tags', () => {
    it('should delete all tags', done => {
      request(app)
        .delete('/tags')
        .expect(204);
      db.deleteAllTags(done);
    });
  });
  describe('GET all from /tags', () => {
    it('should return all tags (none)', done => {
      request(app)
        .get('/tags')
        .expect(200);
      db.selectAllTags((err, res) => {
        if (err) throw err;
        expect(res).toHaveLength(0);
        done();
      });
    });
  });
});
describe('notes', () => {
  const note1 = {
    title: 'test title 2',
    text: 'test note text',
    tags: ['tag1', 'tag2'],
  };
  const note2 = {
    title: 'updated title',
    text: 'updated note text',
    tags: ['tag1', 'tag2'],
  };
  describe('POST to /notes', () => {
    it('should create notes', done => {
      request(app)
        .post('/notes')
        .send(note1)
        .expect(201);
      db.insertNote(note1.title, note1.text, note1.tags, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(2);
        expect(res[0].title).toBe(note1.title);
        expect(res[0].text).toBe(note1.text);
        done();
      });
    });
  });
  describe('GET one from /notes', () => {
    it('should return second note', done => {
      request(app)
        .get('/notes/2')
        .expect(200);
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
        .expect(404, done);
    });
  });
  describe('GET all from /notes', () => {
    it('should return all notes (2)', done => {
      request(app)
        .get('/notes')
        .expect(200);
      db.selectAllNotes((err, res) => {
        if (err) throw err;
        expect(res).toHaveLength(2);
        done();
      });
    });
  });
  describe('PUT to /notes', () => {
    it('should update first note', done => {
      request(app)
        .put('/notes/1')
        .send(note2)
        .expect(204);
      db.updateNote(1, note2.title, note2.text, note2.tags, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(1);
        expect(res[0].title).toBe(note2.title);
        expect(res[0].text).toBe(note2.text);
        done();
      });
    });
    it('should fail when invalid note', done => {
      request(app)
        .put('/notes/-1')
        .send(note2)
        .expect(404, done);
    });
  });
  describe('DELETE one from /notes', () => {
    it('should delete second note', done => {
      request(app)
        .delete('/notes/2')
        .expect(204);
      db.deleteOneNote(2, done);
    });
    it('should fail when invalid note', done => {
      request(app)
        .delete('/notes/-1')
        .expect(404, done);
    });
  });
  describe('DELETE all from /notes', () => {
    it('should delete all notes', done => {
      request(app)
        .delete('/notes')
        .expect(204);
      db.deleteAllNotes(done);
    });
  });
  describe('GET all from /notes', () => {
    it('should return all notes (none)', done => {
      request(app)
        .get('/notes')
        .expect(200);
      db.selectAllNotes((err, res) => {
        if (err) throw err;
        expect(res).toHaveLength(0);
        done();
      });
    });
  });
});
