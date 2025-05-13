import react, {useState, useEffect} from "react";
import {backendUrl, currency} from '../App';
import axios from 'axios';
import {toast} from 'react-toastify';

const List = ({token}) =>{
    const [list,setList] = useState([]);
    
    //i)To Fetch all the products list
    const fetchList = async() =>{
        try{
            const response = await axios.get(backendUrl + '/api/product/list');
            if(response.data.success){
                setList(response.data.products);
            }else{
                toast.error(response.data.message);
            }
        }
        catch(error){
            console.log(error);
            toast.error(error.message);
        }
    }
    
    //ii)To Remove any particular product
    const removeProduct = async(id) =>{
        try{
            const response = await axios.post(backendUrl + '/api/product/remove', {id}, {headers:{token}});
            if(response.data.success){ //means if pdt is deleted successfully
                toast.success(response.data.message);
                await fetchList();
            }else{
                toast.error(response.data.message);
            }
        }
        catch(error){
            console.log(error);
            toast.error(error.message);
        }
    }
    
    //iii)To run the fetchList fn whenever the page is reloaded or loaded
    useEffect(()=>{
        fetchList()
    },[]);
 

    return(
        <>
            <p className="mb-2">All Products List</p>
            <div className="flex flex-col gap-2">
                {/* List Table Title */}
                <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b className="text-center">Action</b>
                </div>

                {/* Product List */}
                {
                    list.map((item,index)=>( /*className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr]] items-center gap-2 py-1 px-2 border text-sm" */
                        <div key={index} className="md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center px-2 py-1 border text-sm gap-2">
                            <img src={item.image[0]} className="w-12" alt=""/>
                            <p>{item.name}</p>
                            <p>{item.category}</p>
                            <p>{currency}{item.price}</p>
                            <p onClick={()=>removeProduct(item._id)} className="text-right md:text-center text-lg cursor-pointer">X</p>
                        </div>
                    ))
                } 
            </div>
        </>
    )
}

export default List;