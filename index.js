const mysql = require("mysql");
const http = require("http");
const JSON = require('body-parser')
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

const server = http.createServer((req, res) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const sendResponse = (statusCode, payload) => {
    res.writeHead(statusCode, headers);
    res.end(JSON.stringify(payload));
  };

  if (req.method === "GET" && req.url === "/employees") {
    conn.query("SELECT * FROM Employee_data", (error, resuts) => {
      if (error) {
        sendResponse(500, { error: "Error fetching employees" });
      } else {
        sendResponse(200, resuts);
        console.log("Here is the list of all users");
      }
    });
  } else if (req.method === "POST" && req.url === "/employees") {

    const { name, age, phone, years_of_exp, department, skills } = body;

    conn.query(
      `INSERT INTO Employee_data (name,age,phone,yearsofexp,department,skills) VALUES ('${name}', ${age}, ${phone}, ${years_of_exp}, '${department}', '${skills}')`,
      (error, results) => {
        if (error) {
          sendResponse(500, { error: "Error adding employees" });
        } else {
          sendResponse(201, results);
          console.log("Employee Added to the database");
        }
      }
    );
  } else if (req.method === "DELETE" && req.url === "/about:id") {
    // Handle all other requests
  } else if (req.method === "UPDATE" && req.url === "/employee:id") {
    res.end();
  } else {
    res.statusCode = 404;
    res.end("404 Not Found");
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Running on ${process.env.PORT}`);
});
