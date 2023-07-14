// Import required files/packages
const inquirer = require('inquirer');
const {query, updateDatabase, getData} = require('./connection');

// Initialize arrays for a session
const departments = [];
const roles = [];
const employees = [];
const managers = [];

// Populate the session arrays and begin prompt
updateQuestions().then(() => prompt());

// List of commands for prompt
const commands = [
  {
    type: "list",
    message: "What would you like to do? ",
    name: "command",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit"
    ]
  }
];

// Add what new department question
const addDepartment = [
  {
    type: "input",
    message: "What is the name of the department? ",
    name: "departmentName"
  }
];

// Add what new role questions
const addRole = [
  {
    type: "input",
    message: "What is the name of the role? ",
    name: "roleName"
  },
  {
    type: "input",
    message: "What is the salary of the role? ",
    name: "roleSalary"
  },
  {
    type: "list",
    message: "Which department does this role belong to? ",
    name: "roleDepartment",
    choices: departments
  }
];

// Add who question
const addEmployee = [
  {
    type: "input",
    message: "What is the employee's first name? ",
    name: "employeeFName"
  },
  {
    type: "input",
    message: "What is the employee's last name? ",
    name: "employeeLName"
  },
  {
    type: "list",
    message: "What is the employee's role? ",
    name: "employeeRole",
    choices: roles
  },
  {
    type: "list",
    message: "What is the employee's manager? ",
    name: "employeeManager",
    choices: managers
  }
];

// Change what role for whom
const updateEmployeeRole = [
  {
    type: "list",
    message: "Which employee's role you would like to update? ",
    name: "employeeRoleToUpdate",
    choices: employees
  },
  {
    type: "list",
    message: "Which role do you want to assign the selected employee? ",
    name: "roleToApply",
    choices: roles
  }
];

// The beginning of a endless cycle of prompting questions
function prompt() {
  // Always prompt commands
  inquirer.prompt(commands)
  .then(answer => {
    // If command is Quit, end the cycle by exiting the cycle
    if(answer.command === 'Quit')
      console.log("Quitting")
    else {
      // Depending on command selecting, execute associated block
      switch (answer.command) {
        case 'Add Department':
          precedingQuestion(addDepartment, 1);
          updateQuestions();
          break;
        case 'Add Role':
          precedingQuestion(addRole, 1);
          updateQuestions();
          break;
        case 'Add Employee':
          precedingQuestion(addEmployee, 2);
          updateQuestions();
          break;
        case 'Update Employee Role':
          updateQuestions().then(() => {
            precedingQuestion(updateEmployeeRole, 1);
          });
          break;
        case 'View All Employees':
          displayData('showEmployees');
          break;
        case 'View All Roles':
          displayData('showRoles');
          break;
        case 'View All Departments':
          displayData('showDepartments');
          break;
        default:
          break;
      }
    }
  })
}

// Gets specific data, display it via the console, and go back to prompt, continuing the cycle.
function displayData(text) {
  query(text).then(value => console.log(value)).then(() => prompt());
}

// Used to get new data from database to populate session arrays with new data
async function updateQuestions() {
  // Get departments data and push all departments to an array
  await getData('departments').then(val => {
    val.forEach(element => {
      departments.push(element.department_name);
    });
  })

  // Get roles data and push all roles to an array
  await getData('roles').then(val => {
    val.forEach(element => {
      roles.push(element.title);
    });
  })

  // Get managers data and push all managers to an array
  await getData('managers').then(val => {
    val.forEach(element => {
      managers.push(element.first_name + " " + element.last_name);
    });
  })

  // Get employees data and push all employees to an array
  await getData('employees').then(val => {
    val.forEach(element => {
      employees.push(element.first_name + " " + element.last_name);
    });
  })
}

// Ask the related question(s), display a text, update database, and go back to prompt, continuing the cycle. 
function precedingQuestion(questions, index) {
  inquirer.prompt(questions)
  .then(answer => {
    // Display text that can join answers if specified by index.
    const a = Object.values(answer);
    const logArray = [];
    for (let i = 0; i < index; i++)
      logArray.push(a[i]);
    const str = logArray.join(" ");
    console.log(`Updated ${str} to the database`);

    // Send answer for processing.
    updateDatabase(answer);
  })
  .then(() => prompt());
}