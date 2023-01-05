import { logger } from '../app.js'
import persistenceFactory from '../dao/Factory.js'
import __dirname from "../utils.js"

// get all carts
const getCarts = async (req, res) => {
    try {
        let cart = await persistenceFactory.CartService.getAll()
        res.send(cart)
    } catch (error) {
        logger.error(`Couldn't get all carts' -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            cart.controller: getCarts`)
        return res.status(500).send({ status: 'error', error: "Couldn't get all carts" })
    }
}

// create one cart
const createOne = async (req, res) => {
    try {
        await persistenceFactory.CartService.create()
        res.send({ status: 'success', message: 'successfully created' })
    } catch (error) {
        logger.error(`Cart couldn't been created' -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            cart.controller: createOne`)
        return res.status(500).send({ status: 'error', error: "Cart couldn't been created" })
    }
}

// delete cart by ID
const deleteById = async (req, res) => {
    try {
        await persistenceFactory.CartService.deleteById(req.params.cid)
        res.send({ status: 'success', message: 'successfully deleted' })
    } catch (error) {
        logger.error(`cart couldn't been deleted' -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
        ${error}
        cart.controller: deleteById`)
        return res.status(500).send({ status: 'error', error: "cart couldn't been deleted" })
    }
}

// get cart populated
const getWhole = async (req, res) => {
    try {
        let report = []
        let cart = await persistenceFactory.CartService.getById(req.params.cid)
        let productList = {}
        for (let element of cart.products) {
            productList = {
                product: await persistenceFactory.ProductService.getById(element.id),
                quantity: element.quantity
            }
            report.push(productList)
        }
        res.send(report)
    } catch (error) {
        logger.error(`Products couldn't be listed' -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            cart.controller: getWhole`)
        return res.status(500).send({ status: 'error', error: "Products couldn't be listed" })
    }
}

// add products to cart
const addProducts = async (req, res) => {
    const { pid, quantity } = req.body
    const { cartId } = req.body.user

    if (!pid || !quantity) {
        return res.status(300).send({ status: 'error', error: "blank spaces are NOT allowed" })
    } else {
        try {
            const product = await persistenceFactory.ProductService.getById(pid)
            if (product) {
                await persistenceFactory.CartService.addProductToCart(cartId, product, parseInt(quantity))
                const cart = await persistenceFactory.CartService.getCart(cartId)
                return res.send({ status: 'success', message: 'successfully saved into the cart', cart })
            } else {
                return res.status(404).send({ status: 'Not found', message: 'Product not found' })
            }
        } catch (error) {
            logger.error(`Couldn't upload the product into the cart' -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            cart.controller: addProducts`)
            return res.status(500).send({ status: 'error', error: "it couldn't upload the product into the cart" })
        }
    }
}

// delete product to cart
const deleteProduct = async (req, res) => {
    try {
        const product = await persistenceFactory.ProductService.getById(req.params.pid)
        const cart = await persistenceFactory.CartService.deleteProductFromCart(req.params.cid, product, req.params.pid)
        res.send({ status: 'success', message: 'successfully deleted from cart', cart: cart })
    } catch (error) {
        logger.error(`Couldn't delete the product from the cart' -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            cart.controller: deleteProduct`)
        return res.status(500).send({ status: 'error', error: "it couldn't delete the product from the cart" })
    }
}

// empty cart by ID
const emptyCart = async (req, res) => {
    try {
        const cart = await persistenceFactory.CartService.emptyCart(req.params.cid)
        res.send({ status: 'success', message: 'successfully deleted', cart: cart })
    } catch (error) {
        logger.error(`Couldn't empty cart -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            cart.controller: emptyCart`)
        return res.status(500).send({ status: 'error', error: "it couldn't empty cart" })
    }
}

// get cart By ID
const getById = async (req, res) => {
    try {
        const cart = await persistenceFactory.CartService.getById(req.params.cid)
        res.send({ status: 'success', payload: cart })
    } catch (error) {
        logger.error(`Couldn't get the cart -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            cart.controller: getById`)
        return res.status(500).send({ status: 'error', error: "Couldn't get the cart" })
    }
}


export default {
    getCarts,
    createOne,
    deleteById,
    getWhole,
    addProducts,
    deleteProduct,
    emptyCart,
    getById,
}