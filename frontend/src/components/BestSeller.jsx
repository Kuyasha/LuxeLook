
import React, {useContext, useEffect, useState} from "react";
import {ShopContext} from '../context/ShopContext';
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
    const {products} = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    //All bestseller pdts are filtered first; then taking 5 out of all
    // bestseller pdts using slice fn
    useEffect(() => {
        const bestProduct = products.filter((item) => (item.bestseller)); 
        setBestSeller(bestProduct.slice(0,5));
    }, [products]); 

    return(
        <div className="my-10">
            {/* Title and Para */}
            <div className="text-center text-3xl py-8">
                <Title text1={'BEST'} text2={'SELLERS'}/>
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                Lorem ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsumhas the most power of logic.
                </p>
            </div>
            
            {/*Rendering BestSeller Products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 gap-y-6 ">
                { /*Id,image, name, price all are passed from latestProducts array */
                    bestSeller.map((item,index)=>(
                        <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))
                }
            </div>
        </div>
    )
}

export default BestSeller;