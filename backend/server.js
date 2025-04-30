const express = require("express");
require("dotenv").config();

const cors = require("cors");
const connectDb = require("./config/dbConnection");

const cookieParser = require("cookie-parser");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./docs/swagger-output.json");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

connectDb();

const port = process.env.PORT || 5000;

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
app.use(
  "/api/books",
  require("./routes/BookRoutes")
  // #swagger.tags = ['Books']
);
app.use(
  "/api/authors",
  require("./routes/authorRoutes")
  // #swagger.tags = ['Authors']
);
app.use(
  "/api/auth",
  require("./routes/authRoutes")
  // #swagger.tags = ['Authentication']
);
app.use(
  "/api/users",
  require("./routes/userRoutes")
  // #swagger.tags = ['Users']
);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
  console.log(
    `Swagger docs at https://gragnily.onrender.com/api-docs`,
    `or http://localhost:${port}/api-docs`
  );
});
