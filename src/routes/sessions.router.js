import { Router } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
//import config from '../config/config.js'

const router = Router()

router.post('/login', passport.authenticate('login', {session:false}), async(req,res)=>{
    const loginUser = {
        role:req.user.role,
        name:req.user.name,
        last_name:req.user.last_name,
        address:req.user.address,
        phone:req.user.phone,
        age:req.user.age,
    }
    const token = jwt.sign(loginUser, config.jwt.SECRET, {expiresIn:300})
    res.cookie(config.jwt.COOKIE,token,{maxAge:300000,httpOnly:true}).redirect('/')
    
})
router.get('/logout', async(req,res)=>{
    const token = req.cookies[config.jwt.COOKIE]
    res.cookie(config.jwt.COOKIE,token,{maxAge:1,httpOnly:true}).redirect('/')
})
router.get('/current', async(req,res)=>{
    try {
        const token = req.cookies[config.jwt.COOKIE]
        if(!token) return res.redirect('/')
        const user = jwt.verify(token, config.jwt.SECRET)
        res.send({status:"success", info:user})
    } catch (error) {
        if(error.expiredAt){
            res.status(300).send({status:"error", error:"token expired"})
        }
    }
})

router.post('/register', passport.authenticate('register', {session:false}), async(req,res)=>{
    res.status(200).send('result')
})

router.get('/google',passport.authenticate('google',{session:false,scope:['email','profile']}),async(req,res)=>{})

router.get('/googlecallback',passport.authenticate('google',{session:false}),(req,res)=>{
    const loginUser = {
        role:req.user.role,
        name:req.user.name,
        email:req.user.email
    }
    const token =jwt.sign(loginUser,config.jwt.SECRET,{expiresIn:300});
    res.cookie(config.jwt.COOKIE,token,{maxAge:300000,httpOnly:true}).redirect('/')
})


export default router