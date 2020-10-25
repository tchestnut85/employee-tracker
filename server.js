const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const names = [];

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
    welcomePrompt();
});

// Welcome function
welcomePrompt = () => {
    console.log(
        '------------------------------------------- \n Welcome to the Employee Tracker app! \n------------------------------------------- \n');
    startApp();
};

// Begin inquirer prompts
startApp = () => {
    inquirer.prompt({
        type: 'list',
        name: 'querySelect',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Exit App']
    })
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
                case 'Update an Employee Role':
                    updateEmployee();
                    break;
                // case 'Delete an Employee':
                //     deleteEmployee();
                //     break;
                case 'Exit the App':
                    exitApp();
                    break;
                // connection.end();
            }
        });
};

// View all departments
viewDepartments = () => {
    console.log('Displaying all departments. \n');
    connection.query('SELECT * FROM departments;', function (err, res) {
        if (err) throw err;
        console.table(res);
        startApp();
    });
};

// View all roles/positions
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

// View all employees
viewEmployees = () => {
    console.log('Displaying all employee information. \n');
    connection.query(`
            SELECT employees.id, employees.first_name, employees.last_name, roles.title,
                roles.salary, departments.name AS Dept_Name, employees.manager_id AS Manager
            FROM employees
            RIGHT JOIN roles ON employees.role_id = roles.id
            RIGHT JOIN departments ON roles.department_id = departments.id
            ORDER BY employees.id;`,

        function (err, res) {
            if (err) throw err;
            console.table(res);
            startApp();
        });
};

// Add a new department
addDept = () => {
    inquirer.prompt({
        type: 'input',
        name: 'deptName',
        message: 'What department do you want to add?'
    })
        .then(response => {
            connection.query(
                `INSERT INTO departments SET ? `,
                {
                    name: response.deptName
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n ${response.deptName} department added! \n Here is the updated department list: \n`);
                    viewDepartments();
                }
            );
            startApp();
        });
};

// Add a new role/position
addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'What is the name of the position?'
        },
        {
            type: 'number',
            name: 'salary',
            message: "What is this position's salary?"
        },
        {
            type: 'number',
            name: 'dept',
            message: 'Which Department ID is this position in?'
        }
    ])
        .then(response => {
            console.log(response);
            connection.query(`INSERT INTO roles SET ? `,
                {
                    title: response.roleName,
                    salary: response.salary,
                    department_id: response.dept
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`========== \n ${response.roleName} role added! \n ========== \n Here is the updated role list: \n`);
                    viewRoles();
                }
            );
            startApp();
        });
};;

// Add a new employee
addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'empFirstName',
            message: 'What is the first name of the new employee?'
        },
        {
            type: 'input',
            name: 'empLastName',
            message: 'What is the last name of the new employee?'
        },
        {
            type: 'number',
            name: 'empRole',
            message: 'Input the ID number of the role for the new employee: \n 1: EHS Associate \n 3: Research Scientist \n 5: Process Scientist \n 7: Ops Associate \n 9: Salesperson \n'
        },
        {
            type: 'number',
            name: 'empManager',
            message: 'Enter the ID number of the manager for the new employee: \n 3: Ginadura Belvani \n 6: Ekhi Bjadsen \n 9: Sulesa Melarg \n 12: Rianis River \n 15: Gandela Saram \n'
        }
    ])
        .then((response) => {
            connection.query(`INSERT INTO employees SET ?`,
                {
                    first_name: response.empFirstName,
                    last_name: response.empLastName,
                    role_id: response.empRole,
                    manager_id: response.empManager
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n ${response.empFirstName} ${response.empLastName} added! \n Here is the updated employee list: \n`);
                    viewEmployees();
                }
            );
            startApp();
        });
};

// Update an employee's role
updateEmployee = () => {
    connection.query(`SELECT CONCAT(employees.first_name, " ", employees.last_name) AS Employee_Name FROM employees;`,
        function (err, res) {
            if (err) throw err;

            for (let i = 0; i < res.length; i++) {
                let name = res[i].Employee_Name;
                names.push(name);
            }

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectedEmp',
                    message: 'Which employee do you want to update a role for?',
                    choices: names
                }
            ])
                .then((response) => {
                    let selectedEmp = response;

                    inquirer.prompt({
                        type: 'input',
                        name: 'empRoleUpdate',
                        message: `What is the new role for this employee?`
                    })
                        .then(
                            connection.query(`UPDATE employees SET role_id VALUES ? WHERE CONCAT(employees.first_name, " ", employees.last_name) = ${selectedEmp}; `,
                                {
                                    role_id: response.empRole
                                },
                                (err, res) => {
                                    if (err) throw err;
                                    console.log(`\n ${selectedEmp} 's role updated! \n`);;
                                },
                                startApp()
                            )
                        );
                });
        });
};

// Delete an employee - optional
// deleteEmployee = () => {
//     connection.query(`SELECT id, first_name, last_name FROM employees;`,
//         (err, res) => {
//             if (err) throw err;
//             console.table(res);
//         })
//         .then(
//             inquirer.prompt([
//                 {
//                     type: 'number',
//                     name: 'deleteEmp',
//                     message: 'Input the ID of the employee listed above that you want to delete. \n'
//                 }
//             ]))
//         .then((deleteEmp) => {
//             connection.query(`DELETE FROM employees WHERE ?;`,
//                 {
//                     id: deleteEmp.id
//                 },
//                 (err, res) => {
//                     if (err) throw err;
//                     console.log(`\n ========== Employee deleted! ========== \n`);
//                 }
//             );
//             startApp();
//         });
// };

// exit the app
exitApp = () => connection.end();