const express = require("express");
const dotenv = require("dotenv").config();

const cors = require("cors");
const connectDb = require("./config/dbConnection");

const cookieParser = require("cookie-parser");

const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

const swaggerDocument = yaml.load(
  fs.readFileSync(path.join(__dirname, "./docs/swagger.yaml"), "utf8")
);

const app = express();

connectDb();

const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
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
app.use("/api/users", require("./routes/userRoutes"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
  console.log(
    `Swagger docs at https://gragnily.onrender.com/api-docs`,
    `or http://localhost:${port}/api-docs`
  );
});
