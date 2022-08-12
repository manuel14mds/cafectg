import {  Router } from "express"
import ProductManager from '../managers/product.manager.js'
import CartManager from '../managers/cart.manager.js'
import userAdmin from '../app.js'


const router = Router()
const productService = new ProductManager()
const cartService = new CartManager()

router.get('/', async(req,res)=>{
    let cart = await cartService.getAll()
    res.send(cart)
})

router.post('/', async(req,res)=>{
    await cartService.createCart()
    res.send({status:'success',message:'successfully created'})
})

router.delete('/:cid', validateCid, async(req,res)=>{
    if(!userAdmin){
        return res.send({error:-1, descripction: "route '/carts/:cid' method 'DELETE' no authorized"})
    }else{
        try {
            await cartService.deleteCardById(req.params.cid)
            res.send({status:'success',message:'successfully deleted'})
        } catch (error) {
            return res.status(500).send({status:'error', error:"cart couldn't been deleted"})
        }
    }
})

router.get('/:cid/products', validateCid, async (req,res)=>{
    try {
        let products = await cartService.getProductCart(req.params.cid)
        res.send(products)
    } catch (error) {
        return res.status(500).send({status:'error', error:"Products couldn't be listed"})
    }
})

router.post('/:cid/products', validateCid, async (req,res)=>{
    const {id, quantity} = req.body
    if(!id||!quantity){
        return res.status(300).send({status:'error', error:"blank spaces are NOT allowed"})
    }else{
        try {
            await cartService.addProductCart(req.params.cid, parseInt(id), parseInt(quantity))
            res.send({status:'success',message:'successfully saved into the cart'})
        } catch (error) {
            return res.status(500).send({status:'error', error:"it couldn't upload the product into the cart"})
        }
    }
})

router.delete('/:cid/products/:pid', validateCid, validatePid, async (req,res)=>{
    try {
        await cartService.deleteProductCart(req.params.cid, req.params.pid)
        res.send({status:'success',message:'successfully deleted from cart'})
    } catch (error) {
        return res.status(500).send({status:'error', error:"it couldn't delete the product from the cart"})
    }
})

router.get('/*:params',(req,res)=>{
    res.send({ error : -2, descripcion: `route '/api/carts/${req.params[0]}' method 'GET' no implemented`})
})

async function validatePid(req,res,next){
    try {
        req.params.pid = parseInt(req.params.pid)
    } catch (error) {
        return res.status(400).send({status:'error', error:'Invalid product id'})
    }
    req.params.product = await productService.getProductById(req.params.pid)
    if(req.params.product === null) return res.status(404).send({status:'error', error:'Product not found'})
    next()
}

async function validateCid(req,res,next){
    try {
        req.params.cid = parseInt(req.params.cid)
    } catch (error) {
        return res.status(400).send({status:'error', error:'Invalid cart id'})
    }
    req.params.cart = await cartService.getCartById(req.params.cid)
    if(req.params.cart === null) return res.status(404).send({status:'error', error:'Cart not found'})
    next()
}

export default router