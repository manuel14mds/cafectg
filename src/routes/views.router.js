import { Router } from 'express'
import jwt from 'jsonwebtoken'

import config from '../config/config.js'

import persistenceFactory from '../dao/Factory.js'

import PurchaseDTO from '../dao/DTOs/DTOPurchasePopulate.js'
import CartPopulateDTO from '../dao/DTOs/DTOcartPopulate.js'
import UserDTO from '../dao/DTOs/DTOuser.js'

import { loginValidater, onlyAdmin } from '../middelwares/authUser.js'
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
// redirect to the admin login page
router.get('/loginadmin', (req, res) => {
    res.render('loginadmin')
})

// redirect to the register page
router.get('/register', (req, res) => {
    res.render('register')
})

// redirect to the addProduct page
router.get('/addProduct', userHelper, async(req, res) => {
    const user = req.body.user
    res.render('addProduct', {user})
})

// render the cart user page
router.get('/cart/:cid', userValidater, loginValidater, async (req, res) => {
    try {
        const user = req.body.user
        if(!req.params.cid){
            return res.status(400).send({error:'bad request', message:'blank cart id params'})

        }else {
            let cart = await persistenceFactory.CartService.getCart(req.params.cid)
            if(!cart){
                return res.status(404).send({error:'not found', message:'cart not found'})
            }

            if (config.app.PERSISTENCE != 'MONGODB') {
                const cartPopulated = new CartPopulateDTO(cart.id, cart)
                cartPopulated.populate()
                cart = cartPopulated
            }
            res.render('cart', { cart, user })
        }

    } catch (error) {
        logger.error(`couldn't get view URL: ${req.originalUrl} error 500 :${error}`)
        res.render('error',{message:`couldn't get view URL: ${req.originalUrl} || CART`});
    }
})

// render the product detail page
router.get('/productDetail/:pid', userHelper,async (req, res) => {
    try {
        const user = req.body.user
        let product = await persistenceFactory.ProductService.getById(req.params.pid)
        res.render('detail', { product, user })
    } catch (error) {
        logger.error(`couldn't get view URL: ${req.originalUrl} error 500:${error}`)
        res.render('error',{message:`couldn't get view URL: ${req.originalUrl} || PRODUCT DETAIL`});
    }
})

// render a purchase resume page
router.get('/resume/purchase/:bid', validateBid, userHelper,async (req, res) => {
    try {
        const user = req.body.user
        let purchase = await persistenceFactory.PurchaseService.getPopulate(req.params.purchase.id)
        if (config.app.PERSISTENCE != 'MONGODB') {
            const purchasePopulated = new PurchaseDTO(purchase.id, purchase)
            await purchasePopulated.populate()
            purchase = purchasePopulated
        }
        res.render('purchase', { purchase, user})
    } catch (error) {
        logger.error(`couldn't get view URL: ${req.originalUrl} error 500:${error}`)
        res.render('error',{message:`couldn't get view URL: ${req.originalUrl} || PURCHASE RESUME`});
    }
})

// render the user account page
router.get('/account', userValidater, loginValidater, async (req, res) => {
    try {
        let user = req.body.user
        if(!req.body.user.admin){
            user = new UserDTO(req.body.user.id, req.body.user)
        }
        res.render('account', { user })
    } catch (error) {
        logger.error(`couldn't get view URL: ${req.originalUrl} error 500:${error}`)
        res.render('error',{message:`couldn't get view URL: ${req.originalUrl} || USER ACCOUNT`});
    }
})

// render the category product list page
router.get('/category', prodCategoryValidator, userHelper ,async (req, res) => {
    try {
        const ctg = req.query.category
        const user = req.body.user
        if (ctg === 'all') {
            let products = await persistenceFactory.ProductService.getAll()
            res.render('category', { products, ctg, category:'All Products', user})
        } else {
            let data = await persistenceFactory.ProductService.findByCategory(ctg)
            res.render('category', { products:data.products, ctg, category:data.category, user})
        }
    } catch (error) {
        logger.error(`couldn't get view URL: ${req.originalUrl} || error 500:${error}`)
        res.render('error',{message:`couldn't get view URL: ${req.originalUrl} || PRODUCT CATEGORY LIST`});
    }
})

