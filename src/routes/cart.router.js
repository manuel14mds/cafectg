import { query, Router } from "express"
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

router.delete('/:cid', async(req,res)=>{
    if(!userAdmin){
        return res.send({error:-1, descripction: "route '/carts/:cid' method 'DELETE' no authorized"})
    }else{
        let cart = await cartService.getCartById(parseInt(req.params.cid))
        if(cart === null){
            return res.status(404).send({status:'error', error:"cart doesn't exist"})
        }else{
            try {
                await cartService.deleteCardById(parseInt(req.params.cid))
                res.send({status:'success',message:'successfully deleted'})
            } catch (error) {
                return res.status(500).send({status:'error', error:"cart couldn't been deleted"})
            }
        }
    }
})
router.get('/:cid/products', async (req,res)=>{
    let cart = await cartService.getCartById(parseInt(req.params.cid))
    if(cart === null){
        return res.status(404).send({status:'error', error:"cart doesn't exist"})
    }else{
        try {
            let products = await cartService.getProductCart(parseInt(req.params.cid))
            res.send(products)
        } catch (error) {
            return res.status(500).send({status:'error', error:"Products couldn't be listed"})
        }

    }
})

router.post('/:cid/products', async (req,res)=>{
    const {id, quantity} = req.body
    if(!id||!quantity){
        return res.status(300).send({status:'error', error:"blank spaces are NOT allowed"})
    }else{
        let cart = await cartService.getCartById(parseInt(req.params.cid))
        if(cart === null){
            return res.status(404).send({status:'error', error:"cart doesn't exist"})
        }else{
            try {
                await cartService.addProductCart(parseInt(req.params.cid), parseInt(id), parseInt(quantity))
                res.send({status:'success',message:'successfully saved into the cart'})
            } catch (error) {
                return res.status(500).send({status:'error', error:"it couldn't upload the product into the cart"})
            }
        }
    }
})

router.delete('/:cid/products/:pid', async (req,res)=>{
    let cart = await cartService.getCartById(parseInt(req.params.cid))
    let product = await productService.getProductById(parseInt(req.params.pid))
    if(cart==null){
        return res.status(404).send({status:'error', error:"cart doesn't exist"})
    }else if(product == null){
        return res.status(404).send({status:'error', error:"product doesn't exist"})
    }else{
        try {
            await cartService.deleteProductCart(parseInt(req.params.cid),parseInt(req.params.pid))
            res.send({status:'success',message:'successfully deleted from cart'})
        } catch (error) {
            return res.status(500).send({status:'error', error:"it couldn't delete the product from the cart"})
        }
    }
})

router.get('/*:params',(req,res)=>{
    res.send({ error : -2, descripcion: `route '/api/carts/${req.params[0]}' method 'GET' no implemented`})
})

export default router