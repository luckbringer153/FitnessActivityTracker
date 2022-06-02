// require and re-export all files in this db directory (users, activities...)
const Users = require("./users"); // attaches functions on module.exports from users.js here (and below); can repeat this for every other export if you want

module.exports = {
  ...Users,
  ...require("./activities"),
  ...require("./routines"),
  ...require("./routine_activities"),
  client: require("./client"),
};
//import into server/API w/ "require('./db')" rather than importing seperate files
//... is spread syntax, short0-hand for iteration
