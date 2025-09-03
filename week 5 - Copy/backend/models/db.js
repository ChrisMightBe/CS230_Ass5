const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: "webcourse.cs.nuim.ie",
    user: "u230733",
    password: "ahS5OghooGeighae",
    database: "cs230_u230733"
});

module.exports = pool;