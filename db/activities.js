const client = require("./client");

//getActivityById
// getActivityById(id)
// return the activity
async function getActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
        SELECT *
        FROM activities
        WHERE id=$1;
      `,
      [id]
    );

    return activity;
  } catch (error) {
    throw error;
  }
}

// getAllActivities
// select and return an array of all activities
async function getAllActivities() {
  try {
    const { rows: allActivities } = await client.query(`
        SELECT *
        FROM activities
    `);

    return allActivities;
  } catch (error) {
    throw error;
  }
}

// createActivity
// createActivity({ name, description })
// return the new activity
async function createActivity({ name, description }) {
  // const lowerName = name.toLowerCase();

  try {
    const {
      rows: [activity],
    } = await client.query(
      `
        INSERT INTO activities(name,description)
        VAlUES($1,$2)
        RETURNING *;
      `,
      [name, description]
    );

    return activity;
  } catch (error) {
    throw error;
  }
}

// updateActivity
// updateActivity({ id, name, description })
// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
        UPDATE activities
        SET name=$1,description=$2
        WHERE id=$3
        RETURNING *;
      `,
      [name, description, id]
    );

    return activity;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  updateActivity,
  createActivity,
  getActivityById,
  getAllActivities,
};
