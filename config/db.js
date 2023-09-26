const mysql = require('mysql2/promise');
const mysqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})
mysqlPool.query("SELECT 1")
    .then(data => console.log('db connection successful'))
    .catch(error => console.log('db connection error' + error))

module.exports = {mysqlPool}