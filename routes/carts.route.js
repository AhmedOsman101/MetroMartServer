const cartsController = require( "../controllers/carts.controller" );
// const { body, validationResult } = require( 'express-validator' );
const express = require( 'express' );
const cartRoute = express.Router();





cartRoute.get( "/",cartsController.getAllCarts);
cartRoute.get( "/getSingleCart", cartsController.getSingleCart );






module.exports = cartRoute;