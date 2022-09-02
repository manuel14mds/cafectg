import mongoose from "mongoose";

const collection = 'users'

const usersSchema = mongoose.Schema({
    first_name:String,
    last_name:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'student'
    },
    age:Number,
    active:{
        type:Boolean,
        required:true,
        default:true
    },
    email:{
        type:String,
        required:true
    }
},{timestamps:true})

const usersModelService = mongoose.model(collection,usersSchema)
export default usersModelService