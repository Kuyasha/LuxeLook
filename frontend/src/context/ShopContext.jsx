
import { createContext, useEffect, useState } from "react";
//import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


export const ShopContext = createContext();

const ShopContextProvider =(props) => {
    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(''); //For Login.jsx
    
    
    //1)ADD TO CART FN WITH BACKEND
    const addToCart = async(itemId, size) => {
        //means the case when customer is not selecting any size,but directly
        //clicking on the ADD TO CART btn
        if(!size){  
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems); //it will create copy of cartItems
        
        if(cartData[itemId]) //if cartData has any entry available with this itemId
        { 
            if(cartData[itemId][size]){ //if cartData has any pdt with itemId,size; then increase the product entry by 1
                cartData[itemId][size] += 1;
            }
            else{ //when we have the pdt entry;but not with the same size
                cartData[itemId][size] = 1;
            }
        }
        else //when cartData has no entry available with this itemId;then introduce new entry
        {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);

        //Send to Backend
        if(token){
            try{
                await axios.post(backendUrl + '/api/cart/add', {itemId,size}, {headers:{token}});
            }
            catch(error){
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    
    //2)GET CART COUNT FN
    const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItems){ //iterate on the items
            for(const item in cartItems[items]){ //iterate on the size
                try{
                    if(cartItems[items][item] > 0){ //means in the cartItems we have the pdt with particular size
                        totalCount += cartItems[items][item];
                    }
                }catch(error){
                    console.log(error);
                    toast.error(error.message);
                }
            }
        }
        return totalCount;
    }


    //3)UPDATE QUANTITY WITH BACKEND
    const updateQuantity = async(itemId,size,quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        //Send to Backend
        if(token){
            try{
                await axios.post(backendUrl + '/api/cart/update', {itemId,size,quantity}, {headers:{token}});
            }
            catch(error){
                console.log(error);
                toast.error(error.message);
            }
        }
    }


    //5) GET PRODUCTS DATA FROM BACKEND
    const getProductsData = async() =>{
        try{
            const response = await axios.get(backendUrl + '/api/product/list');
            //console.log(response.data); 
            if(response.data.success){
                setProducts(response.data.products);
            }else{
                toast.error(response.data.message);
            }
        }
        catch{
            console.log(error);
            toast.error(error.message);
        }
    }
    
    //6)FOR BACKEND => We have to run this fn whenever we reload the webpage
    const getUserCart = async(token) =>{
        try{
            const response = await axios.post(backendUrl + '/api/cart/get',{}, {headers:{token}});
            if(response.data.success){
                setCartItems(response.data.cartData);
            }
        }
        catch(error){
            console.log(error);
            toast.error(error.message);
        }
    }

        //4)GET CART AMOUNT
        const getCartAmount = ()=>{
            let totalAmount = 0;
            for(const items in cartItems){
                let itemInfo = products.find((product)=> product._id === items);
                for(const item in cartItems[items]){
                    try{
                        if(cartItems[items][item] > 0){
                            totalAmount += itemInfo.price * cartItems[items][item];
                        }
                    }catch(error){
                        //console.log(error);
                        //toast.error(error.message);
                    }
                }
            }
            return totalAmount;
        }


    useEffect(()=>{
        getProductsData()
    },[]);
    
    //If token not available, but on the localstorage token is available;
    //then store the localStorage token at the token state
    useEffect(()=>{
        if(!token && localStorage.getItem('token'))
        {
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'));
        }
    },[]);


    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems,getCartCount,updateQuantity,getCartAmount,
        navigate, backendUrl, token, setToken,  
    }


    return(
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;