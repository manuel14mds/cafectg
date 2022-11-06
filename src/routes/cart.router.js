import {  Router } from "express"
import services from '../dao/index.js'
import userAdmin from '../app.js'
import pino from "pino"
import __dirname from "../utils.js"
import config from '../config/config.js'
import jwt from 'jsonwebtoken'
import { emailTransport, emailHTMLmaker } from "../utils.js"

const router = Router()
const streams = [
    {level:'info', stream:process.stdout},
    {level:'warn', stream:pino.destination(__dirname+'/logFiles/warn.log')},
    {level:'error', stream:pino.destination(__dirname+'/logFiles/error.log')},
]
const logger = pino({},pino.multistream(streams))

//getAll
router.get('/', async(req,res)=>{
    let cart = await services.CartService.getAll()
    res.send(cart)
})
//createOne
router.post('/', async(req,res)=>{
    await services.CartService.create()
    res.send({status:'success',message:'successfully created'})
})
//deleteById
router.delete('/:cid', validateCid, async(req,res)=>{
    if(!userAdmin){
        return res.send({error:-1, descripction: "route '/carts/:cid' method 'DELETE' no authorized"})
    }else{
        try {
            await services.CartService.deleteById(req.params.cid)
            res.send({status:'success',message:'successfully deleted'})
        } catch (error) {
            logger.error(`cart couldn't been deleted | Method: ${req.method} | URL: ${req.originalUrl}`)
            return res.status(500).send({status:'error', error:"cart couldn't been deleted"})
        }
    }
})

//ListEntireProductsCart
router.get('/:cid/products', validateCid, async (req,res)=>{
    try {
        let report = []
        let cart = await services.CartService.getById(req.params.cid)
        let productList = {}
        for(let element of cart.products){
            productList = {
                product: await services.ProductService.getById(element.id),
                quantity:element.quantity
            }
            report.push(productList)
        }
        res.send(report)
    } catch (error) {
        logger.error(`Products couldn't be listed | Method: ${req.method} | URL: ${req.originalUrl}`)
        return res.status(500).send({status:'error', error:"Products couldn't be listed"})
    }
})

//add products to cart
router.post('/addToCart', loginValidater, async (req,res)=>{
    const {pid, quantity, cartId} = req.body

    if(!pid||!quantity||!cartId){
        return res.status(300).send({status:'error', error:"blank spaces are NOT allowed"})
    }else{
        try {
            let product = await services.ProductService.getById(pid)
            await services.CartService.addProductToCart(cartId, product, parseInt(quantity))
            return res.send({status:'success',message:'successfully saved into the cart'})
        } catch (error) {
            logger.error(`Couldn't upload the product into the cart | Method: ${req.method} | URL: ${req.originalUrl}`)
            return res.status(500).send({status:'error', error:"it couldn't upload the product into the cart"})
        }
    }
})
//purchase
router.get('/purchase', loginValidater, async (req,res)=>{
    try {
        let total = 0
        let cart = await services.CartService.getCartId(req.body.user.cartId)
    
        for (const element of cart.products) {
            total += element.product.price * element.qty
            element.product.stock -= element.qty // Update stock
            await services.ProductService.update(element.product) //update product
        }
        const date = new Date()
        const code =`O${total}-${date[Symbol.toPrimitive]('number')}`
        
        const purchase = {products:cart.products, totalQty:total, code}
        
        const user = req.body.user
        user.purchases.push(purchase)
        await services.UserService.update(user)

        let html = emailHTMLmaker(purchase,user)
        let result = await emailTransport.sendMail({
            from:'yo',
            to:user.email,
            subject:'Purchase Café Cartagena',
            html:html
        })
        console.log(result)
    
        await services.CartService.emptyCart(cart._id)
        res.render('purchase', {purchase})
        
    } catch (error) {
        res.status(500).send({error:'internal server error', message:"Purchase error"})
    }
})

//delete product from cart
router.delete('/:cid/products/:pid', validateCid, validatePid, async (req,res)=>{
    try {
        await services.CartService.deleteProductFromCart(req.params.cid, req.params.pid)
        res.send({status:'success',message:'successfully deleted from cart'})
    } catch (error) {
        logger.error(`Couldn't delete the product from the cart | Method: ${req.method} | URL: ${req.originalUrl}`)
        return res.status(500).send({status:'error', error:"it couldn't delete the product from the cart"})
    }
})
//delete all products
router.delete('/emptyCart/:cid', loginValidater, validateCid,async (req,res)=>{
    try {
        await services.CartService.emptyCart(req.params.cid)
        res.send({status:'success',message:'successfully deleted'})
    } catch (error) {
        console.log(3)
        logger.error(`Couldn't delete the product from the cart | Method: ${req.method} | URL: ${req.originalUrl}`)
        return res.status(500).send({status:'error', error:"it couldn't delete the product from the cart"})
    }
})

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