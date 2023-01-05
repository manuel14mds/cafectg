import persistenceFactory from "../dao/Factory.js"
import { logger } from "../app.js"

// validate if a product has stock
export const stockValidator = async (req, res, next) => {
    try {
        const product = await persistenceFactory.ProductService.getById(req.body.pid)
        if (!product) {
            //logger.warn(`Product not found -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 404: ${error}`)
            return res.status(404).send({ status: 'not found', error: 'Product not found' })
        } else if (product.stock < 1) {
            //logger.warn(`Product Without stock' -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 400`)
            return res.status(400).send({ error: 'bad request', message: 'Product Without stock' })
        }
    } catch (error) {
        //logger.warm(`Product quantity has a invalid value -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500: ${error}`)
        return res.status(500).send({ error: 'server error', message: "Couldn't validate product stock" })
    }
    next()
}