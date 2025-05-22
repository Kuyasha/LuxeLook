import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe'; //here Stripe should be capital
import razorpay from 'razorpay';


//Global Variables
const currency = 'inr';
const deliveryCharge = 10;


//Gateway Initialize
//i)use stripe_secret_key to create the instance of stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//ii)use RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET to create the instance of razorpay  
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});



//1)PLACING ORDERS USING CASH ON DELIVERY (FRONTEND)
const placeOrder = async (req, res) => {
    try {
        //i)Extract all these
        const { userId, items, amount, address } = req.body;
        //ii)orderData obj is created
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }
        //iii)save new order with orderData at 'order' collection in database
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        //iv)After new order is saved, cartData should be empty
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: 'Order Placed' });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


//2)DISPLAY ALL ORDERS FOR A PARTICULAR USER IN FRONTEND (FRONTEND)
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });//as on every order,we have added userId of that user
        res.json({ success: true, orders });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


//3)DISPLAY ALL ORDERS DATA FOR ADMIN PANEL (ADMIN)
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


//4)UPDATE ORDER STATUS FROM ADMIN PANEL (ADMIN)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}




//5)PLACING ORDERS USING STRIPE (FRONTEND)
const placeOrderStripe = async (req, res) => {
    try {
        //i)Extract all these
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers; //whenever create any req,then in the header origin property will be created which includes frontend url
        
        //ii)orderData obj is created
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }
        
        //iii)Save new order with orderData at 'order' collection in database
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        
        //iv)Create line_items using that we can execute Stripe payments
        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));
        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        //v)Create new session using the line_items
        //if the payment successful,then redirect to the success page
        //if the payment fails,then redirect to cancel url
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//6)VERIFY STRIPE (FRONTEND) (To Verify the Payment)
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}



//7)PLACING ORDERS USING RAZORPAY (FRONTEND)
const placeOrderRazorpay = async (req, res) => {
    try {
        //i)Extract all these
        const { userId, items, amount, address } = req.body;
        //ii)orderData obj is created
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        }
        //iii)Save new order with orderData at 'order' collection in database
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        //iv)create options
        const options = {
            amount: amount * 100, //getting this from req.body
            currency: currency.toUpperCase(), //for razorpay currency is in uppercase
            receipt: newOrder._id.toString(),
        }
        //v)Create razorpay payment using options
        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                //console.log(error);
                return res.json({ success: false, message: error });
            }
            res.json({ success: true, order });
        })
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

//8)VERIFY RAZORPAY (FRONTEND)
const verifyRazorpay = async (req, res) => {
    try {
        const { userId, razorpay_order_id } = req.body;

        //lets find the order details from the razorpay_order_id
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        //console.log(orderInfo);

        if(orderInfo.status === 'paid'){
            await orderModel.findByIdAndUpdate(orderInfo.receipt, {payment:true}); //inside receipt id is saved
            await userModel.findByIdAndUpdate(userId, {cartData:{}}); //clear the user cart data
            res.json({success:true, message:'Payment Successful'});
        }
        else{
            res.json({success:false, message:'Payment Failed'});
        }
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


export { placeOrder, placeOrderStripe, verifyStripe, placeOrderRazorpay, verifyRazorpay, allOrders, userOrders, updateStatus };


