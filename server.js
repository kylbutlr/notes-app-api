const { Client } = require('pg');
const App = require('./app');
const client = new Client({
  user: 'pwwgewtltiqrqd',
  password: '163bdb4226d9ff7e7cca08daa41acda7bb7d6ef466d33f9b5e9f79712eac938b',
  database: 'd956o2pa34bjdi',
  port: 5432,
  host: 'ec2-75-101-131-79.compute-1.amazonaws.com',
  ssl: true
});
client.connect();
const app = App(client);
app.listen(process.env.PORT || 3000);
