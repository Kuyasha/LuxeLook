import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required: true, unique:true},
    password: {type:String, required:true}, 
    cartData: {type:Object, default:{}}, 
    
}, {minimize:false});

//When the userModel is already available then that model will be used, if 
//userModel is not available then new model will be created
const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;


/*
1) email:{type:String, required: true, unique:true} => If we create any account
with emailID, and want to create another account with the same emailD,
that will not be created if we use unique:true.

2) cartData:{type:Object, default:{}} => whenever new user will be created,
then cartData will be empty object.
*/

