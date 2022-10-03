import mongoose from "mongoose";

const collection = 'users'

const usersSchema = mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'user'
    },
    age:Number,
    active:{
        type:Boolean,
        default:true
    },
    email:{
        type:String,
        required:true
    }
},{timestamps:true})

const usersModelService = mongoose.model(collection,usersSchema)
export default usersModelService