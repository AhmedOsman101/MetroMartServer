/* import Express */
const express = require("express");
const App = express();
const cors = require("cors");
const port = 5011;

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
