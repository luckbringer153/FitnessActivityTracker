const express = require("express");
const myRoutinesRouter = express.Router();
const { getAllRoutinesByUser } = require("../db");

//GET /myroutines
//Grabs all routines created by the current user whether or not they're public
myRoutinesRouter.get("/myroutines", async (req, res, next) => {
  try {
    const { username } = req.body;
    console.log(username);

    const routines = await getAllRoutinesByUser({
      username,
    });

    res.send(routines);
  } catch (error) {
    next(error);
  }
});

module.exports = myRoutinesRouter;
