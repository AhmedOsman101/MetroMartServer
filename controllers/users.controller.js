/*database connection*/
const { Admins_ip, Allowed_ips, connection, sequelize } = require( "../data/dbconn" );
const { validationResult } = require( 'express-validator' );
const httpStatusText = require( "../utils/httpStatustext" );
const User = require( '../models/users' );
const bcrypt = require( 'bcryptjs' );

const getAllusers = async ( req, res ) => // function to show all users from database
{
    if ( Admins_ip.indexOf( req.ip ) !== -1 )
    {
        try
        {
            const users = await User.findAll();
            res.status( 200 ).send( { status: httpStatusText.SUCCESS, data: users } );
        } catch ( error )
        {
            res.status( 400 ).send( { status: httpStatusText.FAIL, data: null , msg :error  } );
        }

    } else
    {
        res.status( 401 ).send( { status: httpStatusText.FAIL, data: { "data": "authentication refused" } } );
    }

// function to show all users from database
const getAllusers = (req, res) => {
	if (Admins_ip.indexOf(req.ip) !== -1) {
		console.log(req.ip);
		const query = "SELECT * FROM `users`";
		connection.query(query, (err, data) => {
			if (err) res.send(`ERROR: ${err}`);
			else res.json(data);
		});
	} else {
		res.status(401).send("authentication refused");
	}
};

const login = async ( req, res ) =>// login function
{
    if ( Allowed_ips.indexOf( req.ip ) !== -1 )
    {
        const { email, password } = req.body;
        try {
            user = await User.findAll( {
                where: {
                    email: email
                }
            } );
            if ( user.length > 0 )
            {
                if ( user[ 0 ].password == password )
                {
                    res.status( 200 ).send( { status: httpStatusText.SUCCESS, data: user[ 0 ] } );
                } else
                {
                    res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: 'wrong password' } );
                }
            } else
            {
                res.status( 404 ).send( { status: httpStatusText.FAIL, data: null , msg : "email doesn't exists" }   );
            }
        } catch (error) {
            res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: error.errors[ 0 ].message })
        }
        
    } else
    {
        res.status( 401 ).send( { status: httpStatusText.FAIL, data: null, msg: "authentication refused" } ); 
    }
};


const signup = async ( req, res ) => //signup function
{
    if ( Allowed_ips.indexOf( req.ip ) !== -1 )
    {
        const errors = validationResult( req );
        if ( errors.isEmpty() )
        {
            const { name, email, password, address1, address2, phone_number, gender, age } = req.body;
            const newUser = User.build( {
                'name': name,
                'email': email,
                'password': await bcrypt.hash(password,10),
                'address1': address1,
                'address2': address2 ? address2 : null,
                'phone_number': phone_number,
                'gender': gender,
                'age': age
            } );
            
            try
            {
                await newUser.save();
                res.status( 201 ).send( { status: httpStatusText.SUCCESS, data: newUser } );
            } catch ( error )
            {
                res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: error.errors[ 0 ].message } );
            }
        } else
        {
            res.status( 400 ).send( { status: httpStatusText.Fail, data: null, msg : errors.array()[ 0 ][ 'msg' ] } );
        }
    } else
    {
        res.status( 401 ).send( res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: "authentication refused" } ) );
    }
};


const deleteAccount = async( req, res ) => // delete function
{
    if ( Allowed_ips.indexOf( req.ip ) !== -1 )
    {
        const { email, password } = req.body;
        try
        {
            user = await User.findAll( {
                where: {
                    email: email
                }
            } );

            if ( user.length > 0 )
            {
                if ( user[ 0 ].password == password )
                {
                    try {
                        await User.destroy( {
                            where: {
                                email: email
                            }
                        } );
                        res.status( 200 ).send( { status: httpStatusText.SUCCESS, data: null, msg: "user deleted" } )
                    }catch (error) {
                        res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: error.errors[ 0 ].message } )
                    }
                    res.status( 200 ).send( { status: httpStatusText.SUCCESS, data: user[ 0 ] } );
                } else
                {
                    res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: 'wrong password' } );
                }
            } else
            {
                res.status( 404 ).send( { status: httpStatusText.FAIL, data: null, msg: "email doesn't exists" } );
            }
        } catch ( error )
        {
            res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: error } );
        }
    } else
    {
        res.status( 401 ).send( "authentication refused" );
    }
}


const updateAccount = async( req, res ) =>
{
    if ( Allowed_ips.indexOf( req.ip ) !== -1 )
    {
        const { name, email, password,new_password, address1, address2, phone_number,gender,age } = req.body
        const errors = validationResult( req );
        if ( errors.isEmpty() )
        {
            try
            {
                user = await User.findAll( {
                    where: {
                        email: email
                    }
                } );
                if ( user.length > 0 )
                {
                    if ( user[ 0 ].password == password )
                    {
                        try {
                            await User.update( {
                                "name": name,
                                "email": email,
                                "password": new_password,
                                "address1": address1,
                                "address2": address2,
                                "phone_number": phone_number,
                                "gender": gender,
                                "age": age
                            }, {
                                where: {
                                    'email': email
                                }
                            } );
                            res.status( 200 ).send( { status: httpStatusText.SUCCESS, data: null , msg : "user has been updated successfully" } )
                        } catch (error) {
                            res.status(400).send(error)
                        }
                        
                    } else
                    {
                        res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: 'wrong password' } );
                    }
                } else
                {
                    res.status( 404 ).send( { status: httpStatusText.FAIL, data: null, msg: "email doesn't exists" } );
                }
            } catch ( error )
            {
                res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: error.errors[ 0 ].message } );
            }
        } else
        {
            res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg:errors.array()[ 0 ][ 'msg' ] });
        }
    } else
    {
        res.status( 401 ).send( { status: httpStatusText.FAIL, data: null, msg:"authentication refused"  });
    }
};

module.exports = {
    getAllusers,
    login,
    signup,
    deleteAccount,
    updateAccount
};
