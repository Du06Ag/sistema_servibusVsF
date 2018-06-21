// configuracion de la base de datos
const mysql = require('mysql');
module.exports = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: 'duky',
	database: 'servibus_final_db',
	port: 3306
});
