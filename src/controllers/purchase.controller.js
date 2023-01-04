import persistenceFactory from "../dao/Factory.js"
import PurchaseDTO from '../dao/DTOs/DTOPurchasePopulate.js'
import config from "../config/config.js"
import { emailTransport, emailHTMLmaker } from "../utils.js"

import { logger } from "../app.js"

// get all purchases
const get = async (req, res) => {
    try {
        const data = await persistenceFactory.PurchaseService.getAll()
        res.send({ message: 'success', payload: data })
    } catch (error) {
        logger.error(`Couldn't get all purchases -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            purchase.controller: get`)
        return res.status(500).send({ status: 'error', error: "Couldn't get all purchases" })
    }
}

// create a new purchase
const create = async (req, res) => {
    try {
        //create a new purchase
        const purchaseID = await persistenceFactory.PurchaseService.create(req.params.cart)
        let purchase = await persistenceFactory.PurchaseService.getPopulate(purchaseID)
        if (config.app.PERSISTENCE != 'MONGODB') {
            const purchasePopulated = new PurchaseDTO(purchase.id, purchase)
            await purchasePopulated.populate()
            purchase = purchasePopulated
        }

        // add new purchase to user
        const user = req.body.user
        user.purchases.push(purchaseID)
        await persistenceFactory.UserService.update(user.id, user)

        // mail purchase to user
        let html = emailHTMLmaker(purchase, user)
        let result = await emailTransport.sendMail({
            from: 'Café Cartagena',
            to: user.email,
            subject: 'Purchase Café Cartagena',
            html: html
        })

        //decrese product qty 
        await persistenceFactory.ProductService.purchaseSubst(req.params.cart)

        // empty cart
        await persistenceFactory.CartService.emptyCart(req.params.cart.id)
        res.send({ message: 'success', payload: purchase })
    } catch (error) {
        logger.error(`Couldn't create a new purchases successfully -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            purchase.controller: create`)
        return res.status(500).send({ status: 'error', error: "Couldn't create a new purchases successfully" })
    }
}

// get a purchase by ID
const getById = async (req, res) => {
    try {
        let purchase = await persistenceFactory.PurchaseService.getPopulate(req.params.purchase.id)
        if (config.app.PERSISTENCE != 'MONGODB') {
            const purchasePopulated = new PurchaseDTO(purchase.id, purchase)
            await purchasePopulated.populate()
            purchase = purchasePopulated
        }
        res.send({ message: 'success', payload: purchase })
    } catch (error) {
        logger.error(`Couldn't get purchase -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            purchase.controller: getById`)
        return res.status(500).send({ status: 'error', error: "Couldn't get purchase" })
    }
}

export default {
    get,
    create,
    getById,
}