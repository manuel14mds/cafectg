import { Router } from 'express'
import passport from 'passport'

import { uploader } from '../utils.js'

import sessions from '../controllers/sessions.js'

const router = Router()

// login
router.post('/login', passport.authenticate('login', { session: false }), sessions.login)

// logout
router.get('/logout', sessions.logout)

// current user
router.get('/current', sessions.current)

// User Update
router.put('/userUpdate', sessions.userUpdate)

// update user image
router.post('/user/image', uploader.single('file'), sessions.userImage)

// register
router.post('/register', passport.authenticate('register', { session: false }), sessions.register)

// google
router.get('/google', passport.authenticate('google', { session: false, scope: ['email', 'profile'] }), async (req, res) => { })

// google calback
router.get('/googlecallback', passport.authenticate('google', { session: false }), sessions.googleCallback)



export default router