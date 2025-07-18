
import react from "react";
import { assets } from "../assets/assets";

//setToken is passed as props from (Navbar Component inside App.jsx) and
//destructure it here
const Navbar = ({setToken}) =>{
    return(
        <div className="flex items-center py-2 px-[4%] justify-between">
            <img className='w-[max(6%,40px)]' src={assets.logo} alt="" />
            
            {/*On clicking logout btn,setToken will be empty and hence logged out*/}
            <button onClick={()=>setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
        </div>
    )
}

export default Navbar;