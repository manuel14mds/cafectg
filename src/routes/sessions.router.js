import { Router } from 'express'
import passport from 'passport'

import { uploader } from '../utils.js'
import { loginValidater } from '../middelwares/authUser.js'
import {validateUid} from '../middelwares/IDsValidator.js'
import sessions from '../controllers/sessions.js'

const router = Router()

// login user
router.post('/login', passport.authenticate('login', { session: false }), sessions.login)

// login admin
router.post('/loginadmin', sessions.adminLogin)

// logout
router.get('/logout', sessions.logout)

// current user
router.get('/current', sessions.current)

// User Update
router.put('/userUpdate/:uid', validateUid, loginValidater, sessions.userUpdate)

// update user image
router.put('/user/:uid/image', validateUid, loginValidater, uploader.single('file'), sessions.userImage)

// register
router.post('/register', passport.authenticate('register', { session: false }), sessions.register)

// google
router.get('/google', passport.authenticate('google', { session: false, scope: ['email', 'profile'] }), async (req, res) => { })

// google callback
router.get('/googlecallback', passport.authenticate('google', { session: false }), sessions.googleCallback)

// github
router.get('/github', passport.authenticate('github', { session: false, scope: ['user:email', 'profile'] }), async (req, res) => { })

// github callback
router.get('/githubcallback', passport.authenticate('github',{session:false}), sessions.githubCallback)

export default router