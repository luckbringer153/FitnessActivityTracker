const express = require("express");
const rouActsRouter = express.Router();
const {
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
  destroyRoutineActivity,
} = require("../db");
// const jwt = require("jsonwebtoken");
const authorizeUser = require("./utils"); //used to validate whether user is logged in or not

// rouActsRouter.use((req, res, next) => {
//   console.log("A request is being made to /routine_activities");

//   res.send({ message: "hello from /routine_activities!" });

//   next();
// });

//helper function for two paths below
async function checkUserOwnsRoutine(req, res, next) {
  try {
    const { routineId } = await getRoutineActivityById(
      req.params.routineActivityId
    );

    const routine = await getRoutineById(routineId);

    if (+routine.creatorId !== +req.user.id) {
      throw new Error("Users can only modify routines that they have created");
    }

    next();
  } catch (error) {
    next(error);
  }
}

//PATCH /routine_activities/:routineActivityId **
//Update the count or duration on the routine activity
rouActsRouter.patch(
  "/:routineActivityId",
  [authorizeUser, checkUserOwnsRoutine],
  async (req, res, next) => {
    try {
      const { count, duration } = req.body;

      const rouAct = await updateRoutineActivity({
        id: req.params.routineActivityId,
        count,
        duration,
      });

      res.send(rouAct);
    } catch (error) {
      next(error);
    }
  }
);

//DELETE /routine_activities/:routineActivityId **
//Remove an activity from a routine, use hard delete
// we'll call this route from the frontend by:
// const response = await fetch(`$BASE_URL/api/routine_activities/${activity.routineActivityId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` }})
rouActsRouter.delete(
  "/:routineActivityId",
  [authorizeUser, checkUserOwnsRoutine],
  async (req, res, next) => {
    console.log("made it into rouActsRouter.delete");
    try {
      const destroyedRouAct = await destroyRoutineActivity(
        req.params.routineActivityId
      );

      console.log("made it to line 75 in rouActsRoute.delete");

      res.send(destroyedRouAct);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = rouActsRouter;
