const cartsController = require("../controllers/carts.controller");
// const { body, validationResult } = require( 'express-validator' );
const express = require("express");
const cartRouter = express.Router();
const verifyToken = require("../middleware/verifyToken");

cartRouter.get("/", verifyToken, cartsController.getAllCarts);
cartRouter.get(
	"/getBillingDetails",
	verifyToken,
	cartsController.getBillingDetails,
);
cartRouter.get(
	"/getSingleCart/:userId",
	verifyToken,
	cartsController.getSingleCart,
);
cartRouter.post(
	"/addProductToCart",
	verifyToken,
	cartsController.addProductToCart,
);
cartRouter.delete(
	"/removeProductFromCart",
	verifyToken,
	cartsController.removeProductFromCart,
);
cartRouter.delete(
	"/removeAllProductsFromCart",
	verifyToken,
	cartsController.removeAllProductsFromCart,
);

module.exports = cartRouter;
