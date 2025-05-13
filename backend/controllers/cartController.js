import userModel from "../models/userModel.js";


//1)ADD PRODUCTS TO USER CART
const addToCart = async(req,res) => {
    try{
        //i)Extract userId,productId=itemId and productSize from body
        //itemId=>id of the product that we are trying to add in the cart
        const {userId, itemId, size} = req.body;
        
        //ii)Find that user from the userModel using this userId and
        //extract cartData of that user
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        //iii)Modify cartData of the user by adding itemId and size
        if(cartData[itemId]){ //when pdt/item is already available in this cartData
            if(cartData[itemId][size]){ //if itemId of this cartData has this size available
                cartData[itemId][size] += 1;
            }
            else{ //when size is not available
                cartData[itemId][size] = 1;  
            }
        }
        else{ //when we dont have any product in this cartData
            cartData[itemId] = {}; //create new obj of this itemId of cartData
            cartData[itemId][size] = 1; //in that obj create size
        }

        //iv)Add this updated cartData into this userId of database
        await userModel.findByIdAndUpdate(userId, {cartData});
        res.json({success:true, message:"Added To Cart"});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message: error.message});
    }
}



//2)UPDATE QUANTITY OF ANY PRODUCT AT USER CART
const updateCart = async(req,res) =>{
    try{
        //i)Extract userId,itemId,size,quantity from body
        const {userId, itemId, size, quantity} = req.body;

        //ii)Find that user from the userModel using this userId and
        //extract cartData of that user
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        //iii)Update the quantity inside cartData of that user
        cartData[itemId][size] = quantity;

        //iv)Add this updated cartData into this userId of database
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
        let cartData = await userData.cartData;

        res.json({success:true, cartData});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message: error.message});
    }
}


export {addToCart, updateCart, getUserCart};