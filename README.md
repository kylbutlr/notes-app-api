# Notes App (API)

#### Note taking app public RESTful API, [can be used with Notes App (React)](https://github.com/kylbutlr/notes-app-react)

Using: PostgreSQL, Express, Jest, JWT, and Bcrypt

Featuring: REST CRUD, routing, tests, user accounts, authorization, and encryption

All entries and modifications will be saved and only displayed for the corresponding logged in user.

[Previous depreciated model repository](https://github.com/kylbutlr/notes-app)

## Install

```shell
npm install
```

## Usage

Server runs on port `3000`

```shell
npm start
```

All* Requests require a Config Object of Headers for:
* Authorization: JSON Web Token
* User_ID: Logged in User ID
```js
headers: {
  authorization: [THE JWT],
  user_id: [THE USER ID]
}
```
(*Not needed for login/register)

#### Users:

HTTP   | Request              | Response
--- | --- | ---
GET    | /users/:username     | Returns one user selected by the username
POST   | /login               | Creates a new JWT session
POST   | /register            | Registers a new user
PUT    | /users/:id           | Edits a user selected by the user's ID
DELETE | /users/:id           | Deletes a user selected by the user's ID

#### Notes:

HTTP   | Request              | Response
--- | --- | ---
GET    | /user/:user_id/notes | Returns all notes created by user's ID
GET    | /notes/:id           | Returns one note selected by the note's ID
POST   | /notes               | Creates a new note
PUT    | /notes/:id           | Edits a note selected by the note's ID
DELETE | /notes               | Deletes all notes created by user's ID
DELETE | /notes/:id           | Deletes one note selected by the note's ID

#### Tags:

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
