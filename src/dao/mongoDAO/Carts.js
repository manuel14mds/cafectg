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
        result.id = result._id
        return result
    }
    getAll = async () => {
        let data =  await this.modelService.find().lean()
        const carts = data.map(cart => new CartDTO(cart))
        return carts
    }


    addProductToCart = async (cid, prod, qty) => {
        
        if(qty > prod.stock){
            qty = prod.stock
        }
        let cart = await this.getById(cid)// traigo el cart
        prod.id=prod._id.toString()
        
        if(cart.products.length===0){// no hay productos en el carrito
            if(qty){
                cart.products.push({product:prod._id, qty})
                await this.update(cart)// pongo el producto y la cantidad en el carrito
                return true
            }
        }else{// sí hay productos en el carrito
            let product
            //validate if the product is already in the cart
            let result = cart.products.some((item)=>{
                product = item.product.toString()
                return product === prod.id
            })
            
            // Qué pasa si qty es mayor que el stock del producto?
            //if(qty > p)
            
            
            if(result){ // Sí está el producto en el carrito
                cart.products.forEach(element => {
                    product = element.product.toString()
                    if(product === prod.id){
                        let value = element.qty + qty
                        if(value<=0){
                            return false
                        }else{
                            if(prod.stock<value){
                                return false
                            }else{
                                element.qty += qty
                            }
                        }
                    }
                })
            }else{
                if(prod.stock<qty){
                    return false
                }else{
                    cart.products.push({product:prod._id, qty})
                }
            }
            await this.update(cart._id, cart)
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
        let cart = await this.getById(cid)
        cart.products=[]
        this.update(cart)
    }

    // return an object with all products' properties of the cart
    getProductsCart = async (cid)=>{
        let cart = await this.getById(cid)
        let copyList = []
        for(const item of cart.products){
            copyList.push(
                {
                product: await productService.getById(item.id), // ------------------------ It hasnt been used XXXXXXXXXXXXXXXXXX
                quantity:item.qty
                }
            )
        }
        return copyList
    }
    getCartId = async (id)=>{
        let result = await this.modelService.findOne({_id:id}).lean().populate('products.product')
        const cart = new CartDTO(result)
        return cart
    }
    
}