import persistenceFactory from "../dao/Factory.js"

const validatePid = async (req,res,next)=>{
    try {
        req.params.product = await persistenceFactory.ProductService.getById(req.params.pid)
        if(!req.params.product) return res.status(404).send({status:'error', error:'Product not found'})
    } catch (error) {
        return res.status(404).send({status:'error', error:'Product not found'})
    }
    next()
}
const validateCid = async (req,res,next)=>{
    try {
        req.params.cart = await persistenceFactory.CartService.getById(req.params.cid)
        if(!req.params.cart) return res.status(404).send({status:'error', error:'Cart not found'})
    } catch (error) {
        return res.status(300).send({status:'error', error:'Cart not found'})
    }
    next()
}
const validateBid = async (req,res,next)=>{
    try {
        req.params.purchase = await persistenceFactory.PurchaseService.getById(req.params.bid)
        if(!req.params.purchase) return res.status(404).send({status:'error', error:'Purchase not found'})
    } catch (error) {
        return res.status(300).send({status:'error', error:'Purchase not found'})
    }
    next()
}
const validateWid = async (req,res,next)=>{
    try {
        req.params.wishList = await persistenceFactory.WishListService.getById(req.params.wid)
        if(!req.params.wishList) return res.status(404).send({status:'error', error:'Wish List not found'})
        if(req.params.wishList._id) req.params.wishList.id = req.params.wishList._id 
    } catch (error) {
        return res.status(300).send({status:'error', error:'Wish List not found'})
    }
    next()
}

export {
    validateCid,
    validatePid,
    validateBid,
    validateWid,
}