/*           +++++++++++++++++++               admin views routes         +++++++++++++++++++                      */
// get all products
router.get('/products', loginValidater, onlyAdmin, async (req, res) => {
    try {
        const user = req.body.user
        let products = await persistenceFactory.ProductService.getAll()

        if (products.length == 0) {
            products = false
            let products = await persistenceFactory.ProductService.getAll()
            res.render('admProducts', { products, user})
        } else {
            let products = await persistenceFactory.ProductService.getAll()
            products = products.reverse()
            res.render('admProducts', { products, user})
        }
    } catch (error) {
        logger.error(`couldn't get view URL: ${req.originalUrl} || error 500:${error}`)
        res.render('error',{message:`couldn't get view URL: ${req.originalUrl} || ADMIN GET ALL PRODUCTS`});
    }
})

// get all users
router.get('/users', loginValidater, onlyAdmin, async (req, res) => {
    try {
        const user = req.body.user
        let users = await persistenceFactory.UserService.getAll()
        users = users.map(item=>item=new UserDTO(item.id, item))

        if (users.length == 0) {
            users = false
            res.render('admUsers', { users, user})
        } else {
            users = users.reverse()
            res.render('admUsers', { users, user})
        }
    } catch (error) {
        logger.error(`couldn't get view URL: ${req.originalUrl} || error 500:${error}`)
        res.render('error',{message:`couldn't get view URL: ${req.originalUrl} || ADMIN GET ALL USERS`});
    }
})

// get all carts
router.get('/carts', loginValidater, onlyAdmin, async (req, res) => {
    try {
        const user = req.body.user
        let carts = await persistenceFactory.CartService.getAll()

        if (carts.length == 0) {
            carts = false
            res.render('admCarts', { carts, user})
        } else {
            carts = carts.reverse()
            res.render('admCarts', { carts, user})
        }
    } catch (error) {
        logger.error(`couldn't get view URL: ${req.originalUrl} || error 500:${error}`)
        res.render('error',{message:`couldn't get view URL: ${req.originalUrl} || ADMIN GET ALL CARTS`});
    }
})

// get all purchases
router.get('/purchases', loginValidater, onlyAdmin, async (req, res) => {
    try {
        const user = req.body.user
        let purchases = await persistenceFactory.PurchaseService.getAll()
        if (purchases.length == 0) {
            purchases = false
            res.render('admPurchases', { purchases, user})
        } else {
            purchases = purchases.reverse()
            res.render('admPurchases', { purchases, user})
        }
    } catch (error) {
        logger.error(`couldn't get view URL: ${req.originalUrl} || error 500:${error}`)
        res.render('error',{message:`couldn't get view URL: ${req.originalUrl} || ADMIN GET ALL PURCHASES`});
    }
})

// get all wishlists
router.get('/wishlists', loginValidater, onlyAdmin, async (req, res) => {
    try {
        const user = req.body.user
        let wishlists = await persistenceFactory.WishListService.getAll()

        if (wishlists.length == 0) {
            wishlists = false
            res.render('admWishlists', { wishlists, user})
        } else {
            wishlists = wishlists.reverse()
            res.render('admWishlists', { wishlists, user})
        }
    } catch (error) {
        logger.error(`couldn't get view URL: ${req.originalUrl} || error 500:${error}`)
        res.render('error',{message:`couldn't get view URL: ${req.originalUrl} || ADMIN GET ALL WISHLISTS`});
    }
})



async function userValidater(req, res, next) {
    const token = req.cookies[config.jwt.COOKIE]
    if (!token) return res.render('account', { user: false })
    next()
}
async function userHelper(req, res, next) {
    const admins = [
        {name:'UserAdmin1', email:'admin@mail.com', id:'a1', password:'Admin123', admin:true},
    ]
    const token = req.cookies[config.jwt.COOKIE]

    if (!token) {
        req.body.user = false
        return next()
    }
    const user = jwt.verify(token, config.jwt.SECRET)

    let admin = admins.find((e) => e.id == user.id)
    if(admin){
        delete admin.password
        req.body.user = admin
    }else{
        const wholeUser = await persistenceFactory.UserService.getByEmail(user.email)
        req.body.user = wholeUser
    }
    next()
}


export default router