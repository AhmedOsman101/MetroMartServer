/* import Express */
const express = require( "express" );
const timeout = require( 'connect-timeout' )
require( "dotenv" ).config();
const cors = require("cors")
const App = express();
App.use( express.json() );
App.use( cors() )
App.use( timeout( '10000s' ) )
const port = process.env.PORT;
const { connection, sequelize } = require( "./data/dbconn" );







///////////////////////////////    Users functions    ///////////////////////////////////
const usersRouter = require( "./routes/users.route" )
App.use("/user",usersRouter)

//////////////////////////////   USERS end   /////////////////////////////////////////////



// Start the server and have it listen on the specified port
App.listen( port, async() =>
{
	console.log( `Server is running on http://localhost:${ port }` );
	await connection()
} );
