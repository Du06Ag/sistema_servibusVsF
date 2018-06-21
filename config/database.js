// configuracion de la base de datos
const mysql = require('mysql');
module.exports = mysql.createConnection({
	host: 'bwncddiiv-mysql.services.clever-cloud.com',
	user: 'uatpbisj2zqyrwbx',
	password: 'dGVhzaeo6Kv5nV5SY0j',
	database: 'bwncddiiv',
	port: 3306
});
