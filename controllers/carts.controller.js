const { validationResult } = require( 'express-validator' );
const httpStatusText = require( "../utils/httpStatustext" );
const Carts = require( '../models/orders' );
const User = require( "../models/users" );
const Products = require( "../models/products" );
const bcrypt = require( 'bcryptjs' );
const { sumQuantities } = require("../utils/sumQuantities")





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


		let productsCart = userCart.map( ( el ) =>
		{
			return ({'product_id':el.product_id , 'quantity' : el.quantity})
		} )
		productsCart = sumQuantities( productsCart )

		let finalCart =[]
		for(let item of productsCart)
		{
			let product = await Products.findAll( { where: { id: item.product_id } } )
			finalCart.push({"product_data":product[0],"quantity":item.quantity})
		}
		
		res.send( finalCart );

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

		const product = await Products.findAll( {
			where: {
				id: data.product_id
			}
		} );
		if ( product.length == 0 ) { throw new Error( 'product not found' ); }
		else if ( product[0].quantity == 0 ) { throw new Error( 'product unavilable now' ); }
		
		if ( data.quantity <= 0 ) { throw new Error( 'invalid quantity' ); }

		const newCart = Carts.build( {
			'product_id': data.product_id,
			'user_id': data.user_id,
			'quantity':data.quantity
		} )
		await newCart.save()

		res.status( 200 ).send( { status: httpStatusText.SUCCESS, data: null , msg : "added to cart successfully"} )


	} catch (error) {
		res.status( 400 ).send( { status: httpStatusText.FAIL, data: null, msg: error.message } );
	}
}

module.exports = {
	getAllCarts,
	getSingleCart,
	addProductToCart
};