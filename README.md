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

All Requests Require a Config Object of Headers for:
* Authorization: JWT
* User_ID: Logged in User

Request        | Response Description
--- | ---
GET /notes     | Returns all notes created by User_ID
GET /notes/:id | Returns one note found by note's ID

## Contributing

[@kylbutlr](https://github.com/kylbutlr)

PRs accepted.

## License

MIT
