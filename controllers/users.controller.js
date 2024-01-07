const getAllusers = ( req, res ) => // function to show all users from database
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

};

const login = ( req, res ) =>// login function
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
};