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

const getSingleProduct = async ( req, res ) =>
{
    try
    {
        const productId = req.params.id
        const product = await Products.findOne( { where: { id: productId } } );
        if(product == null){throw new Error("please enter valid id")}
        res.status( 200 ).send( { status: httpStatusText.SUCCESS, data: product } );
    } catch ( Error )
    {
        res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: Error.message } );
    }
}

const searchForProducts = async ( req, res ) =>
{
    try
    {
        const productName = req.params.search
        const product = await Products.findAll( { where: { name: productName } } );
        if ( product.length == 0) { throw new Error( "No products found with this name" ); }
        res.status( 200 ).send( { status: httpStatusText.SUCCESS, data: product } );
    } catch ( error )
    {
        res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: error.message } );
    }
}



module.exports = {
    getAllProducts,
    getSingleProduct,
    searchForProducts
};