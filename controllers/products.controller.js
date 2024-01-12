const { validationResult } = require( 'express-validator' );
const httpStatusText = require( "../utils/httpStatustext" );
const Products = require( '../models/products' );
const bcrypt = require( 'bcryptjs' );


const getAllProducts = async(req,res) =>
{
        try
        {
            const products = await Products.findAll();
            res.status( 200 ).send( { status: httpStatusText.SUCCESS, data: products } );
        } catch ( error )
        {
            res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: error } );
        }
}


module.exports = { getAllProducts };