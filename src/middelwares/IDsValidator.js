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
    } catch (error) {
        return res.status(300).send({status:'error', error:'Invalid id'})
    }
    if(!req.params.cart) return res.status(404).send({status:'error', error:'Cart not found'})
    next()
}

export {
    validateCid,
    validatePid,
}