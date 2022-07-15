const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const sequelize = require('./utils/dbConfig');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
// Routes
app.use('/api', require('./routes/comments'));
app.use('/api', require('./routes/cities'));
// Static
app.use(express.static('./public'));

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    } catch (err) {
        console.log(err);
    }
};

start();
