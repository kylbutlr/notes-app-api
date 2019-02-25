TRUNCATE tags RESTART IDENTITY;
TRUNCATE notes RESTART IDENTITY;
TRUNCATE users RESTART IDENTITY;

ALTER SEQUENCE notes_id_seq RESTART 1;
ALTER SEQUENCE tags_id_seq RESTART 1;
ALTER SEQUENCE users_id_seq RESTART 1;

INSERT INTO tags (tag) VALUES ('testTag1');
INSERT INTO notes (title, text) VALUES ('test title 1', 'test note text');
INSERT INTO users (username, password) VALUES ('testUser1', 'testPass');