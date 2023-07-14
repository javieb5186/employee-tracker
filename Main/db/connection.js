// Import all packages
const mysql = require('mysql2');
require('dotenv').config();
const fs = require('fs');

// Used for any GET data from database
async function query(text) {
  let myPromise = new Promise(resolve => {
    const db = mysql.createConnection(
      {
        host: 'localhost',
        user: 'root',
        password: process.env.PASSWORD,
        database: 'employees'
      },
    );
    
    // Read specified sql file and return it as string
    const sqlQuery = fs.readFileSync(`./${text}.sql`).toString();
    
    // Do a query and return data to display
    db.promise().query(sqlQuery)
      .then(([rows,fields]) => resolve(displayData(rows)));

    // End connection
    db.end();
  });

  let data = await myPromise;
  return data;
}

// Create a specific format to display any GET data
function displayData(rows) {
  const arr = Object.keys(rows);
  const column = Object.keys(rows[0]);
  let str = '';
  let maxCharacters = [];

  str += '\n';

  // Determines what is the largest length for all column data and saves it
  for (let w = 0; w < column.length; w++) {
    let keyLength = column[w].length;
    let valueLength = 0;
    for (let x = 0; x < rows.length; x++) {
      let l = String(rows[x][column[w]]).length;
      if(l > valueLength) valueLength = l;
    }
    (valueLength > keyLength) ? maxCharacters.push(valueLength) : maxCharacters.push(keyLength);
  }

  // Columns names have spacing to match a specific format
  for (let x = 0; x < column.length; x++) {
    let name = column[x].length;
    let spaceCount = maxCharacters[x] - name;
    let spaces = '  ';
    for (let i = 0; i < spaceCount; i++) {
      spaces += ' ';
    }
    str += column[x] + spaces;
  }
  str += '\n';

  // Creates dashes to match max characters allowed
  for (let x = 0; x < column.length; x++) {
    let dash = '';
    for (let i = 0; i < maxCharacters[x]; i++) {
      dash += '-';
    }
    str += dash + '  ';
  } 
  str += '\n';

  // Create row data with spacing to match specific format
  for (let y = 0; y < arr.length; y++) {
    for (let z = 0; z < column.length; z++) {
      let value = String(rows[y][column[z]]).length;
      let count = maxCharacters[z] - value;
      let spaces = '  ';
      for (let i = 0; i < count; i++) {
        spaces += ' ';
      }
      str += rows[y][column[z]] + spaces;
    }
    str += '\n';
  }
  str += '\n';

  // Return final string
  return str;
}

// Inserts data into a database based on passed parameter
async function updateDatabase(object) {
  const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: process.env.PASSWORD,
      database: 'employees'
    },
    console.log(`\n Connected to database.`)
  );

  // Get key and values
  const keys = Object.keys(object);
  const values = Object.values(object);

  // Depending on first question, execute a specific function
  switch (keys[0]) {
    case 'departmentName':
      departmentToDatabase(values[0]);
      break;
    case 'roleName':
      roleToDatabase(values);
      break;
    case 'employeeFName':
      employeeToDatabase(values);
      break;
    case 'employeeRoleToUpdate':
      updateRoleToDatabase(values);
      break;
    default:
      break;
  }

  // Inserts a new department into the database
  function departmentToDatabase (val) {
    db.query(`INSERT INTO department (department_name) VALUES('${val}');`);
    db.end();
  }

  // Insert a new role into the database
  async function roleToDatabase(vals) {
    const v1 = vals[0];
    const v2 = vals[1];
    const v3 = vals[2];
    let departmentId;
    await db.promise().query(`SELECT department.id FROM department WHERE department_name='${v3}'`)
    .then((value) => departmentId = value);

    const id = departmentId[0][0].id;

    await db.promise().query(`INSERT INTO role (title, salary, department_id) VALUES(
          '${v1}',
          '${v2}',
          '${id}'
      );`);
    db.end();
  }

  // Insert new employee to database
  async function employeeToDatabase(vals) {
    const v1 = vals[0];
    const v2 = vals[1];
    const v3 = vals[2];
    const v4 = vals[3];

    let roleId;

    await db.promise().query(`SELECT role.id FROM role WHERE title='${v3}'`)
    .then((value) => roleId = value);

    const rId = roleId[0][0].id;

    let employeeId;
    let index = v4.indexOf(" ");
    let first = v4.slice(0, index);
    let last = v4.slice(index + 1, v4.length);

    await db.promise().query(`SELECT employee.id FROM employee WHERE first_name='${first}' AND last_name='${last}'`)
    .then((value) => employeeId = value);

    const eId = employeeId[0][0].id;

    await db.promise().query(`INSERT INTO employee ( first_name, last_name, role_id, manager_id ) VALUES(
        '${v1}',
        '${v2}',
        ${rId},
        ${eId}
      );`);
      db.end();
  }

  // Update employee role to database
  async function updateRoleToDatabase(vals) {
    const v1 = vals[0];
    const v2 = vals[1];

    let index = v1.indexOf(" ");
    let first = v1.slice(0, index);
    let last = v1.slice(index + 1, v1.length);

    let roleId;

    await db.promise().query(`SELECT * FROM role WHERE title='${v2}'`)
    .then((value) => roleId = value);

    const rId = roleId[0][0].id;

    await db.promise().query(`UPDATE employee SET role_id=${rId} WHERE first_name='${first}' AND last_name='${last}';`);
    db.end();
  }
}

// Returns specific raw data
async function getData(text) {
  let myPromise = new Promise(resolve => {
    const db = mysql.createConnection(
      {
        host: 'localhost',
        user: 'root',
        password: process.env.PASSWORD,
        database: 'employees'
      }
    );

    let sqlQuery;
    switch (text) {
      case 'departments':
        sqlQuery = 'SELECT * FROM department;';
        break;
      case 'roles':
        sqlQuery = 'SELECT * FROM role;';
        break;
      case 'employees':
        sqlQuery = 'SELECT * FROM employee;';
        break;
      case 'managers':
        sqlQuery = 'SELECT * FROM employee';
        break;
      default:
        break;
    }
    
    db.promise().query(sqlQuery)
    .then( ([rows,fields]) => resolve(rows));

    db.end();
  });

  let data = await myPromise;
  return data;
}

module.exports = {query, updateDatabase, getData};