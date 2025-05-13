const express = require("express");
require("dotenv").config();

const cors = require("cors");
const connectDb = require("./config/dbConnection");

const cookieParser = require("cookie-parser");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./docs/swagger-output.json");
const bodyParser = require("body-parser");
const app = express();
const logger = require("morgan");

app.use(logger("tiny"));

app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

connectDb();

const port = process.env.PORT || 5000;

app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173", "https://gragnily.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        console.log(origin);
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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

app.use(
  "/api/gemini",
  require("./routes/geminiRoutes")
  // #swagger.tags = ['Gemini']
);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
  console.log(
    `Swagger docs at https://gragnily.onrender.com/api-docs`,
    `or http://localhost:${port}/api-docs`
  );
});
