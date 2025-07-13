import dotEnv from "dotenv"
dotEnv.config()
import mysql from "mysql2"
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: "3306",
    timezone: "Z"
});

export default pool.promise();
