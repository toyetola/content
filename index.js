const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const routes = require('./routes/routes')

dotenv.config()

const port  = process.env.PORT || 5000

const app = express();

const { AppDataSource } =  require("./data-source")



// app.use(cors)

AppDataSource.initialize().then(async () => {
    console.log("Data base connected")
}).catch(error => console.log(error))

app.use(bodyParser.json())

// app.use('', routes)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

module.exports = app