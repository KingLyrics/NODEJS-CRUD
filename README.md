# NODEJS-CRUD
Node-js CRUD

README

This is a Node.js application that allows you to perform CRUD operations using a MySQL database.
Setup

    Clone the repository
    Run npm install to install the dependencies
    Create a MySQL database and update the connection details in the db.js file
    Run the server using npm start

Usage

The application exposes the following API endpoints:

    GET /employees: Get a list of all employees
    POST /employees: Add a new employee
    PATCH /employees/:id: Update an employee by ID
    DELETE /employees/:id: Delete an employee by ID

The payload for adding or updating an employee should be in the following JSON format:
`
{
  "name": "John Doe",
  "age": 30,
  "phone": "555-555-5555",
  "years_of_exp": 5,
  "department": "IT",
  "skills": "Node.js, React"
}
`

Dependencies

This application uses the following dependencies:

    express: A popular Node.js web framework for building APIs
    mysql: A Node.js library for connecting to MySQL databases

Conclusion

This Node.js application demonstrates how to use MySQL with Node.js to perform CRUD operations. Feel free to use this as a starting point for your own projects.
