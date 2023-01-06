import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import persistenceFactory from '../dao/Factory.js'
import { logger } from '../app.js'

// user login
const login = async (req, res) => {
    try {
        
        let loginUser = req.user
        delete loginUser.password

        const token = jwt.sign(loginUser, config.jwt.SECRET, { expiresIn: 3000 })
        res.cookie(config.jwt.COOKIE, token, { maxAge: 3000000, httpOnly: true, sameSite:"strict" }).redirect('/')
    } catch (error) {
        logger.error(`Couldn't login -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500: ${error} ||sessions.controller: login`)
        return res.status(500).send({ status: "error", error: "Couldn't login" })
    }
}
const adminLogin = async (req, res) => {
    try {
        const admins = [
            {name:'UserAdmin1', email:'admin@mail.com', id:'a1', password:'Admin123', admin:true},
        ]
        const {email, password} = req.body
        if(!email || !password){
            logger.warn(`Bad request -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 400: blank fields ||sessions.controller: adminLogin`)
            return res.status(400).send({ status: "Bad Request", error: "blank fields" })
        }else{
            let admin = admins.find((e) => e.email == email)
            if(!admin || admin.password!= password){
                logger.warn(`Bad request -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 400: invalid credentials ||sessions.controller: adminLogin`)
                return res.status(400).send({ status: "Bad Request", error: "invalid credentials" })
            }else{
                delete admin.password
                const token = jwt.sign(admin, config.jwt.SECRET, { expiresIn: 3000 })
                res.cookie(config.jwt.COOKIE, token, { maxAge: 3000000, httpOnly: true, sameSite:"strict" }).redirect('/')
            }
        }
    } catch (error) {
        logger.error(`Couldn't login -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500: ${error} ||sessions.controller: login`)
        return res.status(500).send({ status: "error", error: "Couldn't login" })
    }
}

// user logout
const logout = async (req, res) => {
    try {
        const token = req.cookies[config.jwt.COOKIE]
        res.cookie(config.jwt.COOKIE, token, { maxAge: 1, httpOnly: true }).redirect('/')
    } catch (error) {
        logger.error(`Couldn't logout -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500: ${error} ||sessions.controller: logout`)
        return res.status(500).send({ status: "error", error: "Couldn't logout" })
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
            logger.warn(`Token expired -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 300:
            ${error}
            sessions.controller: current`)
            return res.status(300).send({ status: "error", error: "token expired" })
        } else {
            logger.error(`Couldn't get current user -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500: ${error} ||sessions.controller: current`)
            return res.status(500).send({ status: "error", error: "Couldn't get current user" })
        }
    }
}

// update user
const userUpdate = async (req, res) => {
    try {
        if (Object.keys(req.body).length>=1) {
            let user = req.params.user
            const result = await persistenceFactory.UserService.update(user.id, req.body)
            return res.send({ status: 'success', message: 'user updated successfully', payload: result })
        } else {
            return res.status(400).send({ status: 'bad request', error: "blank spaces are NOT allowed" })
        }
    } catch (error) {
        logger.error(`Couldn't update user -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500: ${error} ||sessions.controller: userUpdate`)
        res.status(500).send({ error: "Server error", message: "Couldn't update User" })
    }
}

// update user image
const userImage = async (req, res) => {
    try {
        let user = req.params.user
        user.picture = req.file.filename
        const result = await persistenceFactory.UserService.update(user.id, user)
        return res.send({ status: 'success', message: 'user updated successfully', payload: result })
    } catch (error) {
        logger.error(`Couldn't update user image -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500: ${error} sessions.controller: userImage`)
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
        res.cookie(config.jwt.COOKIE, token, { maxAge: 3000000, httpOnly: true, sameSite:"strict" }).redirect('/')
    } catch (error) {
        logger.error(`googleCallback error -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500: ${error} ||sessions.controller: googleCallback`)

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
    res.cookie(config.jwt.COOKIE, token, { maxAge: 3000000, httpOnly: true, sameSite:"strict" }).redirect('/')
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
    adminLogin,
}