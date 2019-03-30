TRUNCATE users RESTART IDENTITY;
TRUNCATE tags RESTART IDENTITY;
TRUNCATE notes RESTART IDENTITY;

ALTER SEQUENCE users_id_seq RESTART 1;
ALTER SEQUENCE notes_id_seq RESTART 1;
ALTER SEQUENCE tags_id_seq RESTART 1;

INSERT INTO users (username, password) VALUES ('testUser1', 'testPass');
INSERT INTO tags (title, user_id) VALUES ('testTag1', 1);
INSERT INTO notes (title, text, user_id) VALUES ('test title 1', 'test note text', 1);