const express = require("express");
const dotenv = require("dotenv").config();

const cors = require("cors");
const connectDb = require("./config/dbConnection");

const cookieParser = require("cookie-parser");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const { verifyToken } = require("./middleware/verifyJwt");

const swaggerDocument = YAML.load(path.join(__dirname, "./docs/swagger.yaml"));

const app = express();

connectDb();

const port = process.env.PORT || 5000;
const connectionString = process.env.CONNECTION_STRING;

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//parse the body to json file
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//default http requests
app.use("/api/books", require("./routes/BookRoutes"));
app.use("/api/authors", require("./routes/authorRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api-docs`);
});

console.log("Connection String: ", process.env.NODE_ENV);
