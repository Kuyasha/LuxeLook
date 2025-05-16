
import React, {useState} from "react";
import { assets } from "../assets/assets";

const Footer = () => {
    return(
    <div>
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
            <div>
                <img src={assets.logo} alt="" className="mb-5 w-32 rounded" />
                <p className="w-full md:w-2/3 text-gray-600 ">
                    Lorem ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsumhas the most power of logic.Lorem ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsumhas the most power of logic.
                </p>
            </div>
            <div>
                <p className="text-xl font-medium mb-5 ">COMPANY</p>
                <ul className="flex flex-col gap-1 text-gray-600">
                    <li>HOME</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            <div>
                <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
                <ul className="flex flex-col gap-1 text-gray-600">
                    <li>+1-212-456-7890</li>
                    <li>contact@luxelookyou.com</li>
                </ul>
            </div>
        </div>

        <div>
            <hr/>
            <p className="py-5 text-sm text-center">Copyright 2025@ luxelook.com - All Right Reserved</p>
        </div>

    </div>
    )
}

export default Footer;