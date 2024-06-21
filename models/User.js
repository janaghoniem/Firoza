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
        shipping_address: [{  
            address:{
                type:String,
                required:true
            },
            city:{
                type:String,
                required:true
            },
            state:{
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
            ref: 'Product'
        }],
        orders: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Orders',
        }],
        cart: {
            items: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
            }],
            totalprice: {type: Number, required: true}, 
            customizedItems: [{
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
                quantity: { type: Number, required: true },
                price: { type: Number, required: true }
            }]
        },

        Token:String,
        Tokenexpiry:Date,
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
