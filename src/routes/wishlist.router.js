import {  Router } from "express"
import wishListController from '../controllers/wishList.controller.js'
import { logger } from '../app.js'

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
router.get('/:wid', validateWid, wishListController.getById)

//add products to cart
router.post('/:wid/product/:pid', validateWid, validatePid, wishListController.addProduct)

//delete product from cart
router.delete('/:wid/product/:pid', validateWid, validatePid, wishListController.deleteProduct)

//delete all products from cart
router.delete('/:wid/empty', validateWid, wishListController.emptyWishList)

router.all('/*:params',(req,res)=>{
    logger.warn(`route not implemented -> ${req.originalUrl} Method: ${req.method}` )
    res.send({ error : -2, descripcion: `route ${req.originalUrl}' Method: ${req.method} no implemented`})
})

export default router