// create an api router
const express = require("express");
const apiRouter = express.Router();

// const jwt = require("jsonwebtoken");
// const { getUserById } = require("../db");
// const { JWT_SECRET } = process.env;

// apiRouter.use(async (req, res, next) => {
//   const prefix = "Bearer";
//   const auth = req.header("Authorization");

//   if (!auth) {
//     next();
//   } else if (auth.startsWith(prefix)) {
//     const token = auth.slice(prefix.length);

//     try {
//       const { id } = jwt.verify(token, JWT_SECRET);

//       if (id) {
//         req.user = await getUserById(id);
//         next();
//       }
//     } catch ({ name, message }) {
//       next({ name, message });
//     }
//   } else {
//     next({
//       name: "AuthorizationHeaderError",
//       message: `Authorization token must start with ${prefix}`,
//     });
//   }
// });

// apiRouter.use((req, res, next) => {
//   if (req.user) {
//     console.log("User is set:", req.user);
//   }

//   next();
// });

apiRouter.get("/health", async (req, res, next) => {
  try {
    res.send({ message: "healthy" });
  } catch (error) {
    next(error);
  }
});

// attach other routers from files in this api directory (users, activities...)
const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const activitiesRouter = require("./activities");
apiRouter.use("/activities", activitiesRouter);

const routinesRouter = require("./routines");
apiRouter.use("/routines", routinesRouter);

const myRoutinesRouter = require("./myroutines");
apiRouter.use("/myroutines", myRoutinesRouter);

const rouActsRouter = require("./routine_activities");
apiRouter.use("/routine_activities", rouActsRouter);

//error handler
// apiRouter.use((error, req, res, next) => {
//   res.send({ name: error.name, message: error.message });
// });

// export the api router
module.exports = apiRouter;
