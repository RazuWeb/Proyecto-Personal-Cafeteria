const mysql2 = require('mysql')

let connection = mysql2.createConnection({
    host: process.env.DB_SERVER || 'localhost',
    user:       process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'coffeandpastries',
})

connection.connect();

module.exports = connection;