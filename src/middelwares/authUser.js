import jwt from 'jsonwebtoken'

import config from "../config/config.js"
import persistenceFactory from "../dao/Factory.js"

import { logger } from '../app.js'

const loginValidater = async (req, res, next) => {
    const admins = [
        {name:'UserAdmin1', email:'admin@mail.com', id:'a1', password:'Admin123', admin:true},
    ]
    const token = req.cookies[config.jwt.COOKIE]

    if (!token) {
        logger.warn(`unauthorized user -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 401`)
        return res.status(401).send({ message: 'unauthorized' })
    }
    const user = jwt.verify(token, config.jwt.SECRET)

    let admin = admins.filter((e) => e.id == user.id)
    if(admin.length == 1){
        delete admin[0].password
        req.body.user = admin[0]
    }else{
        const wholeUser = await persistenceFactory.UserService.getByEmail(user.email)
    if (wholeUser._id) wholeUser.id = wholeUser._id
    req.body.user = wholeUser
    }
    next()
}
//validate if is an admin
const onlyAdmin = async (req, res, next) => {
    if (!req.body.user.admin) {
        logger.warn(`unauthorized user -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 401`)
        return res.status(401).send({ message: 'unauthorized' })
    }
    next()
}


export {
    loginValidater,
    onlyAdmin,

}