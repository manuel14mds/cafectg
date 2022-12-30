import persistenceFactory from "../dao/Factory.js"
import { logger } from "../app.js"

//validate product ID
const validatePid = async (req, res, next) => {
    try {
        req.params.product = await persistenceFactory.ProductService.getById(req.params.pid)
        if (!req.params.product) return res.status(404).send({ status: 'error', error: 'Product not found' })
    } catch (error) {
        logger.warn(`Product not found error' -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 404`)
        return res.status(404).send({ status: 'error', error: 'Product not found' })
    }
    next()
}

// validate cart ID
const validateCid = async (req, res, next) => {
    try {
        req.params.cart = await persistenceFactory.CartService.getById(req.params.cid)
        if (!req.params.cart) return res.status(404).send({ status: 'error', error: 'Cart not found' })
    } catch (error) {
        logger.warn(`Cart not found error' -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 404`)
        return res.status(404).send({ status: 'error', error: 'Cart not found' })
    }
    next()
}

// validate purchase ID (BuyID)
const validateBid = async (req, res, next) => {
    try {
        req.params.purchase = await persistenceFactory.PurchaseService.getById(req.params.bid)
        if (!req.params.purchase) return res.status(404).send({ status: 'error', error: 'Purchase not found' })
    } catch (error) {
        logger.warn(`Purchase not found error' -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 404`)
        return res.status(404).send({ status: 'error', error: 'Purchase not found' })
    }
    next()
}

// validate wishList ID
const validateWid = async (req, res, next) => {
    try {
        req.params.wishList = await persistenceFactory.WishListService.getById(req.params.wid)
        if (!req.params.wishList) return res.status(404).send({ status: 'error', error: 'WishList not found' })
    } catch (error) {
        logger.warn(`WishList not found' -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 404`)
        return res.status(404).send({ status: 'error', error: 'WishList not found' })
    }
    next()
}

export {
    validateCid,
    validatePid,
    validateBid,
    validateWid,
}