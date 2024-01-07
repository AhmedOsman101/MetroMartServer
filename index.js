/* import Express */
const express = require("express");
const App = express();
App.use(express.json());
const port = process.env.PORT || 5011; // the port on which the server will start

///////////////////////////////    Users functions    ///////////////////////////////////
const usersRouter = require("./routes/users.route");
App.use("/", usersRouter);

//////////////////////////////   USERS end   /////////////////////////////////////////////

// Start the server and have it listen on the specified port
App.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
