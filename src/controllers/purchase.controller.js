import persistenceFactory from "../dao/Factory.js"
import ProductDTO from '../dao/DTOs/DTO.product.js'


const get = async (req,res)=>{
    const data = await persistenceFactory.PurchaseService.getAll()
    console.log(data)
    res.send({message:'success', payload: data})
}
const create = async (req,res)=>{
    const purchaseID = await persistenceFactory.PurchaseService.create(req.params.cart)
    const purchase = await persistenceFactory.PurchaseService.getPopulate(purchaseID)
    res.send({message:'success', payload: purchase})
}
const getById = async (req,res)=>{
    const purchase = await persistenceFactory.PurchaseService.getPopulate(req.params.purchase.id)
    res.send({message:'success', payload: purchase})
}

export default {
    get,
    create,
    getById,

}