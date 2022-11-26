
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import persistenceFactory from '../dao/Factory.js'

const login = async (req,res) =>{
    const loginUser = {
        role:req.user.role,
        name:req.user.name,
        last_name:req.user.last_name,
        email:req.user.email,
        address:req.user.address,
        phone:req.user.phone,
        age:req.user.age,
    }
    const token = jwt.sign(loginUser, config.jwt.SECRET, {expiresIn:3000})
    res.cookie(config.jwt.COOKIE,token,{maxAge:3000000,httpOnly:true}).redirect('/')
}
const logout = async (req,res) =>{
    const token = req.cookies[config.jwt.COOKIE]
    res.cookie(config.jwt.COOKIE,token,{maxAge:1,httpOnly:true}).redirect('/')
}
const current = async (req,res) =>{
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
}
const userUpdate = async (req,res) =>{
    const token = req.cookies[config.jwt.COOKIE]
    if(!token) return res.redirect('/')
    const user = jwt.verify(token, config.jwt.SECRET)
    try {
        const wholeUser = await persistenceFactory.UserService.getByEmail(user.email)
        await persistenceFactory.UserService.update(wholeUser.id, req.body)
        res.status(200).send('result')
    } catch (error) {
        res.status(500).send({error:"Server error", message:"Couldn't update User"})
    }
}
const userImage = async (req,res) =>{
    const token = req.cookies[config.jwt.COOKIE]
    if(!token) return res.redirect('/')
    const user = jwt.verify(token, config.jwt.SECRET)
    try {
        const wholeUser = await persistenceFactory.UserService.getByEmail(user.email)
        req.body.id=wholeUser.id
        req.body.picture = req.file.filename
        await persistenceFactory.UserService.update(wholeUser.id, req.body)
        res.status(200).send('result')
    } catch (error) {
        res.status(500).send({error:"Server error", message:"Couldn't update User"})
    }
}
const register = async (req,res) =>{
    res.status(200).send('User Registered')
}
const googleCallback = async (req,res) =>{
    const loginUser = {
        role:req.user.role,
        name:req.user.name,
        email:req.user.email
    }
    const token =jwt.sign(loginUser,config.jwt.SECRET,{expiresIn:3000});
    res.cookie(config.jwt.COOKIE,token,{maxAge:3000000,httpOnly:true}).redirect('/')
}
export default {
    login,
    logout,
    current,
    userUpdate,
    userImage,
    register,
    googleCallback,
}