/* imports */
const express = require("express");
const cors = require("cors");
/* constants */
const App = express();
const port = 5011;
/* Middleware */
App.use(express.json());
App.use(cors());

///////////////////////////////    Users functions    ///////////////////////////////////
const usersRouter = require("./routes/users.route");
App.use("/", usersRouter);

//////////////////////////////   USERS end   /////////////////////////////////////////////

// Start the server and have it listen on the specified port
App.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
