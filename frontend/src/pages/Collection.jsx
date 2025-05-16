import React, {useContext, useEffect, useState} from "react";
import {ShopContext} from '../context/ShopContext';
import { assets} from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";


const Collection = () => {
    const {products, search, showSearch} = useContext(ShopContext);
    
    //to make responsive,to hide filter options on small screen
    const [showFilter, setShowFilter] = useState(false);
    
    //Create category and subCategory array
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    
    //After filtering, all the filtered pdts will be saved in this array
    const [filterProducts, setFilterProducts] = useState([]);
    const [sortType, setSortType] = useState('relavent');
    


    //1)Create category array
    const toggleCategory = (e) => {
        if(category.includes(e.target.value)){
            setCategory(prev => prev.filter(item => item !== e.target.value))
        }
        else{ //when this type is not available in the category array
            setCategory(prev => [...prev, e.target.value])
        }
    }
    
    //2)Create subcategory array
    const toggleSubCategory = (e) => {
        if(subCategory.includes(e.target.value)){
            setSubCategory(prev => prev.filter(item => item!==e.target.value))
        }
        else{ //when this type is not available in the subcategory array
            setSubCategory(prev => [...prev, e.target.value])
        }
    }

    //3)Function to filter Products
    const applyFilter = () =>{
        let productsCopy = products.slice();
        
        //if we type anything on the searchBar then it will display the product
        //related to searched item
        if(showSearch && search){
            productsCopy=productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        }
        if(category.length > 0){
            productsCopy = productsCopy.filter(item => category.includes(item.category))
        }
        if(subCategory.length > 0){
            productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
        }
        setFilterProducts(productsCopy);
    }

    //4)Sort Products (fpCopy = filterProductsCopy)
    //Products will be sorted on filtered pdts
    const sortProduct = () => {
        let fpCopy = filterProducts.slice(); 
        switch(sortType){
            case 'low-high':
                setFilterProducts(fpCopy.sort((a,b) => (a.price - b.price)));
                break;
            case 'high-low':
                setFilterProducts(fpCopy.sort((a,b) => (b.price - a.price)));
                break;
            default:
                applyFilter();
                break;
        }
    }

    useEffect(()=>{
        applyFilter();
    }, [category, subCategory, search, showSearch, products]);

    useEffect(() => {
        sortProduct();
    }, [sortType]);

    

    return(
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
            
            {/*1)LEFT SIDE => FILTER OPTIONS */}
            <div className="min-w-60">
                <p onClick={()=>setShowFilter(!showFilter)} className="my-2 text-xl flex items-center cursor-pointer gap-2">
                    FILTERS <img src={assets.dropdown_icon} alt="" className={`h-3 sm:hidden ${showFilter? '' : 'rotate-90'}`} />
                </p>
                
                {/* i) category filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter? '' : 'hidden'} sm:block`}>
                    <p className="mb-3 text-sm font-medium">CATEGORIES</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className="flex gap-2">
                            <input type="checkbox" className="w-3" value={'Men'} onChange={toggleCategory}/> Men
                        </p>
                        <p className="flex gap-2">
                            <input type="checkbox" className="w-3" value={'Women'} onChange={toggleCategory}/> Women
                        </p>
                        <p className="flex gap-2">
                            <input type="checkbox" className="w-3" value={'Kids'} onChange={toggleCategory}/> Kids
                        </p>
                    </div>
                </div>
                {/* ii)sub-category filter */}
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter? '' : 'hidden'} sm:block`}>
                    <p className="mb-3 text-sm font-medium">TYPE</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className="flex gap-2">
                            <input type="checkbox" className="w-3" value={'Topwear'} onChange={toggleSubCategory}/> Topwear
                        </p>
                        <p className="flex gap-2">
                            <input type="checkbox" className="w-3" value={'Bottomwear'} onChange={toggleSubCategory}/> Bottomwear
                        </p>
                        <p className="flex gap-2">
                            <input type="checkbox" className="w-3" value={'Winterwear'} onChange={toggleSubCategory}/> Winterwear
                        </p>
                    </div>
                </div>
            </div>


            {/* 2)RIGHT SIDE => PRODUCTS */}
            <div className="flex-1">
                {/* i)Title & Sorting products  */}
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text1={'ALL'} text2={'COLLECTIONS'}/>
                    <select onChange={(e)=>setSortType(e.target.value)} className="border border-gray-300 text-sm px-2">
                        <option value="relavent">Sort by: Relavant</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>
                </div>
                
                {/* ii)Map Products */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
                    {
                        filterProducts.map((item,index) => (
                            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Collection;