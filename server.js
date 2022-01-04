const express = require('express'); //backend framework
const mongoose = require('mongoose'); //ORM (object relational mapping) to interact with database
const bodyParser = require('body-parser'); //take requests and get data from the body

const items = require('./routes/api/items');

const app = express();

// Body Parser (middleware)
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose.connect(db)
    .then(() => console.log('MongoDB Connected!'))
    .catch(() => console.log('ERROR: MongoDB unable to connect'));

// Use Routes
app.use('/api/items', items);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));