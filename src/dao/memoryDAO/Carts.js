import MemoryContainer from "./MemoryContainer.js";
import Cart from "../../model/cart.class.js";

export default class Carts extends MemoryContainer{
    constructor(){
        super()
    }
    create = () => {
        let cart={}
        if (this.data.length === 0) {
            cart.id = 1
            cart.time_stamp = Date.now().toLocaleString()
        }else{
            cart.id = this.data[this.data.length - 1].id + 1
            cart.time_stamp = Date.now().toLocaleString()
        }
        cart.products = []
        cart.total = 0
        this.save(cart)
        return cart
    }

    addProductToCart = (cid, prod, qty) => {
        if(qty > prod.stock){// si la cantidad supera al stock del producto
            qty = prod.stock
        }
        let result = this.getById(cid)// traigo el cart
        const cart = new Cart(result.id, result) // creo una instancia del la clase cart con el objeto cart
        
        if(cart.products.length===0){// no hay productos en el carrito
            cart.addProduct(prod.id, prod, qty)
            this.update(cart.id, cart)// pongo el producto y la cantidad en el carrito
            return cart
        }else{
            //validate if the product is already in the cart
            let result = cart.products.some((item)=>{
                return item.product == prod.id
            })

            if(result){ // Sí está el producto en el carrito
                cart.addQty(prod.id, prod, qty)
            }else{// si no esta en el carrito
                cart.addProduct(prod.id, prod, qty)
            }
            this.update(cart.id, cart)
        }
    }
    
    // delete a product from a cart
    // require cartID and productID
    deleteProductFromCart = (cid, prod, pid) => {
        let result =  this.getById(cid)// traigo el cart
        const cart = new Cart(result.id, result) // creo una instancia del la clase cart con el objeto cart
        
        if(cart.products.length===0){// no hay productos en el carrito
            return cart
        }else{// sí hay productos en el carrito
            //validate if the product is already in the cart
            let result = cart.products.some((item)=>{
                return item.product == prod.id
            })
            
            if(result){ // Sí está el producto en el carrito
                cart.removeProduct(pid, prod)
            }else{
                return cart
            }
            this.update(cart.id, cart)
            return cart
        }
    }

    //empty cart
    emptyCart = async (cid) => {
        let result = this.getById(cid)
        const cart = new Cart(result.id, result) // creo una instancia del la clase cart con el objeto cart
        cart.empty()
        this.update(cart.id, cart)
        return cart
    }

    getCart = async (cid)=>{
        const result = this.getById(cid)
        const cart = new Cart(result.id, result) // creo una instancia del la clase cart con el objeto cart
        return cart
    }
}