import purchaseModelService from '../../models/Purchases.model.js'
import MongoContainer from "./MongoContainer.js";
import ProductDTO from '../DTOs/DTO.product.js'
export default class Purchases extends MongoContainer{
    constructor(){
        super()
        this.modelService = purchaseModelService
    }
    getAll = async () => {
        let data =  await this.modelService.find().lean()
        return data
    }
    create = async (cart) => {
        let newPurchase = {}
        newPurchase.products = cart.products
        newPurchase.total = cart.total
        const purchaseId =  await this.modelService.create(newPurchase)
        return purchaseId
    }
    getPopulate = async (id) => {
        let result = await this.modelService.findOne({_id:id}).lean().populate('products.product')
        const products = result.products.map(item => {
            return {product : new ProductDTO(item.product._id, item.product), qty: item.qty}
        })
        result.id = result._id
        result.products = products
        return result
    }

}