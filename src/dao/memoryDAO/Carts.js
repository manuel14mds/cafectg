import MemoryContainer from "./MemoryContainer.js";
import Products from "./Products.js";
import Cart from "../../model/cart.class.js";
const productService = new Products()
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
        this.save(cart)
        return cart
    }

    /* addPtroductToCart = (cid, pid, qty) => {
        let cart = this.getById(cid)
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
        this.update(cart)
    } */
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
            this.update(cart.id, cart)
        }
    }

    // delete a product from a cart
    // require cartID and productID
    /* deleteProductFromCart = (cid, pid) => {
        let cart = this.getById(cid)

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
    } */
    deleteProductFromCart = (cid, prod, pid) => {
        let result =  this.getById(cid)// traigo el cart

        const cart = new Cart(result.id, result) // creo una instancia del la clase cart con el objeto cart
        
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

    // return an object with all products' properties of the cart
    /* getProductsCart = (cid)=>{
        let cart = this.getById(cid)
        let copyList = []
        for(const item of cart.products){
            copyList.push(
                {
                product: productService.getById(item.id), // ------------------------ It hasnt been used XXXXXXXXXXXXXXXXXX
                quantity:item.quantity
                }
            )
        }
        return copyList

    } */
    getCartId = (cid)=>{
        let cart = this.getById(cid)
        let copyList = []
        for(const item of cart.products){
            copyList.push(
                {
                product: productService.getById(item.id), // ------------------------ It hasnt been used XXXXXXXXXXXXXXXXXX
                quantity:item.quantity
                }
            )
        }
        cart.products = copyList
        return cart
    }
}