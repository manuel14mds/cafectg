import {  Router } from "express"
import cartController from '../controllers/cart.controller.js'

import { loginValidater } from '../middelwares/authUser.js'
import { validateCid, validatePid } from "../middelwares/IDsValidator.js"
import { stockValidator } from '../middelwares/productStock.js'
import { qtyValidator } from '../middelwares/productQuantity.js'

const router = Router()

//getAll
router.get('/', cartController.getCarts)

//createOne
router.post('/', cartController.createOne)

//deleteById
router.delete('/:cid', validateCid, cartController.deleteById)

// get By Id
router.get('/:cid', validateCid, cartController.getById)

//ListEntireProductsCart
router.get('/:cid/products', validateCid, cartController.getWhole)

//add products to cart
router.post('/addToCart', loginValidater, stockValidator, qtyValidator, cartController.addProducts)

//delete product from cart
router.delete('/:cid/products/:pid', validateCid, validatePid, cartController.deleteProduct)

//delete all products from cart
router.delete('/emptyCart/:cid', loginValidater, validateCid, cartController.emptyCart)

export default router