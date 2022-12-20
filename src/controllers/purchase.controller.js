import persistenceFactory from "../dao/Factory.js"
import config from "../config/config.js"
import PurchaseDTO from '../dao/DTOs/DTOPurchasePopulate.js'

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
    let purchase = await persistenceFactory.PurchaseService.getPopulate(req.params.purchase.id)
    if(config.app.PERSISTENCE != 'MONGODB'){
        const purchasePopulated = new PurchaseDTO(purchase.id, purchase)
        await purchasePopulated.populate()
        purchase = purchasePopulated
    }
    res.send({message:'success', payload: purchase})
}

export default {
    get,
    create,
    getById,
}