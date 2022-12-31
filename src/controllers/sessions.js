import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import persistenceFactory from '../dao/Factory.js'

// user login
const login = async (req, res) => {
    try {
        const loginUser = {
            role: req.user.role,
            name: req.user.name,
            last_name: req.user.last_name,
            email: req.user.email,
            address: req.user.address,
            phone: req.user.phone,
            age: req.user.age,
        }
        const token = jwt.sign(loginUser, config.jwt.SECRET, { expiresIn: 3000 })
        res.cookie(config.jwt.COOKIE, token, { maxAge: 3000000, httpOnly: true }).redirect('/')
    } catch (error) {
        logger.error(`Couldn't login -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            sessions.controller: login`)
    }
}

// user logout
const logout = async (req, res) => {
    try {
        const token = req.cookies[config.jwt.COOKIE]
        res.cookie(config.jwt.COOKIE, token, { maxAge: 1, httpOnly: true }).redirect('/')
    } catch (error) {
        logger.error(`Couldn't logout -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            sessions.controller: logout`)
    }
}

// current user
const current = async (req, res) => {
    try {
        const token = req.cookies[config.jwt.COOKIE]
        if (!token) return res.redirect('/')
        const user = jwt.verify(token, config.jwt.SECRET)
        res.send({ status: "success", info: user })
    } catch (error) {
        if (error.expiredAt) {
            logger.warm(`Token expired -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 300:
            ${error}
            sessions.controller: current`)
            return res.status(300).send({ status: "error", error: "token expired" })
        } else {
            logger.error(`Couldn't get current user -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            sessions.controller: current`)
            return res.status(500).send({ status: "error", error: "Couldn't get current user" })
        }
    }
}

// update user
const userUpdate = async (req, res) => {
    const token = req.cookies[config.jwt.COOKIE]
    if (!token) return res.redirect('/')
    const user = jwt.verify(token, config.jwt.SECRET)
    try {
        const wholeUser = await persistenceFactory.UserService.getByEmail(user.email)
        const result = await persistenceFactory.UserService.update(wholeUser.id, req.body)
        return res.send({ status: 'success', message: 'user updated successfully', payload: result })
    } catch (error) {
        logger.error(`Couldn't update user -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            sessions.controller: userUpdate`)
        res.status(500).send({ error: "Server error", message: "Couldn't update User" })
    }
}

// update user image
const userImage = async (req, res) => {
    const token = req.cookies[config.jwt.COOKIE]
    if (!token) return res.redirect('/')
    const user = jwt.verify(token, config.jwt.SECRET)
    try {
        const wholeUser = await persistenceFactory.UserService.getByEmail(user.email)
        req.body.id = wholeUser.id
        req.body.picture = req.file.filename
        const result = await persistenceFactory.UserService.update(wholeUser.id, req.body)
        return res.send({ status: 'success', message: 'user updated successfully', payload: result })
    } catch (error) {
        logger.error(`Couldn't update user image -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            sessions.controller: userImage`)
        res.status(500).send({ error: "Server error", message: "Couldn't update user image" })
    }
}
const register = async (req, res) => {
    res.status(200).send('User Registered')
}

// google callback
const googleCallback = async (req, res) => {
    try {
        const loginUser = {
            role: req.user.role,
            name: req.user.name,
            email: req.user.email
        }
        const token = jwt.sign(loginUser, config.jwt.SECRET, { expiresIn: 3000 });
        res.cookie(config.jwt.COOKIE, token, { maxAge: 3000000, httpOnly: true }).redirect('/')
    } catch (error) {
        logger.error(`googleCallback error -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            sessions.controller: googleCallback`)

    }
}
const githubCallback = async(req,res)=>{
    if(!req.user){
        return res.status(500).send({error:'login error', message:'Couldnt login with github, please view permissions, set email and name on your github account'})
    }
    const loginUser = {
        role: req.user.role,
        name: req.user.name,
        email: req.user.email
    }
    const token = jwt.sign(loginUser, config.jwt.SECRET, { expiresIn: 3000 });
    res.cookie(config.jwt.COOKIE, token, { maxAge: 3000000, httpOnly: true }).redirect('/')
}
export default {
    login,
    logout,
    current,
    userUpdate,
    userImage,
    register,
    googleCallback,
    githubCallback,
}