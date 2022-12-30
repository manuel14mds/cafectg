import { logger } from "../app.js"

// validate the product quantity to add or subs to cart 
export const qtyValidator = async (req, res, next) => {
    const quantity = req.body.quantity
    if (isNaN(quantity)) {
        try {
            quantity = parseInt(quantity)
            if (quantity = 0) {
                return res.status(400).send({ status: 'Bad Request', error: "Quantity has a invalid value" })
            }
        } catch (error) {
            logger.warn(`Product quantity has a invalid value' -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 400`)
            return res.status(400).send({ status: 'Bad Request', error: "Quantity has a invalid value" })
        }
    }
    next()
}