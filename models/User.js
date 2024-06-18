const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        firstname: {
            type: String,
            required: [true , "Required Field."],
        },
        lastname: {
            type: String,
            required: [true , "Required Field."],
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: [true , "Required Field."],
            match: [/\S+@\S+\.\S+/, "Invalid E-mail Address."],
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin:{
            type: Boolean,
            default : false,
        },
        address: [{  
            country:{
                type:String,
                required:true
            },
            city:{
                type:String,
                required:true
            },
            street:{
                type:String,
                required:true
            },
            postal_code:{
                type:Number,
                required:true
            }
        }],
        wishlist: [{   
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        }],
        orders: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Orders',
        }],
        cart: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }],

        Token:String,
        Tokenexpiry:Date,
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
