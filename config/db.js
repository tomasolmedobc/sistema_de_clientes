const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'usuarios_db',
    password: '',
    port: 3340,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    pool
};



/*
const mysql = require('mysql2');
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     port: process.env.DB_PORT
// });

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'usuarios_db',
    password: '',
    port: 3340
});

connection.connect((error) => {
    if (error) {
        console.error('Error al conectar a la base de datos:', error.message);
        return;
    }
    console.log('Conectado a la base de datos! Usuario!');
});

module.exports = connection;

*/