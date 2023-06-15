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
  const departmentsChoices = await getDepartment();
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
      // await displayTable("role");
      await displayRoles();
      break;
    case "View All Employees":
      //await displayTable("employee");
      await displayEmployees();
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
  const sql = `SELECT  * FROM ${table_name}`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    console.log();
    console.table(rows);
  });
}
//Show All the Departments function2
async function displayTable2(table_name) {
  const sql = `SELECT  * FROM ${table_name}`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    console.log();
    console.table(rows);
  });
}
async function displayRoles() {
  const sql = `SELECT r.id, r.title, r.salary, d.name as department ` +
      `FROM role r JOIN department d on r.department_id = d.id`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    console.log();
    console.table(rows);
  });
}

async function displayEmployees() {
  const sql = `SELECT e.id, e.first_name, e.last_name, r.title as role, ` +
      `CONCAT(m.first_name, ' ', m.last_name) as manager ` +
      `FROM employee e ` +
      `JOIN role r on e.role_id = r.id ` +
      `LEFT JOIN employee m on e.manager_id = m.id`;
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
      choices: departmentsChoices.map((department) => department.name),
    },
  ]);
  //Save variable selected department by name
  const department = departmentsChoices.find(
    (department) => department.name === results.department
  );
  //Delete from Database
  const sql = `DELETE FROM department WHERE id = ?`;
  const values = [department.id];
  const deparmentDeleted = results.department;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    console.log(`Department ${deparmentDeleted} deleted successfully!`);
  });
}

// Function Create a New Role
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
      choices: departmentsChoices.map((department) => department.name),
    },
  ]);
  //Save variable selected department by name
  const department = departmentsChoices.find(
    (department) => department.name === results.department
  );
  //Insert to Database
  const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`;
  const values = [results.title, results.salary, department.id];
  const roleCreated = results.title;
  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    console.log(`Role ${roleCreated} added successfully!`);
  });
}

// Function Delete selected role
async function deleteRole() {
  const roles = await getRoles();
  const roleChoices = roles.map((role) => ({
    name: role.title,
    value: role.id,
  }));

  const results = await inquirer.prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to delete?",
      choices: roleChoices,
    },
  ]);
  //Delete from Database
  const sql = `DELETE FROM role WHERE id = ?`;
  const values = [results.roleId];
  const roleDeleted = roles.find((role) => role.id === results.roleId).title;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    console.log(`Role ${roleDeleted} deleted successfully!`);
  });
}

// Function Add New Employee
async function createEmployee() {
  const employees = await getEmployees();
  const roles = await getRoles();
  const employeeChoices = employees.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
  employeeChoices.unshift({ name: 'None', value: null });

  const roleChoices = roles.map((role) => ({
    name: role.title,
    value: role.id,
  }));

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

  const newEmployee = {
    firstName: results.firstName,
    lastName: results.lastName,
    roleId: results.roleId,
  };
  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    console.log(
      `Employee ${newEmployee.firstName} ${newEmployee.lastName} added successfully!`
    );
  });
}

// Update an employee role
async function updateEmployeeRole() {
  const employees = await getEmployees();
  const roles = await getRoles();
  //Save to variable employee first
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

  const updatedEmployee = employees.find(
    (employee) => employee.id === results.employeeId
  );
  //Update Database
  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  const values = [results.roleId, results.employeeId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    //Updated employee saved
    console.log(
      `Employee ${updatedEmployee.first_name} ${updatedEmployee.last_name}role updated successfully!`
    );
  });
}

// Delete an employee from mysql
async function deleteEmployee() {
  const employees = await getEmployees();

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
// Get the updated employee's details
const deletedEmployee = employees.find(
  (employee) => employee.id === results.employeeId
);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("ERROR: %s", err.message);
      return;
    }
    console.log(`Employee ${deletedEmployee.first_name} ${deletedEmployee.last_name} deleted successfully!`);
  });
}

//Select All Employees function
async function getEmployees() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT  * FROM employee";
    db.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  }); 
}
//Select All Roles Function
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
//Select All Departsment function
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
