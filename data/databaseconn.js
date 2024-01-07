const sql = require("mysql2");
require("dotenv").config();
const port = process.env.PORT || 5011; // the port on which the server will start
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USER = process.env.DB_USER;
const Allowed_ip = process.env.ALLOWED_IP;
const Admins_ip = process.env.ADMINS_IP;
const Allowed_ips = JSON.parse(Allowed_ip);
const connection = sql.createConnection({
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
});

module.exports = {
	sql,
	port,
	Allowed_ip,
	Admins_ip,
	Allowed_ips,
	connection,
};
