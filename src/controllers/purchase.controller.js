import persistenceFactory from "../dao/Factory.js"
import config from "../config/config.js"
import PurchaseDTO from '../dao/DTOs/DTOPurchasePopulate.js'
import { emailTransport, emailHTMLmaker } from "../utils.js"

const get = async (req,res)=>{
    const data = await persistenceFactory.PurchaseService.getAll()
    console.log(data)
    res.send({message:'success', payload: data})
}
const create = async (req,res)=>{
    //create a new purchase
    const purchaseID = await persistenceFactory.PurchaseService.create(req.params.cart)
    const purchase = await persistenceFactory.PurchaseService.getPopulate(purchaseID)

    // add new purchase to user
    const user = req.body.user
    user.purchases.push(purchaseID)
    await persistenceFactory.UserService.update(user.id, user)
    
    // mail purchase to user
    let html = emailHTMLmaker(purchase,user)
    let result = await emailTransport.sendMail({
        from:'Café Cartagena',
        to:user.email,
        subject:'Purchase Café Cartagena',
        html:html
    })

    // empty cart
    await persistenceFactory.CartService.emptyCart(req.params.cart.id)

    res.send({message:'success', payload: purchase})
}
const getById = async (req,res)=>{
    let purchase = await persistenceFactory.PurchaseService.getPopulate(req.params.purchase.id)
    if(config.app.PERSISTENCE != 'MONGODB'){
        const purchasePopulated = new PurchaseDTO(purchase.id, purchase)
        await purchasePopulated.populate()
        purchase = purchasePopulated
        const user = req.body.user
    }
    res.send({message:'success', payload: purchase})
}

export default {
    get,
    create,
    getById,
}