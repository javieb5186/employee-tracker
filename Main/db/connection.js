const mysql = require('mysql2');
require('dotenv').config();
const fs = require('fs');
const { resolve } = require('path');

async function query(text) {
  let myPromise = new Promise(resolve => {
    const db = mysql.createConnection(
      {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: process.env.PASSWORD,
        database: 'employees'
      },
    );
    
    const sqlQuery = fs.readFileSync(`./${text}.sql`).toString();
    
    db.promise().query(sqlQuery)
    .then( ([rows,fields]) => {
      // Work on displaying output as same as in the videos here
      resolve(displayData(rows));
    });
    db.end();
  });

  let data = await myPromise;
  return data;
}

function displayData(rows) {
  const arr = Object.keys(rows);
  const column = Object.keys(rows[0]);
  let str = '';
  let maxCharacters = [];

  str += '\n';
  for (let w = 0; w < column.length; w++) {
    let keyLength = column[w].length;
    let valueLength = 0;
    for (let x = 0; x < rows.length; x++) {
      let l = String(rows[x][column[w]]).length;
      if(l > valueLength)
        valueLength = l;
    }
    if(valueLength > keyLength)
      maxCharacters.push(valueLength);
    else
      maxCharacters.push(keyLength);
  }

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

  for (let x = 0; x < column.length; x++) {
    let dash = '';
    for (let i = 0; i < maxCharacters[x]; i++) {
      dash += '-';
    }
    str += dash + '  ';
  } 
  str += '\n';

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

  return str;
}

async function updateDatabase(object) {
  const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: process.env.PASSWORD,
      database: 'employees'
    },
    console.log(`\n Connected to database.`)
  );

  const keys = Object.keys(object);
  const values = Object.values(object);
  console.log("Keys are: " + keys[0]);
  console.log("Values are: " + values);

  switch (keys[0]) {
    case 'departmentName':
      departmentToDatabase(values[0]);
      break;
    case 'roleName':
      console.log("Values are: " + values[0] + " " + values[1] + " " + values[2]);
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

  function departmentToDatabase (val) {
    db.query(`INSERT INTO department (department_name)
      VALUES(
        '${val}'
      );`
    )
    db.end();
  }

  async function roleToDatabase(vals) {
    const v1 = vals[0];
    const v2 = vals[1];
    const v3 = vals[2];
    let departmentId;
    await db.promise().query(`SELECT department.id FROM department WHERE department_name='${v3}'`)
    .then((value) => departmentId = value);

    const id = departmentId[0][0].id;

    await db.promise().query(`INSERT INTO role (title, salary, department_id) 
      VALUES(
          '${v1}',
          '${v2}',
          '${id}'
      );`);
      db.end();
  }

  async function employeeToDatabase(vals) {
    console.log(vals);
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

  async function updateRoleToDatabase(vals) {
    const v1 = vals[0];
    const v2 = vals[1];

    let index = v1.indexOf(" ");
    let first = v1.slice(0, index);
    let last = v1.slice(index + 1, v1.length);
    console.log(first + " asdfa " + last);

    let roleId;

    await db.promise().query(`SELECT * FROM role WHERE title='${v2}'`)
    .then((value) => roleId = value);

    const rId = roleId[0][0].id;
    console.log(rId);

    await db.promise().query(`UPDATE employee SET role_id=${rId} WHERE first_name='${first}' AND last_name='${last}';`);
    db.end();
  }
}

async function getData(text) {
  let myPromise = new Promise(resolve => {
    const db = mysql.createConnection(
      {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: process.env.PASSWORD,
        database: 'employees'
      },
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
        sqlQuery = 'SELECT * FROM employee WHERE manager_id IS NULL;';
        break;
      default:
        break;
    }
    
    db.promise().query(sqlQuery)
    .then( ([rows,fields]) => {
      // Work on displaying output as same as in the videos here
      resolve(rows);
    });
    db.end();
  });

  let data = await myPromise;
  return data;
}

module.exports = {query, updateDatabase, getData};