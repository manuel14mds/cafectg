import { logger } from "../app.js"

// validate the product quantity to add or subs to cart 
export const prodBodyValidator = async (req, res, next) => {
    const { name, price, stock } = req.body
    if (!name || !price || !stock || (typeof price != 'number')) {
        logger.warm(`Product body properties incorrect -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 300`)
        return res.status(300).send({ status: 'error', error: "Product body properties not enough or incorrect: name, price & stock" })
    }
    next()
}