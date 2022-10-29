import { Router } from 'express'

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
    res.render('account')
})

export default router