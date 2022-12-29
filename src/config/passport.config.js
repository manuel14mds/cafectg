import passport from 'passport'
import local from 'passport-local'
import persistenceFactory from '../dao/Factory.js'
import { createHash, isValidPassword } from '../utils.js'
import GoogleStrategy from 'passport-google-oauth20';
import config from './config.js';

const LocalStrategy = local.Strategy

const initializePassport = () =>{
    passport.use('register', new LocalStrategy({passReqToCallback:true,usernameField:'email',session:false}, async(req,email,password,done)=>{
        try{
            const {name} = req.body
            const exists = await persistenceFactory.UserService.getByEmail(email)
            if(exists) return done(null,false,{message:"User already exists"})

            let newCart = await persistenceFactory.CartService.create()
            const newWishlist = await persistenceFactory.WishListService.create()
            const newUser = {
                name,
                email,
                password: createHash(password),
                cartId:newCart.id,
                wishlistId:newWishlist.id,
            }

            let result = await persistenceFactory.UserService.createUser(newUser)
            return done(null,result)
        }catch(error){
            done(error)
        }
    }))

    passport.use('login',new LocalStrategy({usernameField:"email",session:false},async(email,password,done)=>{
        try{
            const user = await persistenceFactory.UserService.getByEmail(email)
            if(!user) return done(null,false,{message:"User not found"})
            if(!isValidPassword(user,password)) return done(null,false,{message:"contraseña incorrecta"})
            return done(null,user)
        }catch(error){
            done(error)
        }
    }))

    passport.use('google', new GoogleStrategy({
        clientID:config.google.CLIENT_ID,
        clientSecret:config.google.CLIENT_SECRET,
        callbackURL:`${config.app.DOMAIN}/api/sessions/googlecallback`
    },async(accessToken,refreshToken,profile,done)=>{

        const {email,given_name,family_name } = profile._json;
        let user = await persistenceFactory.UserService.getByEmail(email)
        if(!user){
            let newCart = await persistenceFactory.CartService.create()
            const newWishlist = await persistenceFactory.WishListService.create()
            const newUser = {
                email,
                name: given_name,
                last_name: family_name,
                password:'',
                cartId:newCart.id,
                wishlistId:newWishlist.id,
            }
            let result = await persistenceFactory.UserService.createUser(newUser)
            return done(null,result);
        }else{
            return done(null,user);
        }
    }))

    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })
    passport.deserializeUser(async(id,done)=>{
        let result = await persistenceFactory.UserService.getById(id)
        return done(null,result)
    })

}
export default initializePassport