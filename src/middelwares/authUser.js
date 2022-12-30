import jwt from 'jsonwebtoken'

import config from "../config/config.js"
import persistenceFactory from "../dao/Factory.js"

import { logger } from '../app.js'

export const loginValidater = async (req, res, next) => {
    const token = req.cookies[config.jwt.COOKIE]

    if (!token) {
        logger.warn(`unauthorized user -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 401`)
        return res.status(401).send({ message: 'unauthorized' })
    }

    const user = jwt.verify(token, config.jwt.SECRET)
    const wholeUser = await persistenceFactory.UserService.getByEmail(user.email)
    if (wholeUser._id) wholeUser.id = wholeUser._id
    req.body.user = wholeUser
    next()
}