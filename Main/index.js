const inquirer = require('inquirer');

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

const addDepartment = [
  {
    type: "input",
    message: "What is the name of the department? ",
    name: "departmentName"
  }
];

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
    type: "input",
    message: "Which department does this role belong to? ",
    name: "roleDepartment"
  }
];

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
    choices: [
      "Role1",
      "Role2",
      "Role3",
      "Role4",
      "Role5",
      "Role6",
      "Role7",
      "Role8"
    ]
  },
  {
    type: "list",
    message: "What is the employee's manager? ",
    name: "employeeManager",
    choices: [
      "Manager1",
      "Manager2",
      "Manager3",
      "Manager4",
      "Manager5",
      "Manager6",
      "Manager7",
      "Manager8"
    ]
  }
];

const updateEmployeeRole = [
  {
    type: "list",
    message: "Which employee's role you would like to update? ",
    name: "employeeRoleToUpdate",
    choices: [
      "Employee1",
      "Employee2",
      "Employee3",
      "Employee4",
      "Employee5",
      "Employee6",
      "Employee7",
      "Employee8"
    ]
  },
  {
    type: "list",
    message: "Which role do you want to assign the selected employee? ",
    name: "roleToApply",
    choices: [
      "Role1",
      "Role2",
      "Role3",
      "Role4",
      "Role5",
      "Role6",
      "Role7",
      "Role8"
    ]
  }
];

function prompt() {
  inquirer.prompt(commands)
  .then(answer => {
    console.log(answer);
    if(answer.command === 'Quit')
      console.log("Quit")
    else {
      switch (answer.command) {
        case 'Add Department':
          precedingQuestion(addDepartment, 1);
          break;
        case 'Add Role':
          precedingQuestion(addRole, 1);
          break;
        case 'Add Employee':
          precedingQuestion(addEmployee, 2);
          break;
        case 'Update Employee Role':
          precedingQuestion(updateEmployeeRole, 1);
          break;
        case 'View All Employees':
          displayData();
          break;
        case 'View All Roles':
          displayData();
          break;
        case 'View All Departments':
          displayData();
          break;
        default:
          break;
      }
    }
  });
}

function displayData() {
  console.log("Displaying Data");
  prompt();
}

function precedingQuestion(questions, indexes) {
  inquirer.prompt(questions)
  .then(answer => {
    const a = Object.values(answer);
    const logArray = [];
    for (let i = 0; i < indexes; i++)
      logArray.push(a[i]);
    const str = logArray.join(" ");
    console.log(`Updated ${str} to the database`);
    prompt();
  });
}

prompt();