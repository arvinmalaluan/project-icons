const mysql = require("mysql2");

let pool = mysql.connect({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

pool.connect((err) => {
  if (!err) {
    console.log("Database connected successfully.");
  } else {
    console.log(err);
  }
});

module.exports = pool;
