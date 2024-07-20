/* import Express */
const express = require("express");
const timeout = require("connect-timeout");
const cors = require("cors");
const { connection } = require("./data/dbconn");
require("dotenv").config();
const port = process.env.PORT;

const App = express();
App.use(express.json());
App.use(cors());
App.use(timeout("10000s"));

///////////////////////////////    Users    ///////////////////////////////////

const usersRouter = require("./routes/users.route");
App.use("/user", usersRouter);

//////////////////////////////   Products   /////////////////////////////////////////////
const productRouter = require("./routes/products.route");
App.use("/products", productRouter);

//////////////////////////////   Carts   /////////////////////////////////////////////
const cartRouterr = require("./routes/carts.route");
App.use("/carts", cartRouterr);

// Make the Database connection then Start the server
connection().then(() => {
	App.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}`);
	});
});
