import {  Router } from "express"
import services from '../dao/index.js'
import userAdmin from '../app.js'

const router = Router()
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
        return res.status(500).send({status:'error', error:"Products couldn't be listed"})
    }
})
//add products to cart
router.post('/:cid/products', validateCid, async (req,res)=>{
    const {id, quantity} = req.body
    if(!id||!quantity){
        return res.status(300).send({status:'error', error:"blank spaces are NOT allowed"})
    }else{
        try {
            await services.CartService.addProductToCart(req.params.cid, id, parseInt(quantity))
            res.send({status:'success',message:'successfully saved into the cart'})
        } catch (error) {
            return res.status(500).send({status:'error', error:"it couldn't upload the product into the cart"})
        }
    }
})
//delete product from cart
router.delete('/:cid/products/:pid', validateCid, validatePid, async (req,res)=>{
    try {
        await services.CartService.deleteProductFromCart(req.params.cid, req.params.pid)
        res.send({status:'success',message:'successfully deleted from cart'})
    } catch (error) {
        return res.status(500).send({status:'error', error:"it couldn't delete the product from the cart"})
    }
})

router.get('/*:params',(req,res)=>{
    res.send({ error : -2, descripcion: `route '/api/carts/${req.params[0]}' method 'GET' no implemented`})
})

async function validatePid(req,res,next){
    req.params.product = await services.ProductService.getById(req.params.pid)
    if(!req.params.product) return res.status(404).send({status:'error', error:'Product not found'})
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