
import express from "express";
import {placeOrder, placeOrderStripe, verifyStripe, placeOrderRazorpay, verifyRazorpay, allOrders, userOrders, updateStatus } from "../controllers/orderController.js";
import adminAuth from '../middleware/adminAuth.js';
import authUser from "../middleware/userAuth.js";

const orderRouter = express.Router();

//Admin Features
orderRouter.post('/list', adminAuth, allOrders); //all orders data from admin
orderRouter.post('/status', adminAuth, updateStatus); //to update order status from admin

//Payment Features For User
orderRouter.post('/place', authUser, placeOrder); //For COD
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);

//Only User Feature
orderRouter.post('/userorders', authUser, userOrders);//all orders for any user

//Verify Payment
orderRouter.post('/verifyStripe', authUser, verifyStripe);
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay);

export default orderRouter;