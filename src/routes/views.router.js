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

router.get('/cart', async(req,res)=>{
    const token = req.cookies[config.jwt.COOKIE]
    if(!token) return res.render('account', {user:false})
    const user = jwt.verify(token, config.jwt.SECRET)
    const wholeUser = await services.UserService.getByEmail(user.email)
    let cart = await services.CartService.getCartId(wholeUser.cartId)
    let total = 0
    cart.products.forEach(element => {
        total += element.product.price * element.qty
    })
    res.render('cart',{cart,total})
})
/* router.get('/cart', async(req,res)=>{
    const token = req.cookies[config.jwt.COOKIE]
    if(!token) return res.render('account', {user:false})
    const user = jwt.verify(token, config.jwt.SECRET)
    const wholeUser = await services.UserService.getByEmail(user.email)
    let cart = await services.CartService.getCartId(wholeUser.cartId)
    let newArray=[]
    let total = 0
    for (const item of cart[0].products) {
        let product = await services.ProductService.getById(item.product)
        total += product.price * item.qty
        newArray.push({qty:item.qty, product:product})
    }
    let newCart = {_id:wholeUser.cartId, newArray, totalQty:total}

    res.render('cart',{newCart})
}) */

router.get('/productDetail/:pid', async(req,res)=>{

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