import __dirname from '../../utils.js'
import FileSystemContainer from "./FileSystemContainer.js";
export default class Carts extends FileSystemContainer{
    constructor(){
        super()
        this.path = __dirname + '/files/carts.json'
    }
    create = async () => {
        let data = await this.getAll()
        let cart={}
        if (data.length === 0) {
            cart.id = 1
            cart.time_stamp = Date.now().toLocaleString()
        }else{
            cart.id = data[data.length - 1].id + 1
            cart.time_stamp = Date.now().toLocaleString()
        }
        cart.products = []
        await this.save(cart)
        return cart
    }

    //add a product into cart
    addProductToCart = async (cid, pid, qty) => {
        let cart = await this.getById(cid)
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
        await this.update(cart)
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
}