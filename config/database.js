// configuracion de la base de datos
const mysql = require('mysql');
module.exports = mysql.createConnection({
	host: 'node15846-servibus-guerrero.mj.milesweb.cloud',
	user: 'root',
	password: 'MORrnd84812',
	database: 'servibus',
	port: 3306
});
