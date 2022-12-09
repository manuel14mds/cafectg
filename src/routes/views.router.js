import { Router } from 'express'
import persistenceFactory from '../dao/Factory.js'
import config from '../config/config.js'
import jwt from 'jsonwebtoken'
import {loginValidater} from '../middelwares/authUser.js'
import CartPopulateDTO from '../dao/DTOs/DTOcartPopulate.js'
import UserDTO from '../dao/DTOs/DTOuser.js'

const router = Router()

router.get('/', (req,res)=>{//bien
    const token = req.cookies[config.jwt.COOKIE]
    if(!token) return res.render('index', {user:false})
    const user = jwt.verify(token, config.jwt.SECRET)
    res.render('index', {user})
})

router.get('/login', (req,res)=>{//bien
    res.render('login')
})

router.get('/register', (req,res)=>{//bien
    res.render('register')
})

router.get('/cart', loginValidater,async(req,res)=>{//bien
    let cart = await persistenceFactory.CartService.getCart(req.body.user.cartId)

    if(config.app.PERSISTENCE != 'MONGODB'){
        const cartPopulated = new CartPopulateDTO(cart.id, cart)
        cartPopulated.populate()
        cart = cartPopulated
    }
    
    res.render('cart',{cart})
})

router.get('/productDetail/:pid', async(req,res)=>{//bien
    try {
        let product = await persistenceFactory.ProductService.getById(req.params.pid)
        res.render('detail',{product})
    } catch (error) {
        res.status(500).send('internal error')
    }
})

router.get('/account', loginValidater, async(req,res)=>{//bien
    const user = new UserDTO(req.body.user.id, req.body.user)
    res.render('account',{user})
})

router.get('/category', async(req,res)=>{//bien
    const ctg = req.query.category
    if(ctg === 'all'){
        let products = await persistenceFactory.ProductService.getAll()
        res.render('category',{products})
    }else{
        let products = await persistenceFactory.ProductService.findByCategory(ctg)
        res.render('category',{products})
    }
})

export default router