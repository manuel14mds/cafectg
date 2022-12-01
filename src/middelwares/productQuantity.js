import persistenceFactory from "../dao/Factory.js"

export const qtyValidator = async (req,res,next) => {
    const quantity = req.body.quantity
    if(isNaN(quantity)){
        try {
            quantity = parseInt(quantity)
            if(quantity < 1){
                return res.status(400).send({status:'Bad Request', error:"Quantity has a invalid value"})
            }
        } catch (error) {
            return res.status(400).send({status:'Bad Request', error:"Quantity has a invalid value"})
        }
    }
    next()
}