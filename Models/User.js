const mongoose  = require('mongoose');

const UserSchema = new mongoose.Schema({

    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true,
        minlength : [2 , "minimum 2 characters must"]
    },
    phnumber : {
        type : String,
        required : true,
        unique: true ,
        maxlength : [10 , "Phone number maximum 10 number"],
        minlength : [10 , "Phone number minimum 10 number"]
    },
    email : {
        type : String,
        required : true,
        unique: true,
        lowercase: true
    },
    password : {
        type : String ,
        required : true,
        minlength : [8 , 'Password must 8 characters']
    }
});

const User = mongoose.model("User" , UserSchema);
module.exports = User;