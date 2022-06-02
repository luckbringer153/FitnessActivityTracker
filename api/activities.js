const express = require("express");
const activitiesRouter = express.Router();
const {
  updateActivity,
  createActivity,
  getAllActivities,
  getPublicRoutinesByActivity,
} = require("../db");
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils"); //used to validate whether user is logged in or not

// activitiesRouter.use((req, res, next) => {
//   console.log("A request is being made to /activities");

//   res.send({ message: "hello from /activities!" });

//   next();
// });

//GET /activities
//Just return a list of all activities in the database
activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();

    res.send(activities);
  } catch (error) {
    next(error);
  }
});

//POST /activities *
//Create a new activity
activitiesRouter.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const activity = await createActivity({ name, description });

    res.send(activity);
  } catch (error) {
    next(error);
  }
});

//PATCH /activities/:activityId *
//Anyone can update an activity (yes, this could lead to long term problems a la wikipedia)
activitiesRouter.patch("/:activityId", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    // console.log(req.body);

    const activity = await updateActivity({
      id: req.params.activityId,
      name,
      description,
    });

    res.send(activity);
  } catch (error) {
    next(error);
  }
});

//GET /activities/:activityId/routines
//Get a list of all public routines which feature that activity
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  try {
    const routines = await getPublicRoutinesByActivity({
      id: req.params.activityId,
    });

    res.send(routines);
  } catch (error) {
    next(error);
  }
});

module.exports = activitiesRouter;
