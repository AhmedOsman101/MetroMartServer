const cartsController = require( "../controllers/carts.controller" );
// const { body, validationResult } = require( 'express-validator' );
const express = require( 'express' );
const cartRoute = express.Router();





cartRoute.get( "/",cartsController.getAllCarts);






module.exports = cartRoute;