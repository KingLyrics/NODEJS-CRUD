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

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

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
  } else if (req.method === "PATCH" && req.url.startsWith("/employees/")) {
    const employeeId = req.url.split("/")[2];
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const { NAME, AGE, PHONE, YEARS_OF_EXP, DEPARTMENT, SKILLS } =
          JSON.parse(body);
        const updateFields = [];
        if (NAME) {
          updateFields.push(`NAME='${NAME}'`);
        }
        if (AGE) {
          updateFields.push(`age=${AGE}`);
        }
        if (PHONE) {
          updateFields.push(`phone=${PHONE}`);
        }
        if (YEARS_OF_EXP) {
          updateFields.push(`years_of_exp=${YEARS_OF_EXP}`);
        }
        if (DEPARTMENT) {
          updateFields.push(`department='${DEPARTMENT}'`);
        }
        if (SKILLS) {
          updateFields.push(`skills='${SKILLS}'`);
        }
        const query = `UPDATE Employee_data SET ${updateFields.join(
          ","
        )} WHERE id=${employeeId}`;
        conn.query(query, (error, results) => {
          if (error) {
            console.error("Error updating employee data: ", error);
            sendResponse(500, { error: "Error updating employee data" });
          } else if (results.affectedRows === 0) {
            sendResponse(404, { error: "Employee not found" });
          } else {
            console.log(`Employee with id ${employeeId} updated: `, results);
            sendResponse(200, { message: "Employee updated successfully!" });
          }
        });
      } catch (err) {
        console.error("Error parsing request body as JSON: ", err);
        sendResponse(400, { error: "Invalid request body" });
      }
    });
  } else if (req.method === "DELETE" && req.url.startsWith("/employees/")) {
    const employeeId = req.url.split("/")[2];
    const query = `DELETE FROM Employee_data WHERE id=${employeeId}`;
    conn.query(query, (error, results) => {
      if (error) {
        console.error("Error in deleting employee data: ", error);
        sendResponse(500, { error: "Error in delting employee data" });
      } else if (results.affectedRows === 0) {
        sendResponse(404, { error: "Employee not found" });
      } else {
        console.log(`Employee with the id of ${employeeId} has been deleted`);
        sendResponse(200, { message: "Employee data has been deleted" });
      }
    });
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Running on ${process.env.PORT}`);
});
