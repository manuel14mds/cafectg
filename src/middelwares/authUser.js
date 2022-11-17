import jwt from 'jsonwebtoken'
import config from "../config/config.js"
import persistenceFactory from "../dao/Factory.js"

export const loginValidater = async (req,res,next) => {
    const token = req.cookies[config.jwt.COOKIE]
    if(!token)return res.status(401).send({message:'unauthorized'})
    const user = jwt.verify(token, config.jwt.SECRET)
    const wholeUser = await persistenceFactory.UserService.getByEmail(user.email)
    req.body.cartId=wholeUser.cartId
    req.body.user = wholeUser
    next()
}