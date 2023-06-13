// Import and require inquirer
const inquirer = require("inquirer");
// Import and require mysql2
const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection({
  host: "127.0.0.1",
  // MySQL username,
  user: "root",
  // MySQL password here
  password: "",

  database: "employee_db",
});
db.connect((err) => {
  if (err) {
    console.error("ERROR: %s", err.message);
    return;
  }
  console.log(`\nSuccessfully connected to the employee_db database`);
  (async () => {
    while (true) {
      await handleOptions();
    }
  })();
});



async function handleOptions() {
  const options = [
    "View All Departments",
    "Add a Department",
    "View All Roles",
    "Add a Role",
    "View All Employees",
    "Add an Employee",
    "Delete an Employee",
    "Update an Employee Role",
    "Quit",
  ];
  const results = await inquirer.prompt([
    {
      message: "What would you like to do?",
      name: "command",
      type: "list",
      choices: options,
      loop: false,
    },
  ]);

  switch (results.command) {
    case "View All Departments":
      await displayTable("department");
      break;
    case "View All Roles":
      await displayTable("role");
      break;
    case "View All Employees":
      await displayTable("employee");
      break;
    case "Add a Department":
      await createDepartment();w
      break;
    case "Add a Role":
      await createRole();
      break;1
    case "Add an Employee":
      await createEmployee();
      break;
    case "Update an Employee Role":
      await updateEmployeeRole();
      break;
    case "Delete an Employee":
      await deleteEmployee();
      break;
    case "Quit":
      process.exit();
      break;
    default:
      console.log("Oops something went wrong! Please start again.");
      process.exit();
      break;
  }
}

//select all departments from mysql
async function displayTable(table_name) {
  const sql = `SELECT * FROM ${table_name}`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    console.log();
    console.table(rows);
  });
}
// Function create new department from usen input in prompt and insert data to the database
async function createDepartment() {
  const results = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of department?",
    },
  ]);
  const newDepartment = results.name;
  const sql = `INSERT INTO department (name) VALUES (?)`;
  console.log(`Department ${newDepartment} added successfully!`);
  db.query(sql, [newDepartment], (err, result) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
  });
}
// Create a role
async function createRole() {
  let sql = `SELECT id, name FROM department`;
  /*
 db.query(sql, values, (err, result) => {
  if (err) {
    console.log("ERROR: %s", err.message);
    return;
  }
  const results = await inquirer.prompt([
    { type: "input", name: "title", message: "What is the name of the role?" },
    {
      type: "input",
      name: "salary",
      message: "What is the salary for this role?",
    },
    {
      type: "list",
      name: "department",
      choices: departments,
    },
  ]);
  */

  const newRoleTitle = results.title;
  const newRoleSalary = results.salary;
  const newRoleDepartment = results.department;

  sql = `INSERT INTO role (title, salary, department)
    VALUES (?, ?, ?)`;
  const values = [newRoleTitle, newRoleSalary, newRoleDepartment];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    console.log("Role added successfully!");
  });
}

// Create an employee
async function createEmployee() {
  const results = await inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?:",
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "roleId",
      choices: roles,
      message: "What is the employee's role?",
    },
    {
      type: "list",
      name: "managerId",
      message: "What is the employee's manager?",
      choices: employeeChoices,
    },
  ]);

  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`;
  const values = [
    results.firstName,
    results.lastName,
    results.roleId,
    results.managerId,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    console.log("Employee added successfully!");
  });
}

// Delete an employee from mysql
async function deleteEmployee() {
  const results = await inquirer.prompt([
    {
      type: "input",
      name: "employeeId",
      message: "Enter the ID of the employee to delete:",
    },
  ]);

  const sql = `DELETE FROM employee WHERE id = ?`;
  const values = [results.employeeId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    console.log("Employee deleted successfully!");
  });
}
// Update an employee role
async function updateEmployeeRole() {

  const employees = await getEmployees();
  const roles = await getRoles();

  const employeeChoices = employees.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));

  const roleChoices = roles.map((role) => ({
    value: role.title,
  }));

  const results = await inquirer.prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's role do you want to update",
      choices: employeeChoices,
    },
     {
      type: "list",
      name: "roleId",
      message: "Which role do you want to assign the selected employee",
      choices: roleChoices,
    },
  ]);

  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  const values = [results.roleId, results.employeeId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    console.log("Employee role updated successfully!");
  });
}


async function getEmployees() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM employee";
    db.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
async function getRoles() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM role";
    db.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function getDepartment() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM department";
    db.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
//TODO get managers
async function getManagers() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT  FROM employee";
    db.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

