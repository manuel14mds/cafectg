import { Router } from "express"

import wishListController from '../controllers/wishList.controller.js'

import { loginValidater } from '../middelwares/authUser.js'
import { validatePid, validateWid } from "../middelwares/IDsValidator.js"

const router = Router()

//getAll Wish Lists
router.get('/', wishListController.getAllWLs)

//createOne
router.post('/', wishListController.createOne)

//deleteById
//router.delete('/:cid', validateCid, cartController.deleteById)

// get By Id populated
router.get('/:wid', loginValidater, validateWid, wishListController.getById)

//add products to cart
router.post('/:wid/product/:pid', loginValidater, validateWid, validatePid, wishListController.addProduct)

//delete product from cart
router.delete('/:wid/product/:pid', loginValidater, validateWid, validatePid, wishListController.deleteProduct)

//delete all products from cart
router.delete('/:wid/empty', loginValidater, validateWid, wishListController.emptyWishList)


export default router