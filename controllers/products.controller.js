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
        const products = await Products.findOne( { where: { id: productId } } );
        res.status( 200 ).send( { status: httpStatusText.SUCCESS, data: products } );
    } catch ( error )
    {
        res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: error } );
    }
}
const searchForProducts = async ( req, res ) =>
{
    try
    {
        const productName = req.params.search
        const products = await Products.findAll( { where: { name: productId } } );
        res.status( 200 ).send( { status: httpStatusText.SUCCESS, data: products } );
    } catch ( error )
    {
        res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: error } );
    }
}



module.exports = {
    getAllProducts,
    getSingleProduct,
    searchForProducts
};