import userModel from "../models/userModel.js";


//1)ADD PRODUCTS TO USER CART
const addToCart = async(req,res) =>{
    try{
        const {userId, itemId, size} = req.body; //itemId=>pdtId that we are trying to add in the cart
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;//extracting cartData using userData of that user
        
        if(cartData[itemId]){ //if cartData has this itemId available
            if(cartData[itemId][size]){ //if itemId of this cartData has this size available
                cartData[itemId][size] += 1;
            }
            else{ //when size is not available
                cartData[itemId][size] = 1;  
            }
        }
        else{ //when cartData of this itemId not available
            cartData[itemId] = {}; //create new obj of this itemId of cartData
            cartData[itemId][size] = 1; //in that obj create size
        }

        //now add this updated cartData into userData
        await userModel.findByIdAndUpdate(userId, {cartData});
        res.json({success:true, message:"Added To Cart"});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message: error.message});
    }
}


//2)UPDATE USER CART
const updateCart = async(req,res) =>{
    try{
        const {userId, itemId, size, quantity} = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;//extracting cartData using userData of that user

        cartData[itemId][size] = quantity; //updating the quantity

        await userModel.findByIdAndUpdate(userId, {cartData});
        res.json({success:true, message:"Cart Updated"});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message: error.message});
    }
}


//3)GET USER CART DATA
const getUserCart = async(req,res) =>{
    try{
        const {userId} = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;//extracting cartData using userData of that user
        
        res.json({success:true, cartData});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message: error.message});
    }
}


export {addToCart, updateCart, getUserCart};