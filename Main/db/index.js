const inquirer = require('inquirer');
const {query, updateDatabase, getData} = require('./connection');
const departments = [];
const roles = [];
const employees = [];
const managers = [];
updateQuestions().then(() => prompt());

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
    type: "list",
    message: "Which department does this role belong to? ",
    name: "roleDepartment",
    choices: departments
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
    choices: roles
  },
  {
    type: "list",
    message: "What is the employee's manager? ",
    name: "employeeManager",
    choices: managers
  }
];

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

function prompt() {
  inquirer.prompt(commands)
  .then(answer => {
    if(answer.command === 'Quit')
      console.log("Quitting")
    else {
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
          precedingQuestion(updateEmployeeRole, 1);
          updateQuestions();
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

function displayData(text) {
  query(text).then(value => console.log(value)).then(() => prompt());
}

async function updateQuestions() {
  await getData('departments').then(val => {
    val.forEach(element => {
      departments.push(element.department_name);
    });
  })

  await getData('roles').then(val => {
    val.forEach(element => {
      roles.push(element.title);
    });
  })

  await getData('managers').then(val => {
    val.forEach(element => {
      managers.push(element.first_name + " " + element.last_name);
    });
  })

  await getData('employees').then(val => {
    val.forEach(element => {
      employees.push(element.first_name + " " + element.last_name);
    });
  })
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
    console.log(a);
    updateDatabase(answer);
  })
  .then(() => prompt());
}