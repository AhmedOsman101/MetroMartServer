/* import Express */
const express = require( "express" );
const App = express();
App.use( express.json() );
/*database connection*/
const {port,Admins_ip, Allowed_ips,connection} = require( "./data/databaseconn" );





//////////////////////////////    validation functions		/////////////////////////////////
const { body, validationResult } = require( 'express-validator' );



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


App.post( "/user/signup",
	body( "name" ).notEmpty().withMessage( "name cannot be empty" ),
	body( "email" ).notEmpty().withMessage("email is required").isEmail(),
	body( "password" ).notEmpty().isStrongPassword().withMessage("weak password"),
	body( "address1" ).notEmpty().withMessage( "address cannot be empty" ).isString(),
	body( "phone_number" ).notEmpty().isMobilePhone().withMessage( "invalid phone_number" ),
	body( "gender" ).custom( ( value ) =>
	{
		if ( value !== "male" && value !== "female" )
		{
			throw new Error( "gender must be either 'male' or 'female'" );
		}
		return true;
	} ),
	body( "age" ).custom( ( value ) =>
	{
		if ( value < 18 )
		{
			throw new Error( "age must be at least 18" );
		}
		return true;
	} ),
	( req, res ) => //signup function
{
	if ( Allowed_ips.indexOf( req.ip ) !== -1 )
	{
		const errors = validationResult( req )
		if (errors.isEmpty()) {
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
					connection.execute( query,
						[ name, email, password, address1, address2 ? address2 : null, phone_number, gender, age ],
						( err, data ) =>
						{
							if (err) {
								res.send(err)
							} else
							{
								res.send( "sign up successfully" )
							}
						}
					)


				}
			} );
		} else{
			res.status(400).send(errors.array()[0]['msg'])
		}
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
