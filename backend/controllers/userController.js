
import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


//Token generation function
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET); 
}


//1)USER REGISTRATION (FRONTEND)
const registerUser = async(req,res) => {
    try{
        const {name, email, password} = req.body;

        //checking if user already exists or not
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false, message:"User already exists"});
        }

        //validating email format & strong password
        if(!validator.isEmail(email)){ //when email is not validated
            return res.json({success:false, message:"Please enter a valid email"});
        }
        if(password.length < 8){ //when password is not strong
            return res.json({success:false, message:"Please enter a strong password"});
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        //create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        const user = await newUser.save();
        //token generated after user registration
        const token = createToken(user._id); //inside mongodb userId is created like this 
        res.json({success:true, token});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:error.message});    
    }
}


//2)USER LOGIN (FRONTEND)
const loginUser = async(req,res) => {
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email}); //find user
        if(!user){
            return res.json({success:false, message:"User doesn't exists"}); 
        }

        //pass entered by user for login is compared with the hashed pass saved
        //at mongodb database
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = createToken(user._id);
            res.json({success:true, token})
        }
        else{
            res.json({success:false, message:"Invalid credentials"});
        }
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:error.message}); 
    }
}



//3)ADMIN LOGIN (ADMIN PANEL)
const adminLogin = async(req,res) => {
    try{
        const {email, password} = req.body; //email=>admin-email, pass=>admin-pass
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            //token is created using admin email+password
            const token = jwt.sign(email+password, process.env.JWT_SECRET);  
            res.json({success:true, token});
        }
        else{
            res.json({success:false, message:"Invalid credentials"});
        }
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:error.message});    
    }
}


export {loginUser, registerUser, adminLogin};