import {v2 as cloudinary} from "cloudinary";
import productModel from "../models/productModel.js";



//ADD PRODUCT
const addProduct = async(req, res) =>{
    try{
        const {name,description,price,category,subCategory,sizes,bestseller} = req.body;
        
        //req.files.image1 && req.files.image1[0] => if image1 is available then
    //we will store that inside image1 variable,if not available then we will not get any error
        const image1 = req.files.image1 && req.files.image1[0]; 
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];   
        //if the item =! undefined,then we will store that item inside images array
        const images = [image1,image2,image3,image4].filter((item) => item !== undefined);
        
    //Storing all the images inside cloudinary database
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type:'image'});
                return result.secure_url;
            })
        );

    //Save all these datas inside mongodb database //bestseller==="true" ? true : false,
        const productData = {
            name,
            description,
            price: Number(price),
            image: imagesUrl,
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === 'true' ? true : false,
            date: Date.now()
        } 
        const product = new productModel(productData);
        await product.save();
        console.log(product);
        
        res.json({success:true, message:"Product Added"});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:error.message});
    }
}



//GET LIST OF PRODUCTS
const listProducts = async(req, res) =>{
    try{
        const products = await productModel.find({});
        res.json({success:true, products});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:error.message});
    }  
}



//REMOVING PRODUCT
const removeProduct = async(req, res) =>{
    try{
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Product Removed"});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:error.message});
    }    
}



//GET SINGLE PRODUCT INFORMATION
const singleProduct = async(req, res) =>{
    try{
        const {productId} = req.body;
        const product = await productModel.findById(productId);
        res.json({success:true, product});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:error.message});
    }   
}


export {addProduct, listProducts, removeProduct, singleProduct};





