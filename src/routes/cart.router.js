import {  Router } from "express"
import cartController from '../controllers/cart.controller.js'
import services from '../dao/index.js'

import config from '../config/config.js'
import jwt from 'jsonwebtoken'


const router = Router()


//getAll
router.get('/', cartController.getCarts)

//createOne
router.post('/', cartController.createOne)

//deleteById
router.delete('/:cid', validateCid, cartController.deleteById)

//ListEntireProductsCart
router.get('/:cid/products', validateCid, cartController.getWhole )

//add products to cart
router.post('/addToCart', loginValidater, cartController.addProducts)

//purchase
router.get('/purchase', loginValidater, cartController.purchase)

//delete product from cart
router.delete('/:cid/products/:pid', validateCid, validatePid, cartController.deleteProduct)

//delete all products
router.delete('/emptyCart/:cid', loginValidater, validateCid, cartController.emptyCart)

router.get('/*:params',(req,res)=>{
    logger.warn(`route not implemented -> ${req.originalUrl}`)
    res.send({ error : -2, descripcion: `route '/api/carts/${req.params[0]}' method 'GET' no implemented`})
})

async function validatePid(req,res,next){
    try {
        req.params.product = await services.ProductService.getById(req.params.pid)
        if(!req.params.product) return res.status(404).send({status:'error', error:'Product not found'})
    } catch (error) {
        console.log('error en validatePid cart.router.js', error)
        return res.status(404).send({status:'error', error:'Product not found'})
    }
    next()
}

//validate if the user is logged
async function loginValidater(req,res,next){
    const token = req.cookies[config.jwt.COOKIE]
    if(!token)return res.status(401).send({message:'unauthorized'})
    const user = jwt.verify(token, config.jwt.SECRET)
    const wholeUser = await services.UserService.getByEmail(user.email)
    req.body.cartId=wholeUser.cartId
    req.body.user = wholeUser
    next()
    
}
async function validateCid(req,res,next){
    try {
        req.params.cart = await services.CartService.getById(req.params.cid)
    } catch (error) {
        return res.status(300).send({status:'error', error:'Invalid id'})
    }
    if(!req.params.cart) return res.status(404).send({status:'error', error:'Cart not found'})
    next()
}

export default router