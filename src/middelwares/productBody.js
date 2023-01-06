import { logger } from "../app.js"

// validate the product quantity to add or subs to cart 
export const prodBodyValidator = async (req, res, next) => {
    let { name, price, stock } = req.body
    try {
        if (!name || !price || !stock) {
            logger.warn(`Product body properties incorrect -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 300`)
            return res.status(300).send({ status: 'error', error: "Product body properties not enough or incorrect: name, price & stock" })
        }else{
            req.body.stock = Number(stock)
            req.body.price = Number(price)
        }
    } catch (error) {
        return res.status(500).send({ status: 'error', error: "Product body properties not enough or incorrect: name, price & stock" })
    }
    next()
}