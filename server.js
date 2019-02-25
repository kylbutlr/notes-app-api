const { Client } = require('pg');
const App = require('./app');
const client = new Client({
  user: 'postgres',
  password: 'pass',
  database: 'notes',
});
client.connect();
const app = App(client);
app.listen(3000);
