const { validationResult } = require( 'express-validator' );
const httpStatusText = require( "../utils/httpStatustext" );
const Carts = require( '../models/orders' );
const User = require( "../models/users" );
const Products = require( "../models/products" );
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


const getSingleCart = async ( req, res ) =>
{
	const data = req.body
	try
	{
		const userCart = await Carts.findAll( {
			where: { user_id : data.user_id }
		} )
		if ( userCart.length == 0 ) { throw new Error( 'User has No products in Cart' ); }
		let cartProductsArr = [] // all products id that in user card
		userCart.forEach(element => {
			cartProductsArr.push(element.product_id)
		} );
		let productsCart = []
		for ( i of cartProductsArr )
		{
			let product = await Products.findOne({where:{id : i}})
			productsCart.push(product)
		}
		res.send( { status: httpStatusText.SUCCESS, data: productsCart} )

	} catch ( error )
	{
		res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: error.message } );
	}
};

module.exports = {
	getAllCarts,
	getSingleCart
};