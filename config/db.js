function connection() {
  try {
    const mysql = require('mysql2');

    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      timezone: 'utc',
      connectionLimit: 10,
      waitForConnections: true,
      queueLimit: 0
    });

    const promisePool = pool.promise();

    return promisePool;
  } catch (error) {
    return console.log(`Could not connect - ${error}`);
  }
}

const pool = connection();

module.exports = {
  connection: async () => pool.getConnection(),
  execute: (...params) => pool.execute(...params)
};