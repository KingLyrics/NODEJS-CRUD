const mysql = require("mysql");
const http = require("http");
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
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const { NAME, AGE, PHONE, YEARS_OF_EXP, DEPARTMENT, SKILLS } =
        JSON.parse(body);
      const query = `INSERT INTO Employee_data (NAME, age, phone, years_of_exp, department, skills)
                        VALUES ('${NAME}', ${AGE}, ${PHONE}, ${YEARS_OF_EXP}, '${DEPARTMENT}', '${SKILLS}')`;
      conn.query(query, (error, results) => {
        if (error) {
          console.error("Error inserting employee data: ", error);
          sendResponse(500, { error: "Error adding employees" });
        } else {
          console.log("Employee added to the database: ", results);
          sendResponse(201, { message: "Employee added successfully!" });
        }
      });
    });
  } else if (req.method === "PATCH" && req.url === "/employees:id") {
    res.end("<h1>Change custom emp</h1>");
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Running on ${process.env.PORT}`);
});
