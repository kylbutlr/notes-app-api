# Notes App (API)

Note-taking application RESTful API

Created to be used with my [Notes App (React)](https://github.com/kylbutlr/notes-app-react) app

Features: REST CRUD, routing, tests, user accounts, authorization, and encryption

Uses: PostgreSQL, Express, Jest, JWT, and Bcrypt

### [Click here for a live preview](https://kylbutlr-notes-react.herokuapp.com/) of my React app that uses this API. 

Or [go to the API directly](https://kylbutlr-notes-api.herokuapp.com) in your browser. (Requests require JWT authentication created by login; See the Usage section below for more details)

No e-mail required to register a new user account. Feel free to "sign up" and test things out!

## Install

```shell
npm install
```

## Usage

Server runs on port `3000`

```shell
npm start
```

All requests (besides login/register) require a Config Object of Headers for Authorization containing the JSON Web Token:

```js
headers: {
  authorization: JWT
}
```

#### Users:

| HTTP   | Request          | Response                                  |
| ------ | ---------------- | ----------------------------------------- |
| GET    | /users/:username | Returns one user selected by the username |
| POST   | /login           | Creates a new JWT session                 |
| POST   | /register        | Registers a new user                      |
| PUT    | /users/:id       | Edits a user selected by the user's ID    |
| DELETE | /users/:id       | Deletes a user selected by the user's ID  |

#### Notes:

| HTTP   | Request              | Response                                   |
| ------ | -------------------- | ------------------------------------------ |
| GET    | /user/:user_id/notes | Returns all notes created by user's ID     |
| GET    | /notes/:id           | Returns one note selected by the note's ID |
| POST   | /notes               | Creates a new note                         |
| PUT    | /notes/:id           | Edits a note selected by the note's ID     |
| DELETE | /notes               | Deletes all notes created by user's ID     |
| DELETE | /notes/:id           | Deletes one note selected by the note's ID |

#### Tags:

| HTTP   | Request             | Response                                 |
| ------ | ------------------- | ---------------------------------------- |
| GET    | /user/:user_id/tags | Returns all tags created by user's ID    |
| GET    | /tags/:id           | Returns one tag selected by the tag's ID |
| POST   | /tags               | Creates a new tag                        |
| PUT    | /tags/:id           | Edits a tag selected by the tag's ID     |
| DELETE | /tags               | Deletes all tags created by user's ID    |
| DELETE | /tags/:id           | Deletes one tag selected by the tag's ID |

## Contributing

[@kylbutlr](https://github.com/kylbutlr)

#### Special Thanks: 

[@NoumanSaleem](https://github.com/NoumanSaleem)

## License

MIT
