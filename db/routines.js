const client = require("./client");
const { getUserById } = require("./users");

//getRoutineById
// getRoutineById(id)
// return the routine
async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
            SELECT *
            FROM routines
            WHERE id=$1
        `,
      [id]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

//getRoutinesWithoutActivities
// select and return an array of all routines
//used for seedData.js, not tested
async function getRoutinesWithoutActivities() {
  try {
    const { rows: allRoutines } = await client.query(`
        SELECT * FROM routines
      `);

    return allRoutines;
  } catch (error) {
    throw error;
  }
}

//getAllRoutines
// select and return an array of all routines, include their activities
async function getAllRoutines() {
  try {
    const { rows: allRoutines } = await client.query(`
        SELECT 
          routines.*, 
          users.username AS "creatorName", 
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id',activities.id,
              'routineActivityId',rouActs.id,
              'name',activities.name,
              'description',activities.description,
              'count',rouActs.count,
              'duration',rouActs.duration
            )
          ) AS activities 
        FROM routines
        INNER JOIN routine_activities AS rouActs ON rouActs."routineId" = routines.id
        INNER JOIN activities ON rouActs."activityId" = activities.id
        INNER JOIN users ON routines."creatorId" = users.id
        GROUP BY routines.id, users.username;
      `);

    return allRoutines;

    // Another way of doing this method
    // //grabs all routines
    // const routines = await getRoutinesWithoutActivities();

    // //for each routine, adda column w/ info of all that routine's activities
    // for (let i = 0; i < routines.length; i++) {
    //   const { rows: activities } = await client.query(`
    //     SELECT * FROM activities
    //     JOIN routine_activities
    //     ON activities.id=routine_activities."activityId"
    //     WHERE "routineId"=${routines[i].id};
    //   `);

    //   //for each routine, grab its associated user using function, then add creatorName and activities columns
    //   const user = await getUserById(routines[i].creatorId);
    //   routines[i].creatorName = user.username;
    //   routines[i].activities = activities;
    // }

    // return routines;
  } catch (error) {
    throw error;
  }
}

//getAllPublicRoutines
// select and return an array of public routines, include their activities
async function getAllPublicRoutines() {
  try {
    const { rows: allRoutines } = await client.query(`
        SELECT 
          routines.*, 
          users.username AS "creatorName", 
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id',activities.id,
              'routineActivityId',rouActs.id,
              'name',activities.name,
              'description',activities.description,
              'count',rouActs.count,
              'duration',rouActs.duration
            )
          ) AS activities 
        FROM routines
        LEFT JOIN routine_activities AS rouActs ON rouActs."routineId" = routines.id
        LEFT JOIN activities ON rouActs."activityId" = activities.id
        LEFT JOIN users ON routines."creatorId" = users.id
        WHERE routines."isPublic" = true
        GROUP BY routines.id, users.username;
      `);

    return allRoutines;
  } catch (error) {
    throw error;
  }
}

//getAllRoutinesByUser
// getAllRoutinesByUser({ username })
// select and return an array of all routines made by user, include their activities
async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: allRoutines } = await client.query(
      `
        SELECT 
          routines.*, 
          users.username AS "creatorName", 
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id',activities.id,
              'routineActivityId',rouActs.id,
              'name',activities.name,
              'description',activities.description,
              'count',rouActs.count,
              'duration',rouActs.duration
            )
          ) AS activities 
        FROM routines
        LEFT JOIN routine_activities AS rouActs ON rouActs."routineId" = routines.id
        LEFT JOIN activities ON rouActs."activityId" = activities.id
        LEFT JOIN users ON routines."creatorId" = users.id
        WHERE users.username = $1
        GROUP BY routines.id, users.username;
      `,
      [username]
    );

    return allRoutines;
  } catch (error) {
    throw error;
  }
}

//getPublicRoutinesByUser
// getPublicRoutinesByUser({ username })
// select and return an array of public routines made by user, include their activities
async function getPublicRoutinesByUser({ username }) {
  try {
    const routines = await getAllRoutinesByUser({ username });
    // console.log({ routines });

    const filteredRoutines = routines.filter((rou) => {
      if (rou.isPublic === true) {
        return rou;
      }
    });

    return filteredRoutines;
  } catch (error) {
    throw error;
  }
}

//getPublicRoutinesByActivity
// getPublicRoutinesByActivity({ id })
// select and return an array of public routines which have a specific activityId in their routine_activities join, include their activities
async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: allRoutines } = await client.query(
      `
        SELECT 
          routines.*, 
          users.username AS "creatorName", 
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id',activities.id,
              'routineActivityId',rouActs.id,
              'name',activities.name,
              'description',activities.description,
              'count',rouActs.count,
              'duration',rouActs.duration
            )
          ) AS activities 
        FROM routines
        INNER JOIN routine_activities AS rouActs ON rouActs."routineId" = routines.id
        INNER JOIN activities ON rouActs."activityId" = activities.id
        INNER JOIN users ON routines."creatorId" = users.id
        WHERE activities.id = $1
        GROUP BY routines.id, users.username;
      `,
      [id]
    );

    return allRoutines;
  } catch (error) {
    throw error;
  }
}

//createRoutine
// createRoutine({ creatorId, isPublic, name, goal })
// create and return the new routine
async function createRoutine({ creatorId, isPublic, name, goal }) {
  // const lowerName = name.toLowerCase();  //was used in createActivity

  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        INSERT INTO routines("creatorId", "isPublic", name, goal)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );

    //test file just wants id and name returned for this function
    return routine;
  } catch (error) {
    throw error;
  }
}

//updateRoutine
// updateRoutine({ id, isPublic, name, goal })
// Find the routine with id equal to the passed in id
// Don't update routineId, but do update isPublic status, name, or goal, as necessary
// Return the updated routine
async function updateRoutine({ id, isPublic, name, goal }) {
  // first, we need to build a fields object consisting of all update-able fields for a routine
  // ie, isPublic, name, goal
  const fields = { isPublic, name, goal };

  // second, we need to loop that fields object and remove any undefined key-value pairs
  // for-in loop
  for (const key in fields) {
    if (fields[key] === undefined) {
      delete fields[key];
    }
  }

  // third, we need to (finally) build a setString using the map() logic you'll find in juicebox updater for a user
  // fourth, we can update! but, before that, we'll need to have modified the setString builder since we have to account for the placeholder for our id -> we need to offset the map logic by 2, not 1
  // once that's done, we can build a values array from the id and the values of the fields object
  const setString = Object.keys(fields) // -> Object.keys(fields) returns an Array of keys as strings ['key1', 'key2', ...]
    .map((key, index) => `"${key}"=$${index + 2}`) // "key1" = $1, "key2" = $2; offset because $1 is reserved for id
    .join(", "); //conacates it into a string
  // console.log({ setString });

  try {
    const {
      rows: [routine],
    } = await client.query(
      `
            UPDATE routines
            SET ${setString}
            WHERE id=$1
            RETURNING *;
        `,
      [id, ...Object.values(fields)] // [ 1, false, 'legDay', 'goal string or somethin :)' ]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

//destroyRoutine
// destroyRoutine(id)
// remove routine from database
// Make sure to delete all the routine_activities whose routine is the one being deleted.
async function destroyRoutine(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(`DELETE FROM routines WHERE id=$1 RETURNING *`, [
      id,
    ]);

    return routine;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
