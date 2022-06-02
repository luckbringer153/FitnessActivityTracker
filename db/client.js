// build and export your unconnected client here
const { Client } = require("pg");
const CONNECTION_STRING =
  process.env.DATABASE_URL || "postgres://localhost:5432/fitness-dev";
const client = new Client(CONNECTION_STRING);

//connect to the "fitness-dev" database created in Learn Dot workshop "UNIV Web - FitnessTrac.kr: Back-End" section "3: The Database" section "Setting Up"
module.exports = client;
