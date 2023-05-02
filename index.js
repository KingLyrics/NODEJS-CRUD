const mysql = require("mysql");
require("dotenv").config();

const conn = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

conn.connect((err) => {
  if (err) {
    console.log("Error connecting to mysql", err);
    return;
  }

  console.log("Connected to the DB");
});
