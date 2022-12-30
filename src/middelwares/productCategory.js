import { logger } from "../app.js"

// validate the product quantity to add or subs to cart 
export const prodCategoryValidator = async (req, res, next) => {
    const categories = ['all', 'co', 'pa', 'gt', 'jv', 'om', 'du', 'ev']
    if (!categories.includes(req.query.category)) {
        logger.warm(`Incorrect product category -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 300`)
        return res.status(300).send({ status: 'error', error: "Incorrect product category. must be: all, cop, pa, gt, jv, om, du, ev" })
    }
    next()
}