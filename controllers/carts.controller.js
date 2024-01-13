const { validationResult } = require( 'express-validator' );
const httpStatusText = require( "../utils/httpStatustext" );
const Carts = require( '../models/orders' );
const User = require( "../models/users" );
const Product = require( "../models/products" );
const bcrypt = require( 'bcryptjs' );





const getAllCarts = async ( req, res ) =>
{
    try
    {
        const carts = await Carts.findAll();
        res.status( 200 ).send( { status: httpStatusText.SUCCESS, data: carts } );
    } catch ( error )
    {
        res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: error.message } );
    }
};


module.exports = { getAllCarts };