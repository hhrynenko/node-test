const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser");
require('dotenv').config()

const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
//Routes
app.use('/api', require('./routes'))
//Static
app.use(express.static('./public'))

app.listen(PORT, () => console.log(`Server running on ${PORT}`))