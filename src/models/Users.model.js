import mongoose from 'mongoose'

const collection = 'Users'

const usersSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        default:''
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    age:{
        type:Number,
        default:-1
    },
    address:{
        type:String,
        default:''
    },
    phone:{
        type:String,
        default:''
    },
    active:{
        type:Boolean,
        default:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        require:true
    },
    cartId:String,
    wishlistId:String,
    purchases:{
        Array:['MSC','AEX','DIN','VIS']
    },
    cards:Array,

},{timestamps:true})

const usersModelService = mongoose.model(collection,usersSchema)
export default usersModelService