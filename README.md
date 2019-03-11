# Notes App (API)
### Note taking application REST API
##### Features: User accounts, authorization, encryption, and tests
##### Using: PostgreSQL, Express, JWT, Bcrypt, and Jest
### [Can be used with Notes App (React)](https://github.com/kylbutlr/notes-app-react)
##### [Previous model repository with more commit history](https://github.com/kylbutlr/notes-app)

## Install

```bash
npm install
```

## Usage

```bash
npm start
```

Runs on port `3000`

## API

All* Requests require a Config Object of Headers for:
* Authorization: JSON Web Token
* User_ID: Logged in User ID
```js
headers: {
  authorization: [THE JWT],
  user_id: [THE USER ID]
}
```
*Not needed for login/register

For Users:
HTTP   | Request              | Response
--- | --- | ---
POST   | /login               | Creates a new JWT session
POST   | /register            | Registers a new user
GET    | /users/:username     | Returns one user selected by the username
PUT    | /users/:id           | Edits a user selected by the user's ID
DELETE | /users/:id           | Deletes a user selected by the user's ID

For Notes:
HTTP   | Request              | Response
--- | --- | ---
GET    | /user/:user_id/notes | Returns all notes created by user's ID
GET    | /notes/:id           | Returns one note selected by the note's ID
POST   | /notes               | Creates a new note
PUT    | /notes/:id           | Edits a note selected by the note's ID
DELETE | /notes               | Deletes all notes created by user's ID
DELETE | /notes/:id           | Deletes one note selected by the note's ID

For Tags:
HTTP   | Request              | Response
--- | --- | ---
GET    | /user/:user_id/tags | Returns all tags created by user's ID
GET    | /tags/:id            | Returns one tag selected by the tag's ID
POST   | /tags                | Creates a new tag
PUT    | /tags/:id            | Edits a tag selected by the tag's ID
DELETE | /tags                | Deletes all tags created by user's ID
DELETE | /tags/:id            | Deletes one tag selected by the tag's ID

## Contributing

[@kylbutlr](https://github.com/kylbutlr)

PRs accepted.

## License

MIT
