/* import Express */
const express = require( "express" );
const cors = require("cors")
const App = express();
App.use( express.json() );
App.use( cors() )
App.timeout = 9999999999;
const port = 5011;







///////////////////////////////    Users functions    ///////////////////////////////////
const usersRouter = require( "./routes/users.route" )
App.use("/",usersRouter)

//////////////////////////////   USERS end   /////////////////////////////////////////////



// Start the server and have it listen on the specified port
App.listen( port, () =>
{
	console.log( `Server is running on http://localhost:${ port }` );
} );
