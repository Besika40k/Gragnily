const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();

const cors = require("cors");
const connectDb = require("./config/dbConnection");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDocument = YAML.load(path.join(__dirname, "./docs/swagger.yaml"));

const app = express();

connectDb();

const port = process.env.PORT || 5000;
const connectionString = process.env.CONNECTION_STRING;

app.use(cors());
app.use(errorHandler);

//parse the body to json file
app.use(express.json());

app.use(express.urlencoded({extended : true}))

//default http requests
app.use("/api/books", require("./routes/BookRoutes"));
app.use("/api/authors", require("./routes/authorRoutes"));
app.use("/api/auth", require("./routes/authRoutes"))

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api-docs`);
});
