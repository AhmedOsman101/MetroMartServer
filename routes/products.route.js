const productsController = require("../controllers/products.controller");
const express = require("express");
const productRouter = express.Router();

productRouter.get("/", productsController.getAllProducts);
productRouter.get("/:id", productsController.getSingleProduct);
productRouter.get("/search/:search", productsController.searchForProducts);
productRouter.get(
	"/getProductsByCategory/:category_id",
	productsController.getProductsByCategory,
);

module.exports = productRouter;
