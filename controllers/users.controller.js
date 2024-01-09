/*database connection*/
const { port, Admins_ip, Allowed_ips, connection } = require( "../data/databaseconn" );
const { validationResult } = require( 'express-validator' );

const getAllusers = ( req, res ) => // function to show all users from database
{
    if ( Admins_ip.indexOf( req.ip ) !== -1 )
    {
        console.log(req.ip)
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
}

const login = (
	req,
	res // login function
) => {
	if (Allowed_ips.indexOf(req.ip) !== -1) {
		const { email, password } = req.body;

        let query = "SELECT * FROM `users` WHERE `email` = ?";
        connection.execute( query, [ email ], ( err, data ) =>
        {
            if ( err ) res.send( `ERROR: ${ err }` );
            else if ( data.length == 0 ) res.send( "ERROR: this mail doesn't exist" );
            else
            {
                if ( data[ 0 ][ "password" ] === password )
                {
                    res.status(200).send( data );
                }
                else
                {
                    res.status( 400 ).send( "wrong password" );
                }
            }
        } );
    } else
    {
        res.status( 401 ).send( "authentication refused" );
    }
};

const signup = (
	req,
	res //signup function
) => {
	if (Allowed_ips.indexOf(req.ip) !== -1) {
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			const {
				name,
				email,
				password,
				address1,
				address2,
				phone_number,
				gender,
				age,
			} = req.body;

            let query = "SELECT email FROM `users` WHERE `email` = ?";
            connection.execute( query, [ email ], ( err, data ) =>
            {
                if ( err ) res.send( `ERROR: ${ err }` );
                else if ( data.length != 0 ) res.send( "ERROR: this email is exists" );
                else
                {
                    query =
                        "INSERT INTO `users`(`name`, `email`, `password`, `address1`, `address2`, `phone_number`,`gender`, `age`) VALUES (?,?,?,?,?,?,?,?)";
                    connection.execute( query,
                        [ name, email, password, address1, address2 ? address2 : null, phone_number, gender, age ],
                        ( err, data ) =>
                        {
                            if ( err )
                            {
                                res.send( err );
                            } else
                            {
                                res.status(200).send( "sign up successfully" );
                            }
                        }
                    );


                }
            } );
        } else
        {
            res.status( 400 ).send( errors.array()[ 0 ][ 'msg' ] );
        }
    } else
    {
        res.status( 401 ).send( "authentication refused" );
    }
};

const deleteAccount = (req, res) => {
	if (Allowed_ips.indexOf(req.ip) !== -1) {
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
                    query = "DELETE FROM `users` WHERE email = ?";
                    connection.execute( query, [ email ], ( err, data ) =>
                    {
                        if ( err ) res.end( "Error" + err );
                        else res.status(200).send( "account deleted successfully" );
                    } );
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
};

const updateAccount = (req, res) => {
	if (Allowed_ips.indexOf(req.ip) !== -1) {
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			const {
				name,
				email,
				password,
				address1,
				address2,
				phone_number,
				gender,
				age,
			} = req.body;

            let query = "SELECT email FROM `users` WHERE `email` = ?";
            connection.execute( query, [ email ], ( err, data ) =>
            {
                if ( err ) res.send( `ERROR: ${ err }` );
                else if ( data.length == 0 ) res.send( "ERROR: this email is not exists" );
                else
                {
                    query =
                        "UPDATE `users` SET `name`=?,`email`=?,`password`=?,`address1`=?,`address2`=?,`phone_number`=?,`gender`=?,`age`= ? WHERE email = ?";
                    connection.execute( query,
                        [ name, email, password, address1, address2 ? address2 : null, phone_number, gender, age, email ],
                        ( err, data ) =>
                        {
                            if ( err )
                            {
                                res.send( err );
                            } else
                            {
                                res.status( 200 ).send( "update account successfully" );
                            }
                        }
                    );


                }
            } );
        } else
        {
            res.status( 400 ).send( errors.array()[ 0 ][ 'msg' ] );
        }
    } else
    {
        res.status( 401 ).send( "authentication refused" );
    }
};

module.exports = {
	getAllusers,
	login,
	signup,
	deleteAccount,
	updateAccount,
};
