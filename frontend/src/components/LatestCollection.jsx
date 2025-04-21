import React, {useContext, useEffect, useState} from "react";
import {ShopContext} from '../context/ShopContext';
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
    const {products} = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);
    
    //Add 10 products from products array to latestProducts array using useEffect
    useEffect(()=>{
        setLatestProducts(products.slice(0,10));
    }, [products]);

    return(
        <div className="my-10">
            {/* Title and Para */}
            <div className="text-center py-8 text-3xl ">
                <Title text1={'LATEST'} text2={'COLLECTIONS'}/>
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                Lorem ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsumhas the most power of logic.
                </p>
            </div>

            {/*Rendering Products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 ">
                { /*Id,image, name, price all are passed from latestProducts array */
                    latestProducts.map((item,index)=>(
                        <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))
                }
            </div>
        </div>
    )
}

export default LatestCollection;