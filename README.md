# Notepad App API

#### RESTful API for a basic note-taking application

Created to be used with [Notepad App (React)](https://github.com/kylbutlr/notes-app-react)

Uses: PostgreSQL, Express, Jest, JWT, and Bcrypt

## How to Use:

API Endpoint: ```https://kylbutlr-notes-api.herokuapp.com```

Alternatively, download this repository and run the server locally:

1. Install the dependencies: ```npm install```
2. Run unit and integration tests: ```npm test```
3. Start the server: ```npm start``` 
4. API can be found at: ```localhost:3000```

### Requests:

Create, update, and delete post requests require a Config Object of Headers for Authorization containing the JSON Web Token for the current session (tied to the logged in user):

```js
headers: {
  authorization: JWT
}
```

#### Users:

| HTTP | Request   | Response                                                    |
| ---- | --------- | ----------------------------------------------------------- |
| POST | /login    | Checks returned hashed password and creates new JWT session |
| POST | /register | Registers a new user after hashing the password             |

#### Notes:

| HTTP   | Request              | Response                                   |
| ------ | -------------------- | ------------------------------------------ |
| GET    | /notes/user/:user_id | Returns all notes created by user's ID     |
| GET    | /notes/:id           | Returns one note selected by the note's ID |
| POST   | /notes               | Creates a new note                         |
| PUT    | /notes/:id           | Edits a note selected by the note's ID     |
| DELETE | /notes/user/:user_id | Deletes all notes created by user's ID     |
| DELETE | /notes/:id           | Deletes one note selected by the note's ID |

#### Tags:

| HTTP   | Request             | Response                                 |
| ------ | ------------------- | ---------------------------------------- |
| GET    | /tags/user/:user_id | Returns all tags created by user's ID    |
| GET    | /tags/:id           | Returns one tag selected by the tag's ID |
| POST   | /tags               | Creates a new tag                        |
| PUT    | /tags/:id           | Edits a tag selected by the tag's ID     |
| DELETE | /tags/user/user:id  | Deletes all tags created by user's ID    |
| DELETE | /tags/:id           | Deletes one tag selected by the tag's ID |

***

## Contributing:

[@kylbutlr](https://github.com/kylbutlr)

## License:

MIT
