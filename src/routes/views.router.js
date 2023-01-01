import { Router } from 'express'
import jwt from 'jsonwebtoken'

import config from '../config/config.js'

import persistenceFactory from '../dao/Factory.js'

import PurchaseDTO from '../dao/DTOs/DTOPurchasePopulate.js'
import CartPopulateDTO from '../dao/DTOs/DTOcartPopulate.js'
import UserDTO from '../dao/DTOs/DTOuser.js'

import { loginValidater } from '../middelwares/authUser.js'
import { validateBid } from '../middelwares/IDsValidator.js'
import { prodCategoryValidator } from '../middelwares/productCategory.js'

import { logger } from '../app.js'

const router = Router()

// render the home page
router.get('/', (req, res) => {
    try {
        const token = req.cookies[config.jwt.COOKIE]
        if (!token) return res.render('index', { user: false })
        const user = jwt.verify(token, config.jwt.SECRET)
        res.render('index', { user })
    } catch (error) {
        logger.error(`couldn't get view URL: ${req.originalUrl} error 500:${error}`)
        res.render('error',{message:`couldn't get view URL: ${req.originalUrl} || Home`});
    }
})

// redirect to the login page
router.get('/login', (req, res) => {
    res.render('login')
})

// redirect to the register page
router.get('/register', (req, res) => {
    res.render('register')
})

// render the cart user page
router.get('/cart', userValidater, loginValidater, async (req, res) => {
    try {
        let cart = await persistenceFactory.CartService.getCart(req.body.user.cartId)

        if (config.app.PERSISTENCE != 'MONGODB') {
            const cartPopulated = new CartPopulateDTO(cart.id, cart)
            cartPopulated.populate()
            cart = cartPopulated
        }

        res.render('cart', { cart })
    } catch (error) {
        logger.error(`couldn't get view URL: ${req.originalUrl} error 500 :${error}`)
        res.render('error',{message:`couldn't get view URL: ${req.originalUrl} || CART`});
    }
})

// render the product detail page
router.get('/productDetail/:pid', async (req, res) => {
    try {
        let product = await persistenceFactory.ProductService.getById(req.params.pid)
        res.render('detail', { product })
    } catch (error) {
        logger.error(`couldn't get view URL: ${req.originalUrl} error 500:${error}`)
        res.render('error',{message:`couldn't get view URL: ${req.originalUrl} || PRODUCT DETAIL`});
    }
})

// render a purchase resume page
router.get('/resume/purchase/:bid', validateBid, async (req, res) => {
    try {
        let purchase = await persistenceFactory.PurchaseService.getPopulate(req.params.purchase.id)
        if (config.app.PERSISTENCE != 'MONGODB') {
            const purchasePopulated = new PurchaseDTO(purchase.id, purchase)
            await purchasePopulated.populate()
            purchase = purchasePopulated
        }
        res.render('purchase', { purchase })
    } catch (error) {
        logger.error(`couldn't get view URL: ${req.originalUrl} error 500:${error}`)
        res.render('error',{message:`couldn't get view URL: ${req.originalUrl} || PURCHASE RESUME`});
    }
})

// render the user account page
router.get('/account', userValidater, loginValidater, async (req, res) => {
    try {
        const user = new UserDTO(req.body.user.id, req.body.user)
        res.render('account', { user })
    } catch (error) {
        logger.error(`couldn't get view URL: ${req.originalUrl} error 500:${error}`)
        res.render('error',{message:`couldn't get view URL: ${req.originalUrl} || USER ACCOUNT`});
    }
})

// render the category product list page
router.get('/category', prodCategoryValidator, async (req, res) => {
    try {
        const ctg = req.query.category

        if (ctg === 'all') {
            let products = await persistenceFactory.ProductService.getAll()
            res.render('category', { products, ctg, category:'All Products'})
        } else {
            let data = await persistenceFactory.ProductService.findByCategory(ctg)
            res.render('category', { products:data.products, ctg, category:data.category })
        }
    } catch (error) {
        logger.error(`couldn't get view URL: ${req.originalUrl} || error 500:${error}`)
        res.render('error',{message:`couldn't get view URL: ${req.originalUrl} || PRODUCT CATEGORY LIST`});
    }
})


async function userValidater(req, res, next) {
    const token = req.cookies[config.jwt.COOKIE]
    if (!token) return res.render('account', { user: false })
    next()
}


export default router