import { Router } from 'express'
import services from '../dao/index.js'
import config from '../config/config.js'
import jwt from 'jsonwebtoken'

const router = Router()

router.get('/', (req,res)=>{
    const token = req.cookies[config.jwt.COOKIE]
    if(!token) return res.render('index', {user:false})
    const user = jwt.verify(token, config.jwt.SECRET)
    res.render('index', {user})
})

router.get('/login', (req,res)=>{
    res.render('login')
})

router.get('/register', (req,res)=>{
    res.render('register')
})
/* router.post('/addToCard', (req,res)=>{
    res.render('register')
}) */
router.get('/cart', async(req,res)=>{
    const token = req.cookies[config.jwt.COOKIE]
    if(!token) return res.render('account', {user:false})
    const user = jwt.verify(token, config.jwt.SECRET)
    const wholeUser = await services.UserService.getByEmail(user.email)
    const cart = await services.CartService.getCartId(wholeUser.cartId)
    console.log('cart:', cart)
    res.render('cart',{cart})
})

router.get('/productDetail/:pid', async(req,res)=>{
    console.log('id:', req.params.pid)
    try {
        let product = await services.ProductService.getById(req.params.pid)
        res.render('detail',{product})
        
    } catch (error) {
        res.status(500).send('insternal error')
    }
})

router.get('/account', (req,res)=>{
    const token = req.cookies[config.jwt.COOKIE]
    if(!token) return res.render('account', {user:false})
    const user = jwt.verify(token, config.jwt.SECRET)
    res.render('account',{user})
})

router.get('/category', async(req,res)=>{
    const ctg = req.query.category
    if(ctg === 'all'){
        let products = await services.ProductService.getAll()
        res.render('category',{products})
    }else{
        let products = await services.ProductService.findByCategory(ctg)
        res.render('category',{products})
    }
})

export default router