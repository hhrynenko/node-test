const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
// Routes
app.use('/api', require('./routes/authorization'));
app.use('/api', require('./routes/comments'));
app.use('/api', require('./routes/cities'));
app.use('/api', require('./routes/ratings'));
// Static
app.use(express.static('./public'));

module.exports = app;
