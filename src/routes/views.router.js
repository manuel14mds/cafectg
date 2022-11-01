import { Router } from 'express'
import services from '../dao/index.js'

const router = Router()

router.get('/', (req,res)=>{
    res.render('index')
})
router.get('/login', (req,res)=>{
    res.render('login')
})
router.get('/register', (req,res)=>{
    res.render('register')
})
router.get('/account', (req,res)=>{
    //if(!req.session.user) return res.send("Logeate")
    res.render('account')
})
router.get('/category', async(req,res)=>{
    if(req.query.category === 'all'){
        let products = await services.ProductService.getAll()
        console.log(products)
        res.render('category',{products})
    }else{
        res.render('category',{})
    }
})

export default router