import { query, Router } from "express"
import ProductManager from '../managers/product.manager.js'
import CartManager from '../managers/cart.manager.js'
import userAdmin from '../app.js'


const router = Router()
const productService = new ProductManager()
const cartService = new CartManager()

router.get('/', async(req,res)=>{
    if(!userAdmin){
        return res.send({error:-1, descripction: "route '/' method 'getAll' no authorized"})
    }else{
        let cart = await cartService.getAll()
        res.send(cart)
    }
})

router.post('/', async(req,res)=>{
    await cartService.createCart()
    res.send({status:'success',message:'successfully created'})
})

router.delete('/:cid', async(req,res)=>{
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

/* router.get('/:pid', async(req,res)=>{
    //falta validar los campos
    let product = await productService.getProductById(parseInt(req.params.pid))
    if(product==null){
        return res.status(404).send({status:'error', error:"product doesn't exist"})
    }
    res.send(product)
}) */
/* 
router.put('/:pid',async (req,res)=>{
    let product = await productService.getProductById(parseInt(req.params.pid))
    if(product==null){
        return res.status(404).send({status:'error', error:"product doesn't exist"})
    }else{
        const {name, price, stock, enable} = req.body
        if(!name||!price||!stock||!enable){
            return res.status(300).send({status:'error', error:"blank spaces are NOT allowed"})
        }else{
            try {
                await productService.updateProduct(parseInt(req.params.pid), req.body)
                res.send({status:'success',message:'successfully saved'})
            } catch (error) {
                return res.status(500).send({status:'error', error:"it couldn't update the product"})
            }
        }
    }
}) */

/* router.post('/',async (req,res)=>{
    const {name, price, stock, enable} = req.body
    //faltan las validaciones de los campos
    if(!name||!price||!stock||!enable){
        return res.status(300).send({status:'error', error:"blank spaces are NOT allowed"})
    }else{
        try {
            await productService.addProduct(req.body)
            
        } catch (error) {
            return res.status(500).send({status:'error', error:"it couldn't save the product"})
        }
        res.send({status:'success',message:'successfully saved' })
    }
}) */

/* router.delete('/:pid', async(req,res)=>{
    let product = await productService.getProductById(parseInt(req.params.pid))
    if(product==null){
        return res.status(404).send({status:'error', error:"product doesn't exist"})
    }else{
        try {
            await productService.deleteProductById(parseInt(req.params.pid))
        } catch (error) {
            return res.status(500).send({status:'error', error:"it couldn't delete the product"})
        }
        res.send({status:'success',message:'successfully deleted' })
    }
})
 */

export default router