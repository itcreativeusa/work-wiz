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
  // MySQL database here
  database: "employee_db",
});
db.connect((err) => {
  if (err) {
    console.error("ERROR: %s", err.message);
    return;
  }

  //If the database connection is successful without any errors initiate the prompt

  console.log(`\nSuccessfully connected to the employee_db database`);
  (async () => {
    while (true) {
      await handleOptions();
    }
  })();
});
//Execute the function and initiate the prompt to display a list of options to the user
async function handleOptions() {
  //List of options to the user
  const results = await inquirer.prompt([
    {
      type: "list",
      name: "command",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "Add a Department",
        "Delete a Department",
        "View All Roles",
        "Add a Role",
        "Delete a Role",
        "View All Employees",
        "Add an Employee",
        "Delete an Employee",
        "Update an Employee Role",
        "Quit",
      ],
      loop: false,
    },
  ]);
  //Execute the function based on the user's choice
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
      await createDepartment();
      break;
    case "Delete a Department":
      await deleteDepartment();
      break;
    case "Add a Role":
      await createRole();
      break;
    case "Delete a Role":
      await deleteRole();
      break;
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

//Show All the Departments function
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
// Function create New Department based on the user's choice
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
// Function Delete a selected deparment based on the user's choice
async function deleteDepartment() {
  const departmentsChoices = await getDepartment();

  const results = await inquirer.prompt([
    {
      type: "list",
      name: "department",
      message: "Which department do you want to delete?",
      //Show department by name using .map method
      choices: departmentsChoices,
    },
  ]);
  const department = results.department;
  //Delete from Database
  const sql = `DELETE FROM department WHERE id = ?`;
  const values = [department.id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    console.log(`Department ${department.name} deleted successfully!`);
  });
}

// Function Add a New Role
async function createRole() {
  const departmentsChoices = await getDepartment();
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
      message: "Which department does the role belong to?",
      choices: departmentsChoices,
    },
  ]);
  //Insert to Database
  const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`;
  const values = [results.title, results.salary, results.department.id];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    console.log("Role added successfully!");
  });
}

// Function Delete selected role
async function deleteRole() {
  const roleChoices = await getRoles();

  const results = await inquirer.prompt([
    {
      type: "list",
      name: "role",
      message: "Which role do you want to delete?",
      choices: roleChoices,
    },
  ]);
  const role = results.role;
  //Delete from Database
  const sql = `DELETE FROM role WHERE id = ?`;
  const values = [role.id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    console.log(`Role ${role.title} deleted successfully!`);
  });
}

// Function Add New Employee
async function createEmployee() {
  const employeeChoices = await getEmployees();
  const roleChoices = await getRoles();

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
      message: "What is the employee's role?",
      choices: roleChoices,
    },
    {
      type: "list",
      name: "managerId",
      message: "What is the employee's manager?",
      choices: employeeChoices,
    },
  ]);
  //Insert to Database
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

// Update an employee role
async function updateEmployeeRole() {
  const employees = await getEmployees();
  const roles = await getRoles();
  //Save to variable employee first & last name using .map method
  const employeeChoices = employees.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));

  const roleChoices = roles.map((role) => ({
    name: role.title,
    value: role.id,
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
  //Update Database
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

// Delete an employee from mysql
async function deleteEmployee() {
  const employees = await getEmployees();
  const roles = await getRoles();

  const employeeChoices = employees.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));

  const results = await inquirer.prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to delete?",
      choices: employeeChoices,
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
    const sql = "SELECT id, title FROM role";
    db.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        mapped = rows.map((role) => {
          return { name: role.title, value: role };
        });
        resolve(mapped);
      }
    });
  });
}

async function getDepartment() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, name FROM department";
    db.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        mapped = rows.map((department) => {
          return { name: department.name, value: department };
        });
        resolve(mapped);
      }
    });
  });
}
