import passport from 'passport'
import local from 'passport-local'
import services from '../dao/index.js'
import { createHash, isValidPassword } from '../utils.js'
import GoogleStrategy from 'passport-google-oauth20';
import config from './config.js';

const LocalStrategy = local.Strategy

const initializePassport = () =>{
    passport.use('register', new LocalStrategy({passReqToCallback:true,usernameField:'email',session:false}, async(req,email,password,done)=>{
        try{
            const {name} = req.body
            const exists = await services.UserService.getByEmail(email)
            if(exists) return done(null,false,{message:"User already exists"})

            let newCart = await services.CartService.create()
            let newUser = {
                name,
                email,
                password: createHash(password),
                cartId:newCart._id,
            }

            let result = await services.UserService.save(newUser)
            return done(null,result)
        }catch(error){
            done(error)
        }
    }))

    passport.use('login',new LocalStrategy({usernameField:"email",session:false},async(email,password,done)=>{
        try{
            const user = await services.UserService.getByEmail(email)
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

        const {email,name} = profile._json;
        let user = await services.UserService.getByEmail(email)
        if(!user){
            const newUser = {
                email,
                name: name.given_name,
                last_name: name.family_name,
                password:''
            }
            let result = await services.UserService.save(newUser)
            return done(null,result);
        }else{
            return done(null,user);
        }
        done(null,false);
    }))

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser(async(id,done)=>{
        let result = await services.UserService.getById(id)
        return done(null,result)
    })

}
export default initializePassport