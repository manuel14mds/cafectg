import services from "../dao/index.js"
import jwt from 'jsonwebtoken'
import config from "../config/config.js"

export const loginValidater = async (req,res,next) => {
    const token = req.cookies[config.jwt.COOKIE]
    if(!token)return res.status(401).send({message:'unauthorized'})
    const user = jwt.verify(token, config.jwt.SECRET)
    const wholeUser = await services.UserService.getByEmail(user.email)
    req.body.cartId=wholeUser.cartId
    req.body.user = wholeUser
    next()
}