/* eslint-disable no-undef */
const express = require("express");
const sql = require("mysql2");
// const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 5011; // the port on which the server will start
// first method (with require):
require("dotenv").config();

// print the values:
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USER = process.env.DB_USER;
const Allowed_ip = process.env.ALLOWED_IP;

const Allowed_ips = JSON.parse( Allowed_ip );

const App = express(); // Create a new Express application
App.use(express.json()); // Use express.json() middleware for parsing JSON data of incoming requests
App.use(cors());
const connection = sql.createConnection({
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
});





// Show all users
App.get( "/", ( req, res ) =>
{
	if (Allowed_ips.indexOf(req.ip)!== -1) {
		const query = "SELECT * FROM `users`";
		connection.execute( query, ( err, data ) =>
		{
			if ( err ) res.send( `ERROR: ${ err }` );
			else res.json( data );
		} );
	} else{
		res.status( 401 ).send("authentication refused")
	}
	
});

// select specific user to show
App.post( "/login", ( req, res ) =>
{
	if ( Allowed_ips.indexOf( req.ip ) !== -1 )
	{
		const { email, password } = req.body;
		const values = [ email, password ];
		let query = "SELECT email FROM `users` WHERE `email` = ?";
		connection.execute( query, [ email ], ( err, data ) =>
		{
			if ( err ) res.send( `ERROR: ${ err }` );
			else if ( 0 == data.length ) res.send( "ERROR: this mail doesn't exist" );
			else
			{
				res.send( "login successfully" );
			}
		} );
	} else
	{
		res.status( 401 ).send( "authentication refused" );
	}
	
});

// Handle POST requests to add users
App.post( "/User/Add", ( req, res ) =>
{
	if ( Allowed_ips.indexOf( req.ip ) !== -1 )
	{
		const { email, password } = req.body;
		const values = [ email, password ];
		let query = "SELECT email FROM `users` WHERE `email` = ?";
		connection.execute( query, [ email ], ( err, data ) =>
		{
			if ( err ) res.send( `ERROR: ${ err }` );
			else if ( 0 < data.length ) res.send( "ERROR: this mail exists" );
			else
			{
				query =
					"INSERT INTO `users`(`username`, `email`, `password`) VALUES (?, ?, ?)";
				connection.execute( query, values, ( err ) =>
				{
					if ( err ) res.send( `ERROR: ${ err }` );
					else
					{
						connection.execute( "SELECT * FROM `users`", ( err, data ) =>
						{
							if ( err ) res.send( `ERROR: ${ err }` );
							else res.send( data );
						} );
					}
				} );
			}
		} );
	} else
	{
		res.status( 401 ).send( "authentication refused" );
	}
	
});

// Handle DELETE requests to remove users
App.delete( "/User/Delete/:id", ( req, res ) =>
{
	if ( Allowed_ips.indexOf( req.ip ) !== -1 )
	{
		const userID = req.params.id;
		const query = "DELETE FROM `users` WHERE id = ?";
		connection.execute( query, [ userID ], ( err, data ) =>
		{
			if ( err ) res.send( `ERROR: ${ err }` );
			else if ( data.affectedRows === 0 )
				res.send( "ERROR: USER WAS NOT FOUND !!!" );
			else res.send( "USER DELETED SUCCESSFULLY" );
		} );
	} else
	{
		res.status( 401 ).send( "authentication refused" );
	}

});

// Handle PUT requests to update users
App.put( "/User/Update/:id", ( req, res ) =>
{
	if ( Allowed_ips.indexOf( req.ip ) !== -1 )
	{
		const userID = req.params.id;
		const { username, email, password } = req.body;
		const values = [ username, email, password, userID ];
		const query =
			"UPDATE `users` SET `username` = ?, `email` = ?, `password` = ? WHERE `id` = ?";
		connection.execute( query, values, ( err, data ) =>
		{
			if ( err ) res.send( `ERROR: ${ err }` );
			else if ( data.affectedRows === 0 )
				res.send( "ERROR: USER WAS NOT FOUND !!!" );
			else res.send( "USER UPDATED SUCCESSFULLY" );
		} );
	} else
	{
		res.status( 401 ).send( "authentication refused" );
	}
	
});

// handle any other requests
App.use((req, res) => {
	res.end("ERROR-404 Page Was Not Found"); // Send back an error message as a response
});

// Start the server and have it listen on the specified port
App.listen(port, () => {
	console.log( `Server is running on http://localhost:${ port }` );
});
