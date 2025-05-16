import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


export const ShopContext = createContext();

const ShopContextProvider =(props) => {
    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    //Used on Home,Collection,Product to display all products
    const [products, setProducts] = useState([]);

    //To be used on Collection Page for SearchBar and on search-icon of NavBar
    //When showSearch is true,SearchBar will be visible else not
    const [search, setSearch] = useState(''); 
    const [showSearch, setShowSearch] = useState(false);
    
    //To save the token at token state variable after login at Login.jsx
    const [token, setToken] = useState(''); 
    
    //useNavigate hook from react-router-dom to navigate from one page to another
    const navigate = useNavigate();
    
    //For cartData (used in Product page)
    const [cartItems, setCartItems] = useState({}); //initialize with empty obj
    



    //1) Home, Collection, Product, Cart page  (Only Backend)
    // Get All the Products data from Backend
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


    //2) Product Page (Frontend+Backend)
    // To add productData to Cart on clicking (ADD TO CART) btn  
    const addToCart = async(itemId, size) => {
        //means the case when customer is not selecting any size,but directly
        //clicking on the ADD TO CART btn
        if(!size){  
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems); //it will create copy of cartItems array state
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

        //Send cartData to Backend
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


    //3) NAVBAR Component (cart-icon count update) (Only Frontend) 
    // GET CART COUNT FN  
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


    //4)CART Page (on quantity-icon and delete-icon) (FRONTEND + BACKEND)
    //To update quantity of cartData
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


    //5)CART TOTAL component of CART page (only FRONTEND)
    // To get the total amount of cartItems
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
    

    //6)Whenever we reload the webpage, getting cartData from database always.
    //Hence cart will not be empty on reloading the webpage
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



    //To load all products data when reloading
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
            products, currency, delivery_fee, backendUrl,
            search, setSearch, showSearch, setShowSearch,
            token, setToken,
            navigate,
            cartItems, setCartItems, addToCart, getCartCount,
            updateQuantity, getCartAmount
        }
    
    
        return(
            <ShopContext.Provider value={value}>
                {props.children}
            </ShopContext.Provider>
        )
}
    
export default ShopContextProvider;
