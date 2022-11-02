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
        console.log(products)
        res.render('category',{products})
    }else{
        let products = await services.ProductService.findByCategory(ctg)
        res.render('category',{products})
    }
})

export default router