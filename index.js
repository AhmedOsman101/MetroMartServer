/* eslint-disable no-undef */
const express = require( "express" );
const sql = require( "mysql2" );
// const bodyParser = require("body-parser");
const cors = require( "cors" );
const port = process.env.PORT || 5011; // the port on which the server will start
// first method (with require):
require( "dotenv" ).config();
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USER = process.env.DB_USER;
const Allowed_ip = process.env.ALLOWED_IP;
const Admins_ip = process.env.ADMINS_IP;

const Allowed_ips = JSON.parse( Allowed_ip );

const App = express(); // Create a new Express application
App.use( express.json() ); // Use express.json() middleware for parsing JSON data of incoming requests
App.use( cors() );
const connection = sql.createConnection( {
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
} );

//////////////////////////////    validation functions		/////////////////////////////////
const validateEmail = ( email ) =>
{
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test( email );
};

const validatePassword = ( password ) =>
{
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	return passwordRegex.test( password );
};

const validateEgyptianPhoneNumber = ( phoneNumber ) =>
{
	const egyptianPhoneNumberRegex = /^(?:(?:\+?20)|0)?(10|11|12|15)([0-9]{8})$/;
	return egyptianPhoneNumberRegex.test( phoneNumber );
};




///////////////////////////////    Users functions    ///////////////////////////////////
App.get( "/", ( req, res ) => // function to show all users from database
{
	if ( Admins_ip.indexOf( req.ip ) !== -1 )
	{
		const query = "SELECT * FROM `users`";
		connection.execute( query, ( err, data ) =>
		{
			if ( err ) res.send( `ERROR: ${ err }` );
			else res.json( data );
		} );
	} else
	{
		res.status( 401 ).send( "authentication refused" );
	}

} );


App.post( "/user/login", ( req, res ) =>// login function
{
	if ( Allowed_ips.indexOf( req.ip ) !== -1 )
	{
		const { email, password } = req.body;
		
		let query = "SELECT email , password FROM `users` WHERE `email` = ?";
		connection.execute( query, [ email ], ( err, data ) =>
		{
			if ( err ) res.send( `ERROR: ${ err }` );
			else if ( data.length == 0 ) res.send( "ERROR: this mail doesn't exist" );
			else
			{
				if ( data[ 0 ][ "password" ] === password )
				{
					res.send( "login successully" );
				}
				else
				{
					res.send( "wrong password" );
				}
			}
		} );
	} else
	{
		res.status( 401 ).send( "authentication refused" );
	}
} );


App.post( "/user/signup", ( req, res ) => //signup function
{
	if ( Allowed_ips.indexOf( req.ip ) !== -1 )
	{
		const { name, email, password, address1, address2, phone_number, gender, age } = req.body;

		let query = "SELECT email FROM `users` WHERE `email` = ?";
		connection.execute( query, [ email ], ( err, data ) =>
		{
			if ( err ) res.send( `ERROR: ${ err }` );
			else if ( data.length != 0 ) res.send( "ERROR: this email exists" );
			else
			{
				query =
					"INSERT INTO `users`(`name`, `email`, `password`, `address1`, `address2`, `phone_number`,`gender`, `age`) VALUES (?,?,?,?,?,?,?,?)";

						if (validateEmail(email)) {
							if (validatePassword(password)) {
								if ( validateEgyptianPhoneNumber( phone_number ) )
								{
									
									connection.execute(
										query,
										[ name, email, password, address1, address2, phone_number, gender, age ],
										( err, data ) =>
										{
											if ( err ) res.send( `ERROR: ${ err }` );
											else res.send( "user added successfully" );
										}
									);
								} else
								{
									res.send( "invalid phone number" )
								}
							} else
							{
								res.send("invalid password structure")
							}
						}
						else{
							res.send("invalid email structure")
						}
					
				
			}
		} );
	} else
	{
		res.status( 401 ).send( "authentication refused" );
	}
} );





// Handle DELETE requests to remove users
App.delete( "/user/deleteaccount", ( req, res ) =>
{
	if ( Allowed_ips.indexOf( req.ip ) !== -1 )
	{
		const { email, password } = req.body;

		let query = "SELECT email , password FROM `users` WHERE `email` = ?";
		connection.execute( query, [ email ], ( err, data ) =>
		{
			if ( err ) res.send( `ERROR: ${ err }` );
			else if ( data.length == 0 ) res.send( "ERROR: this mail doesn't exist" );
			else
			{
				if ( data[ 0 ][ "password" ] === password )
				{
					query = "DELETE FROM `users` WHERE email = ?"
					connection.execute( query, [ email ], ( err, data ) =>
					{
						if ( err ) res.end( "Error" + err )
						else res.end("account deleted successfully")
					})
				}
				else
				{
					res.send( "wrong password" );
				}
			}
		} );
	} else
	{
		res.status( 401 ).send( "authentication refused" );
	}
} );


// Handle PUT requests to update users
App.put( "/user/updateaccount/:id", ( req, res ) =>
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
} );

// handle any other requests
App.use( ( req, res ) =>
{
	res.end( "ERROR-404 Page Was Not Found" ); // Send back an error message as a response
} );

///////////////////////////    USERS end   ///////////////////////////////////////////////////










// Start the server and have it listen on the specified port
App.listen( port, () =>
{
	console.log( `Server is running on http://localhost:${ port }` );
} );
