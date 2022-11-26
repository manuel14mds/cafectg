import MemoryContainer from "./MemoryContainer.js";
import Products from "./Products.js";
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

    addProductToCart = (cid, pid, qty) => {
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
    }

    // delete a product from a cart
    // require cartID and productID
    deleteProductFromCart = (cid, pid) => {
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
    }

    // return an object with all products' properties of the cart
    getProductsCart = (cid)=>{
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

    }
}