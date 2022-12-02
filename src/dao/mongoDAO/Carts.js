import cartModelService from '../../models/Carts.model.js'
import MongoContainer from "./MongoContainer.js";
import CartDTO from '../DTOs/DTOcart.js';
import Cart from '../../model/cart.class.js';
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
        const carts = data.map(cart => new Cart(cart._id, cart))
        return carts
    }

    addProductToCart = async (cid, prod, qty) => {
        if(qty > prod.stock){// si la cantidad supera al stock del producto
            qty = prod.stock
        }
        let result = await this.getById(cid)// traigo el cart
        result.id = result._id

        const cart = new Cart(result.id, result) // creo una instancia del la clase cart con el objeto cart
        prod.id=prod._id.toString()
        
        if(cart.products.length===0){// no hay productos en el carrito
            cart.addProduct(prod.id, prod, qty)
            await this.update(cart.id, cart)// pongo el producto y la cantidad en el carrito
            return cart
        }else{// sí hay productos en el carrito
            let product
            //validate if the product is already in the cart
            let result = cart.products.some((item)=>{
                product = item.product.toString()
                return product === prod.id
            })
            if(result){ // Sí está el producto en el carrito
                cart.addQty(prod.id, prod, qty)
            }else{
                cart.addProduct(prod.id, prod, qty)
            }
            await this.update(cart.id, cart)
        }
    }

    // delete a product from a cart
    // require cartID and productID
    deleteProductFromCart = async (cid, prod, pid) => {
        let result = await this.getById(cid)// traigo el cart
        result.id = result._id
        const cart = new Cart(result.id, result) // creo una instancia del la clase cart con el objeto cart
        prod.id=prod._id.toString()
        
        if(cart.products.length===0){// no hay productos en el carrito
            return cart
        }else{// sí hay productos en el carrito
            let product
            //validate if the product is already in the cart
            let result = cart.products.some((item)=>{
                product = item.product.toString()
                return product === prod.id
            })
            if(result){ // Sí está el producto en el carrito
                cart.removeProduct(pid, prod)
            }else{
                return cart
            }
            await this.update(cart.id, cart)
            return cart
        }
    }

    //empty cart
    emptyCart = async (cid) => {
        let result = await this.getById(cid)
        const cart = new Cart(result.id, result) // creo una instancia del la clase cart con el objeto cart
        cart.empty()
        this.update(cart.id, cart)
        return cart
    }

    /* getProductsCart = async (cid)=>{
        const cart = await this.getById(cid)
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
        } */
        
    // return an object with all products' properties of the cart
    getCartId = async (id)=>{
        let result = await this.modelService.findOne({_id:id}).lean().populate('products.product')
        const cart = new Cart(result._id, result)
        return cart
    }
    
}