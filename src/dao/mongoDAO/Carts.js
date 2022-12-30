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
        const carts = data.map(cart => new CartDTO(cart._id, cart))
        return carts
    }

    addProductToCart = async (cid, prod, qty) => {
        if(qty > prod.stock){
            qty = prod.stock
        }
        let result = await this.getById(cid)

        const cart = new CartDTO(result.id, result)
        if(prod._id) prod.id=prod._id.toString()
        
        if(cart.products.length===0){
            cart.addProduct(prod.id, prod, qty)
            await this.update(cart.id, cart)
            return cart
        }else{
            let product

            let result = cart.products.some((item)=>{
                product = item.product.toString()
                return product === prod.id
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
    // require cartID , product and productID
    deleteProductFromCart = async (cid, prod, pid) => {
        let result = await this.getById(cid)
        result.id = result._id
        const cart = new CartDTO(result.id, result)
        prod.id=prod._id.toString()
        
        if(cart.products.length===0){
            return cart
        }else{
            let product
            
            let result = cart.products.some((item)=>{
                product = item.product.toString()
                return product === prod.id
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

    //empty cart
    emptyCart = async (cid) => {
        let result = await this.getById(cid)
        const cart = new CartDTO(result.id, result)
        cart.empty()
        this.update(cart.id, cart)
        return cart
    }

    // return a cart populated
    getCart = async (id)=>{
        let result = await this.modelService.findOne({_id:id}).lean().populate('products.product')
        const cart = new CartDTO(result._id, result)
        return cart
    }

    // return al carts 
    getById = async (id)=>{
        let result = await this.modelService.findOne({_id:id}).lean()
        const cart = new CartDTO(result._id, result)
        return cart
    }
    
}