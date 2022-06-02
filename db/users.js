const client = require("./client");
const bcrypt = require("bcrypt"); //for extra credit password hashing

//createUser
// createUser({ username, password })
// make sure to hash the password before storing it to the database
//EXTRA CREDIT
// const SALT_COUNT = 10;
// const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users(username, password)
        VALUES($1,$2)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
      `,
      [username, hashedPassword]
    );

    delete user.password;

    return user;
  } catch (error) {
    throw error;
  }
}

//getUser
// getUser({ username, password })
// this should be able to verify the password against the hashed password
//EXTRA CREDIT
// const user = await getUserByUsername(username);
// const hashedPassword = user.password;
// const passwordsMatch = await bcrypt.compare(password, hashedPassword);
// if (passwordsMatch) {
//   // return the user object (without the password)
// } else {
//   throw SomeError;
// }
async function getUser({ username, password }) {
  const savedUser = await getUserByUsername(username);
  // console.log(savedUser);
  const hashedPassword = savedUser.password;
  // console.log(hashedPassword);
  // console.log(password);

  const passwordsMatch = await bcrypt.compare(password, hashedPassword);

  if (passwordsMatch) {
    try {
      const {
        rows: [user],
      } = await client.query(
        `
        SELECT *
        FROM users
        WHERE username=$1
      `,
        [username]
      );

      delete user.password;

      return user;
    } catch (error) {
      throw error;
    }
  }
}

//getUserById
// getUserById(id)
// select a user using the user's ID. Return the user object.
// do NOT return the password
async function getUserById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id,username
      FROM users
      WHERE id=$1
    `,
      [id]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

//getUserByUsername
// getUserByUsername(username)
// select a user using the user's username. Return the user object.
async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
    `,
      [username]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
