import mongoose from "mongoose";

const collection = 'purchases'

const purchasesSchema = mongoose.Schema({
    products:[
        {
            product:{
                type:mongoose.SchemaTypes.ObjectId,
                ref:'products'
            },
            qty:Number
        }
    ],
    total:Number
},{timestamps:true})

const purchaseModelService = mongoose.model(collection,purchasesSchema)
export default purchaseModelService