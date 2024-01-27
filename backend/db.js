const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/paytm')

const userSchema = mongoose.Schema({
    firstname:{
        type:String,
        default: null,
        required:true,
        maxlength:50,
        trim:true
    },
    lastname:{
        type:String,
        default: null,
        required:true,
        lowercase:true,
        maxlength:50,
        trim:true
    },
    username:{
        type:String,
        default: null,
        required:true
    },
    password:{
        type:String,
        default: null,
        required:true,
        minlength:6
    }
})

const accountSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    balance:{
        type:Number,
        required:true,
        default:0
    }
    
})
const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);

module.exports = {
    User,
    Account
};