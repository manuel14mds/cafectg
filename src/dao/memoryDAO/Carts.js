import MemoryContainer from "./MemoryContainer.js";
import CartDTO from '../DTOs/DTOcart.js'

export default class Carts extends MemoryContainer {
    constructor() {
        super()
    }
    create = () => {
        let cart = {}
        if (this.data.length === 0) {
            cart.id = 1
            cart.time_stamp = Date.now().toLocaleString()
        } else {
            cart.id = this.data[this.data.length - 1].id + 1
            cart.time_stamp = Date.now().toLocaleString()
        }
        cart.products = []
        cart.total = 0
        this.save(cart)
        return cart
    }

    addProductToCart = (cid, prod, qty) => {
        if (qty > prod.stock) {
            qty = prod.stock
        }
        let result = this.getById(cid)
        const cart = new CartDTO(result.id, result)

        if (cart.products.length === 0) {
            cart.addProduct(prod.id, prod, qty)
            this.update(cart.id, cart)
            return cart
        } else {

            let result = cart.products.some((item) => {
                return item.product == prod.id
            })

            if (result) {
                cart.addQty(prod.id, prod, qty)
            } else {
                cart.addProduct(prod.id, prod, qty)
            }
            this.update(cart.id, cart)
        }
    }

    // delete a product from a cart
    // require cartID and productID
    deleteProductFromCart = (cid, prod, pid) => {
        let result = this.getById(cid)
        const cart = new CartDTO(result.id, result)

        if (cart.products.length === 0) {
            return cart
        } else {
            let result = cart.products.some((item) => {
                return item.product == prod.id
            })

            if (result) {
                cart.removeProduct(pid, prod)
            } else {
                return cart
            }
            this.update(cart.id, cart)
            return cart
        }
    }

    //empty cart
    emptyCart = async (cid) => {
        let result = this.getById(cid)
        const cart = new CartDTO(result.id, result)
        cart.empty()
        this.update(cart.id, cart)
        return cart
    }

    getCart = async (cid) => {
        const result = this.getById(cid)
        const cart = new CartDTO(result.id, result)
        return cart
    }
}