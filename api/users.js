const express = require("express");
const usersRouter = express.Router();
const {
  createUser,
  getUser,
  getUserById,
  getPublicRoutinesByUser,
  getAllRoutinesByUser,
} = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const authorizeUser = require("./utils"); //used to validate whether user is logged in or not

// usersRouter.use((req, res, next) => {
//   console.log("A request is being made to /users");

//   res.send({ message: "hello from /users!" });

//   next();
// });

//POST /users/register
//Create a new user. Require username and password, and hash password before saving user to DB. Require all passwords to be at least 8 characters long. Throw errors for duplicate username, or password-too-short.
usersRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (password.length < 8) {
      throw new Error("password length must be at least 8 characters");
    }

    const user = await createUser({ username, password });

    //gonna try adding token to see if that fixes the problem...?
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET
    );

    // console.log({ user, token });

    res.send({ user, token });
    // res.send({ token });
  } catch (error) {
    next(error);
  }
});

//POST /users/login
//Log in the user. Require username and password, and verify that plaintext login password matches the saved hashed password before returning a JSON Web Token. Keep the id and username in the token.
usersRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    //getUser already checks for password match
    const user = await getUser({ username, password });

    // console.log(username, password);
    // console.log(user);

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET
    );

    // console.log({ user, token });

    res.send({ user, token });
  } catch (error) {
    next(error);
  }
});

//GET /users/me *
//Send back the logged-in user's data if a valid token is supplied in the header.
usersRouter.get("/me", authorizeUser, async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);

    res.send(user);
  } catch (error) {
    next(error);
  }
});

//GET /users/:username/routines
// Get a list of public routines for a particular user.
usersRouter.get("/:username/routines", async (req, res, next) => {
  try {
    // lets check the authorization headers
    // for a token
    const auth = req.header("Authorization");
    const token = auth.split(" ")[1];
    let routines;

    // then, lets verify the token with jwt.verify()
    // and get access to the user's username
    const { username } = jwt.verify(token, JWT_SECRET);

    // then, we can compare the username to the username on this route
    // if they match, we'll return getAllRoutinesByUser()
    // if they don't match, we'll return the public routines only
    if (username === req.params.username) {
      routines = await getAllRoutinesByUser({
        username: req.params.username,
      });
    } else {
      routines = await getPublicRoutinesByUser({
        username: req.params.username,
      });
    }

    res.send(routines);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
