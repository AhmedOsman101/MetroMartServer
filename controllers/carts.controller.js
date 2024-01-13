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

const addProductToCart = async ( req, res ) =>
{
	const data = req.body // user_id  , product_id , quantity
	try {
		const user = await User.findAll( {
			where: {
				id: data.user_id
			}
		} );
		if ( user.length == 0 ) { throw new Error( 'user not found' ); }

		const product = await User.findAll( {
			where: {
				id: data.product_id
			}
		} );
		if ( product.length == 0 ) { throw new Error( 'product not found' ); }
		else if ( product.quantity == 0 ) { throw new Error( 'product unavilable now' ); }
		
		if ( data.quantity <= 0 ) { throw new Error( 'invalid quantity' ); }

		const newCart = Carts.build( {
			'product_id': data.product_id,
			'user_id': data.user_id,
			'quantity':data.quantity
		})


	} catch (error) {
		res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: error.message } );
	}
}

module.exports = {
	getAllCarts,
	getSingleCart,
	addProductToCart
};