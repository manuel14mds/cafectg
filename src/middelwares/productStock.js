import persistenceFactory from "../dao/Factory.js"

export const stockValidator = async (req,res,next) => {
    try {
        const product = await persistenceFactory.ProductService.getById(req.body.pid)
        if(!product){
            return res.status(404).send({status:'not found', error:'Product not found'})
        }else if(product.stock < 1){
            return res.status(400).send({error:'bad request',message:'Product Without stock'})
        }
    } catch (error) {
        return res.status(500).send({error:'server error',message:"Couldn't validate product stock"})
    }
    next()
}