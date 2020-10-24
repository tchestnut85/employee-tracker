const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'poplar',
    database: 'company'
});

connection.connect(err => {
    if (err) throw err;
    console.log(`Employee Tracker App on ID ${connection.threadId}\n`);
    startApp();
});

startApp = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'querySelect',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Exit App']
        }
    ])
        .then((response) => {
            switch (response.querySelect) {
                case 'View All Departments':
                    viewDepartments();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add a Department':
                    addDept();
                    break;
                case 'Add a Role':
                    addRole();
                    break;
                case 'Add an Employee':
                    addEmployee();
                    break;
                case 'Update an Employee':
                    updateEmployee();
                    break;
                case 'Exit the App':
                    connection.end();
            }
        });
};

viewDepartments = () => {
    console.log('Displaying all departments. \n');
    connection.query('SELECT * FROM departments;', function (err, res) {
        if (err) throw err;
        console.table(res);
        startApp();
    });
};

viewRoles = () => {
    console.log('Displaying all employee roles. \n');
    connection.query(`SELECT roles.id AS Role_ID, roles.title AS Title, roles.salary, departments.name AS department_name
                    FROM roles
                    LEFT JOIN departments 
                    ON roles.department_id = departments.id;`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            startApp();
        });
};

viewEmployees = () => {
    console.log('Displaying all employee information. \n');
    connection.query(`
                SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS Dept_Name
                FROM employees RIGHT JOIN roles ON employees.role_id = roles.id RIGHT JOIN departments ON roles.department_id = departments.id;`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            startApp();
        });
};;

// exit the app NOT WORKING ???
// exitApp = () => connection.end();