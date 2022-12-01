import __dirname from '../../utils.js'
import FileSystemContainer from "./FileSystemContainer.js";
import Cart from '../../model/cart.class.js';
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
    addProductToCart = async (cid, prod, qty) => {
        if(qty > prod.stock){// si la cantidad supera al stock del producto
            qty = prod.stock
        }
        let result = await this.getById(cid)// traigo el cart
        const cart = new Cart(result.id, result) // creo una instancia del la clase cart con el objeto cart

        if(cart.products.length===0){// no hay productos en el carrito
            cart.addProduct(prod.id, prod, qty)
            await this.update(cart.id, cart)// pongo el producto y la cantidad en el carrito
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
            await this.update(cart.id, cart)
        }
    }

    // delete a product from a cart
    // require cartID and productID
    deleteProductFromCart = async (cid, prod, pid) => {
        let result =  await this.getById(cid)// traigo el cart

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
            await this.update(cart.id, cart)
            return cart
        }
    }

    emptyCart = async (cid) => {
        let result = await this.getById(cid)
        const cart = new Cart(result.id, result) // creo una instancia del la clase cart con el objeto cart
        cart.empty()
        await this.update(cart.id, cart)
        return cart
    }

    getCartId = async (cid)=>{
        let cart = await this.getById(cid)
        let copyList = []
        for(const item of cart.products){
            copyList.push(
                {
                product: await productService.getById(item.id), // ------------------------ It hasnt been used XXXXXXXXXXXXXXXXXX
                quantity:item.quantity
                }
            )
        }
        cart.products = copyList
        return cart
    }

}