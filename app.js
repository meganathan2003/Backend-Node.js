const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();

const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Replace with your frontend URL
    optionsSuccessStatus: 200 // Some legacy browsers (IE11) choke on 204
  };

  app.use(cors(corsOptions));

// Create connection to your MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ecommerce'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL database connected');
});

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle user registration
app.post('/Login', (req, res) => {
    const { email, password } = req.body;

    // Insert the user into the database
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error registering user');
        } else {
            console.log('User registered successfully');
            res.status(200).send('User registered successfully');
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
