
import React, {useContext, useEffect, useState} from "react";
import {ShopContext} from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";


const Cart = () => {
    const {products, currency, cartItems, updateQuantity, navigate} = useContext(ShopContext);
    const [cartData, setCartData] = useState([]);

    // Here we want to add the cartItems data and products data in one array
    // creating a new object tempData with id,size,quantity for cart
    useEffect(()=>{ 
      if(products.length > 0){   
        const tempData = [];
        for(const items in cartItems){
            for(const item in cartItems[items]){
                if(cartItems[items][item] > 0){
                    tempData.push({
                        _id: items,
                        size:item,
                        quantity:cartItems[items][item]
                    })
                }
            }
        }
        setCartData(tempData);
        //console.log(tempData);
      }
    }, [cartItems, products]);



    return(
        <div className="border-t pt-14">
            <div className="text-2xl mb-3">
                <Title text1={'YOUR'} text2={'CART'} />
            </div>

            <div>
                {
                    cartData.map((item, index)=>{
                        const productData = products.find((product) => product._id === item._id);
                        
                        return(
                            <div key={index} className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4">
                                {/* Image,Name,Price,Size */}
                                <div className="flex items-start gap-6">
                                    <img src={productData.image[0]} alt="" className="w-16 sm:w-20"/>
                                    <div>
                                        <p className="text-xs sm:text-lg font-medium">{productData.name}</p>
                                        <div className="flex items-center gap-5 mt-2">
                                            <p>{currency}{productData.price}</p>
                                            <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.size}</p>
                                        </div>
                                    </div>
                                </div>
                                {/*Quantity,Delete Icon => to remove pdt from cartData,we provide 0 at updateQuantity() fn*/} 
                                <input onChange={(e)=>e.target.value==='' || e.target.value===0 ? null : updateQuantity(item._id,item.size,Number(e.target.value))} type="number" min={1} defaultValue={item.quantity} className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"/>
                                <img onClick={()=>updateQuantity(item._id,item.size,0)} src={assets.delete_icon} alt='' className="w-4 mr-4 sm:w-5 cursor-pointer" />
                            </div>
                        )
                    })
                }
            </div>

            <div className="flex justify-end my-20">
                <div className="w-full sm:w-[450px]">
                    <CartTotal/>
                    <div className="w-full text-end"> {/*On clicking this btn page will navigate to PlaceOrder page */}
                        <button onClick={()=>navigate('/place-order')} className="bg-black text-white text-sm my-8 px-8 py-3">PROCEED TO CHECKOUT</button>
                    </div> 
                </div>
            </div>
        </div>
    )
}

export default Cart;