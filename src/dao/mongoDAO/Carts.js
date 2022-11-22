import cartModelService from '../../models/Carts.model.js'
import MongoContainer from "./MongoContainer.js";
import CartDTO from '../DTOs/DTOcart.js';
export default class Carts extends MongoContainer{
    constructor(){
        super()
        this.modelService = cartModelService
    }
    create = async () => {
        let result = await this.save({})
        return result
    }
    getAll = async () => {
        let data =  await this.modelService.find().lean()
        const carts = data.map(cart => new CartDTO(cart))
        return carts
    }

    /* addProductToCart = async (cid, pid, qty) => {
        let cart = await this.getById(cid)

        if(!cart.products){
            if(qty < 1){
                throw new Error("Cart manager error:{addProductCart} invalid quantity")
            }else{
                cart.products.push({id:pid, quantity:qty})
            }

        }else{
            if(cart.products.some(e => e.id === pid)){
                for (const item of cart.products){
                    if(item.id === pid){
                        let condition = (item.quantity += qty)
                        if(condition < 1){
                            item.quantity = 1
                        }else{
                            item.quantity = condition
                        }
                    }
                }

            }else{
                if(qty < 1){
                    throw new Error("Cart manager error:{addProductCart} invalid quantity")
                }else{
                    cart.products.push({id:pid, quantity:qty})
                }
            }
        }
        await this.update(cart)
    } */
    addProductToCart = async (cid, prod, qty) => {
        let cart = await this.getById(cid)
        prod.id=prod._id.toString()
        if(cart.products.length===0){
            if(qty){
                cart.products.push({product:prod._id, qty})
                await this.update(cart)
                return true
            }
        }else{
            let product
            //validate if the product is already in the cart
            let result = cart.products.some((item)=>{
                product = item.product.toString()
                return product === prod.id
            })
            if(result){
                cart.products.forEach(element => {
                    product = element.product.toString()
                    if(product === prod.id){
                        let value = element.qty + qty
                        if(value<=0){
                            return false
                        }else{
                            if(prod.stock<value){
                                return false
                            }
                            element.qty += qty
                        }
                    }
                })
            }else{
                if(qty){
                    if(prod.stock<qty){
                        return false
                    }
                    cart.products.push({product:prod._id, qty})
                }else{
                    return false
                }
            }
            await this.update(cart)
            return true
            // FALTA ACTUALIZAR EL TOTALQTY
        }
    }

    // delete a product from a cart
    // require cartID and productID
    deleteProductFromCart = async (cid, pid) => {
        let cart = await this.getById(cid)

        let newCartProduts = []

        if(cart.products.some(e =>e.id === pid)){
            for (const item of cart.products){
                if(item.id === pid){
                    continue
                }
                newCartProduts.push(item)
            }
            cart.products = newCartProduts
            this.update(cart)
        }
    }
    //empty cart
    emptyCart = async (cid) => {
        try {
            let cart = await this.getById(cid)
            cart.products=[]
            this.update(cart)
        } catch (error) {
            console.log('Cart manager: {getProductCart}')
            console.log(error)
        }
    }

    // return an object with all products' properties of the cart
    getProductsCart = async (cid)=>{
        try {
            let cart = await this.getById(cid)
            let copyList = []
            for(const item of cart.products){
                console.log('cart product:', productService.getById(item.id))
                copyList.push(
                    {
                    product: await productService.getById(item.id), // ------------------------ It hasnt been used XXXXXXXXXXXXXXXXXX
                    quantity:item.qty
                    }
                )
            }
            return copyList
        } catch (error) {
            console.log('Cart manager: {getProductCart}')
            console.log(error)
        }
    }
    getCartId = async (id)=>{
        try {
            let result = await this.modelService.findOne({_id:id}).lean().populate('products.product')
            const cart = new CartDTO(result)
            return cart
        } catch (error) {
            console.log('Cart manager: {getCartId}')
            console.log(error)
        }
    }
    
}