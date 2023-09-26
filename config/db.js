const mysql = require('mysql2/promise');
const mysqlPool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '12345678',
    database: 'MyDb',
})
mysqlPool.query("SELECT 1")
    .then(data => console.log('db connection successful'))
    .catch(error => console.log('db connection error' + error))

module.exports = {mysqlPool}