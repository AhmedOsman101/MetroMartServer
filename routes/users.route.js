const usersController = require("../controllers/users.controller");
const { body, validationResult } = require("express-validator");
const express = require("express");
const userRouter = express.Router();

userRouter.get("/", usersController.getAllusers);
userRouter.post("/user/login", usersController.login);

userRouter.post(
	"/user/signup",
	body("name").notEmpty().withMessage("name cannot be empty"),
	body("email").notEmpty().withMessage("email is required").isEmail(),
	body("password").notEmpty().isStrongPassword().withMessage("weak password"),
	body("address1")
		.notEmpty()
		.withMessage("address cannot be empty")
		.isString(),
	body("phone_number")
		.notEmpty()
		.isMobilePhone()
		.withMessage("invalid phone_number"),
	body("gender").custom((value) => {
		if (value !== "male" && value !== "female") {
			throw new Error("gender must be either 'male' or 'female'");
		}
		return true;
	}),
	body("age").custom((value) => {
		if (value < 18) {
			throw new Error("age must be at least 18");
		}
		return true;
	}),
	usersController.signup
);

// Handle DELETE requests to remove users
userRouter.delete("/user/deleteAccount", usersController.deleteAccount);

// Handle PUT requests to update users
userRouter.put(
	"/user/updateAccount",
	body("name").notEmpty().withMessage("name cannot be empty"),
	body("email").notEmpty().withMessage("email is required").isEmail(),
	body("password").notEmpty().isStrongPassword().withMessage("weak password"),
	body("address1")
		.notEmpty()
		.withMessage("address cannot be empty")
		.isString(),
	body("phone_number")
		.notEmpty()
		.isMobilePhone()
		.withMessage("invalid phone number"),
	body("gender").custom((value) => {
		if (value !== "male" && value !== "female") {
			throw new Error("gender must be either 'male' or 'female'");
		}
		return true;
	}),
	body("age").custom((value) => {
		if (value < 18) {
			throw new Error("age must be at least 18");
		}
		return true;
	}),
	usersController.updateAccount
);

// handle any other requests
userRouter.use((req, res) => {
	res.status(404).send("ERROR-404: Page Was Not Found"); // Send back an error message as a response
});

module.exports = userRouter;
