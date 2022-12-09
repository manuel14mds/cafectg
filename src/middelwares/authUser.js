import jwt from 'jsonwebtoken'
import config from "../config/config.js"
import persistenceFactory from "../dao/Factory.js"

export const loginValidater = async (req,res,next) => {
    console.log('entra al login validater')
    const token = req.cookies[config.jwt.COOKIE]
    if(!token)return res.status(401).send({message:'unauthorized'})
    const user = jwt.verify(token, config.jwt.SECRET)
    const wholeUser = await persistenceFactory.UserService.getByEmail(user.email)
    if(wholeUser._id) wholeUser.id = wholeUser._id
    req.body.user = wholeUser
    next()
}