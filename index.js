const express = require("express");
const app = express();
const PORT = 3000;
const cors = require("cors");
const client = require("./db/client");

require("dotenv").config();

app.use(cors());
app.use(express.json());

const apiRouter = require("./api");
app.use("/api", apiRouter);

client.connect();

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

// require("dotenv").config();
// const { PORT = 3000 } = process.env;

// // create the express server here
// const express = require("express");
// const app = express();
// app.use(express.json());

// const cors = require("cors");
// app.use(cors());

// //entry point to all routes, so most middleware should go above here
// const apiRouter = require("./api");
// app.use("/api", apiRouter);

// const { client } = require("./db/client");
// client.connect();

// app.listen(PORT, () => {
//   console.log("The server is up on port", PORT);
// });
