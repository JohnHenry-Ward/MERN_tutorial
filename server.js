const express = require('express'); //backend framework
const mongoose = require('mongoose'); //ORM (object relational mapping) to interact with database
const path = require('path'); //deal with file paths
const config = require('config');

const items = require('./routes/api/items');
const users = require('./routes/api/users');
const auth = require('./routes/api/auth');

const app = express();

// Body Parser (middleware)
app.use(express.json());

// DB Config
const db = config.get('mongoURI');

// Connect to Mongo
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected!'))
    .catch((err) => console.log('ERROR: MongoDB unable to connect', err));

// Use Routes
app.use('/api/items', items);
app.use('/api/users', users);
app.use('/api/auth', auth);

// Serve static assets if we are in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));