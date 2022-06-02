const client = require("./client");

//getRoutineActivityById
// getRoutineActivityById(id)
// return the routine_activity
async function getRoutineActivityById(id) {
  try {
    const {
      rows: [rouAct],
    } = await client.query(
      `
        SELECT *
        FROM routine_activities
        WHERE id=$1
    `,
      [id]
    );

    return rouAct;
  } catch (error) {
    throw error;
  }
}

//addActivityToRoutine
// addActivityToRoutine({ routineId, activityId, count, duration })
// create a new routine_activity, and return it
async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  //"Prevent duplication on (routineId, activityId) pair."
  // console.log("you made it to line 35 in db function, addActivityToRoutine");

  try {
    const {
      rows: [rouAct],
    } = await client.query(
      `
        INSERT INTO routine_activities("routineId","activityId",count,duration)
        VALUES($1,$2,$3,$4)
        RETURNING *
    `,
      [routineId, activityId, count, duration]
    );

    // console.log("you made it to line 49 in db function, addActivityToRoutine");

    return rouAct;
  } catch (error) {
    throw error;
  }
}

//updateRoutineActivity
// updateRoutineActivity({ id, count, duration })
// Find the routine_activity with id equal to the passed in id
// Update the count or duration as necessary
async function updateRoutineActivity({ id, count, duration }) {
  try {
    const {
      rows: [rouAct],
    } = await client.query(
      `
        UPDATE routine_activities
        SET count=$1,duration=$2
        WHERE id=$3
        RETURNING *
      `,
      [count, duration, id]
    );

    return rouAct;
  } catch (error) {
    throw error;
  }
}

//destroyRoutineActivity
// destroyRoutineActivity(id)
// remove routine_activity from database
async function destroyRoutineActivity(id) {
  console.log("made it inside db function, destroyRoutineActivity");

  try {
    const {
      rows: [deletedRouAct],
    } = await client.query(
      `
            DELETE FROM routine_activities 
            WHERE id=$1
            RETURNING *;
        `,
      [id]
    );

    console.log("made it to line 99 of db function, destroyRoutineActivity");

    return deletedRouAct;
  } catch (error) {
    throw error;
  }
}

//getRoutineActivitiesByRoutine
// getRoutineActivitiesByRoutine({ id })
// select and return an array of all routine_activity records
async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: rouActs } = await client.query(
      `
        SELECT *
        FROM routine_activities
        WHERE "routineId" = $1
    `,
      [id]
    );

    return rouActs;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  getRoutineActivitiesByRoutine,
};
