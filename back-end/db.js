import mysql from "mysql2/promise";

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

const dbPool = mysql.createPool({
	connectionLimit: 10,
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASS,
	database: DB_NAME,
	dateStrings: true,
	timezone: "+07:00"
});

export default dbPool;
