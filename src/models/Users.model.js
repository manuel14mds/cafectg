import mongoose from 'mongoose'

const collection = 'Users'

const usersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    age: {
        type: Number,
        default: -1
    },
    address: {
        type: String,
        default: ''
    },
    picture: String,
    phone: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    cartId: String,
    wishlistId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'wishLists'
    },
    purchases: [
        {
            purchase: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'purchases'
            }
        }
    ],
    cards: ['MSC', 'AEX', 'DIN', 'VIS'],

}, { timestamps: true })

const usersModelService = mongoose.model(collection, usersSchema)
export default usersModelService