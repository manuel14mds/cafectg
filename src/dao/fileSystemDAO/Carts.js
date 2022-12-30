import FileSystemContainer from "./FileSystemContainer.js";
import __dirname from '../../utils.js'
import CartDTO from '../DTOs/DTOcart.js'

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
        cart.total = 0
        await this.save(cart)
        return cart
    }

    //add a product into cart
    addProductToCart = async (cid, prod, qty) => {
        if(qty > prod.stock){
            qty = prod.stock
        }
        let result = await this.getById(cid)
        const cart = new CartDTO(result.id, result)

        if(cart.products.length===0){
            cart.addProduct(prod.id, prod, qty)
            await this.update(cart.id, cart)
            return cart
        }else{
            let result = cart.products.some((item)=>{
                return item.product === prod.id
            })

            if(result){
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
        let result =  await this.getById(cid)
        const cart = new CartDTO(result.id, result)
        
        if(cart.products.length===0){
            return cart
        }else{
            let result = cart.products.some((item)=>{
                return item.product == prod.id
            })
            if(result){
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
        const cart = new CartDTO(result.id, result)
        cart.empty()
        await this.update(cart.id, cart)
        return cart
    }

    getCart = async (cid)=>{
        const result = await this.getById(cid)
        const cart = new CartDTO(result.id, result)
        return cart
    }

}