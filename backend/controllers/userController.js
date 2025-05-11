
import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


//Token generation function
//this token is a coded version of userId, which is created using JWT_SECRET
//with jwt
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET); 
}


//1)USER REGISTRATION (FRONTEND)
const registerUser = async(req,res) => {
    try{
        //extracting email,name,password from body
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

        //Now when both email & password is valid,then we will create
        //account for new user. But before that,
        // hashing user password, this hashed pass will be saved at mongodb database
        const salt = await bcrypt.genSalt(10);//can take this nos from 5-15
        const hashedPassword = await bcrypt.hash(password, salt);
        
        //create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        const user = await newUser.save();

        //token generated after user registration, using token user can login
        //this token is a coded version of userId and JWT_SECRET
        const token = createToken(user._id); //inside mongodb userId is created like _id 
        
        //send this token as response
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
        //extracting email,password from body
        const {email, password} = req.body;

        //Find User=> checking if any user available with this emailId
        const user = await userModel.findOne({email}); 
        
        //when user not exists
        if(!user){
            return res.json({success:false, message:"User doesn't exists"}); 
        }

        //When User exists
        //pass entered by user for login(password) is compared with the
        //hashed pass(user.password) saved at mongodb database
        const isMatch = await bcrypt.compare(password, user.password);

        //Token generation and send this token as response after 
        //the passwords matched
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
        //extract admin-email,admin-pass from req.body
        const {email, password} = req.body;//email=>admin-email, pass=>admin-pass
        
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            //token is created using admin email+password with jwt
            //means token is the coded form of (email+password)
            //if we decode this token will get admin(email+password)
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