const cartsController = require( "../controllers/carts.controller" );
// const { body, validationResult } = require( 'express-validator' );
const express = require( 'express' );
const cartRoute = express.Router();
const verifyToken = require( "../middleware/verfiyToken" )





cartRoute.get( "/",cartsController.getAllCarts);
cartRoute.get( "/getSingleCart",verifyToken, cartsController.getSingleCart );
cartRoute.post( "/addProductToCart",verifyToken, cartsController.addProductToCart );






module.exports = cartRoute;