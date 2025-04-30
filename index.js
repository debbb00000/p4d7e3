const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const schedule = require('node-schedule');

const app = express();
app.use(express.static('.'));
app.use(bodyParser.json());

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL user
  password: '', // replace with your MySQL password
  database: 'sensor_data' // name of the database
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL');
});

// Create table if it doesn't exist
connection.query(
  `CREATE TABLE IF NOT EXISTS sensor_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    temperature FLOAT,
    pH FLOAT,
    dissolvedOxygen FLOAT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  (err, results) => {
    if (err) throw err;
    console.log('Table created or already exists');
  }
);

// Endpoint to receive sensor data
app.post('/api/sensor_data', (req, res) => {
  const { temperature, pH, dissolvedOxygen } = req.body;
  const query = 'INSERT INTO sensor_data (temperature, pH, dissolvedOxygen) VALUES (?, ?, ?)';
  connection.query(query, [temperature, pH, dissolvedOxygen], (err, results) => {
    if (err) {
      res.status(500).send('Error saving data');
      return;
    }
    res.status(201).send({ temperature, pH, dissolvedOxygen });
  });
});

// Endpoint to get the latest sensor data
app.get('/api/sensor_data', (req, res) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const query = 'SELECT * FROM sensor_data WHERE timestamp >= ? ORDER BY timestamp ASC';
  connection.query(query, [oneWeekAgo], (err, results) => {
    if (err) {
      res.status(500).send('Error fetching data');
      return;
    }
    res.send(results);
  });
});

// Schedule a job to delete data older than one week
schedule.scheduleJob('0 0 * * *', () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const query = 'DELETE FROM sensor_data WHERE timestamp < ?';
  connection.query(query, [oneWeekAgo], (err, results) => {
    if (err) {
      console.error('Error deleting old data:', err);
    } else {
      console.log('Old sensor data deleted');
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
