const express = require('express');
const connectDb = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv').config();


const app = express();

connectDb();

const port = process.env.PORT || 5000;
const connectionString = process.env.CONNECTION_STRING;

app.use(errorHandler)

//parse the body to json file
app.use(express.json())


//default http requests
app.use("/api/books", require("./routes/BookRoutes"))
app.use("/api/authors", require("./routes/authorRoutes"))


app.listen(port, () => {console.log(port)});
