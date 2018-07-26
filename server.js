const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Db config
const db = require('./config/keys').mongoURI;

app.get('/', (req, res) => {
  res.send('hello world');
});

// Connect to the db

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('Connected successfully to the database'))
  .catch((err) => console.log(err));

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.NODE_ENV || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));