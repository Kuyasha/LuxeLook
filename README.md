# LuxeLook – FullStack E-commerce Clothing Store

LuxeLook is a modern, scalable full-stack e-commerce application for a clothing brand. Built with React.js, Node.js, Express.js, and MongoDB, the project delivers a seamless shopping experience across devices. The application integrates features like secure user authentication, product filtering, dynamic cart handling, payment processing, and an admin dashboard for complete product and order management.

The frontend is built using React and styled for responsiveness, with state management and business logic handled entirely via the React Context API. Toast notifications provide real-time user feedback, while REST APIs fetch data from a decoupled backend built with Express.js. All media is stored on Cloudinary, and payment is securely processed via Stripe and Razorpay. The entire project is deployed using Vercel for a fast and reliable experience.





---
## Live Demo

[Click here to view the user website](https://luxelook-frontend.vercel.app) 

[Click here to view the admin panel](https://luxelook-admin.vercel.app) 





---
## Key Features

## 1) User-Facing Website

- Product Catalog

     i) Dynamic listing of clothing products with images, descriptions, prices, and bestseller labels.

    ii) Products fetched from MongoDB via secure backend APIs.



- Search and Advanced Filtering

    i) Keyword-based search.

    ii)Product filtering based on:

           -- Category (e.g., men, women, kids)

           -- Type (e.g., shirts, pants, dresses)

           -- Price (e.g., Low to High)

           -- Best Sellers



- Latest Collection Component

    i) Highlights newly added products to engage returning customers.



- Product Details Page

    i) Includes detailed product information.

   ii) Displays related products based on the same category and subcategory/type.

   iii) Option to add to cart directly.



- Cart Functionality

    i)Add, remove, and update product quantities in cart.

    ii)Cart data is persisted using localStorage.

    iii)Real-time cart total updates.



- Authentication and Authorization

    i)JWT-based user login and registration.

    ii)Secure access to user-specific features (e.g., order history).



- Checkout & Payment

    i) Multiple payment methods:

         -- Cash on Delivery

         -- Razorpay

         -- Stripe

    ii) Real-time payment status updates displayed on order confirmation.



- Order History

    i) Users can view all their past orders with payment and delivery status.



- Toast Notifications

    i) Instant visual feedback for all major actions (e.g., login, add to cart, checkout).



- Responsive Design

   i) Fully optimized for mobile, tablet, and desktop views.

---



## 2)Admin Dashboard

- Secure Admin Login

    i)Admin access protected using JWT authentication.


- Product Management

   i)Create, edit, and delete products.

   ii)Upload product images directly to Cloudinary.

   iii)Assign products as “Best Sellers” or “New Collection.”


- Order Management

    i)View all customer orders.

    ii)Update payment and shipping status.


- API-Driven Dashboard

    i)Admin panel fetches and displays real-time data from backend APIs.

---



## 3)State Management

- All global state and business logic (cart, authentication, product filtering, UI feedback) is handled using React Context API.

- Efficient context structure ensures clean, scalable logic management throughout the app.









---

## Tech Stack

- Frontend : React.js ,React Router , Axios, Tailwind CSS (or CSS Modules), React Context API, Toast notifications (e.g., react-toastify)

- Backend : Node.js, Express.js, MongoDB & Mongoose, JSON Web Token (JWT), Bcrypt.js, Stripe & Razorpay Payment Integration, Cloudinary for image hosting

- Deployment : Vercel

---







## API ENDPOINTS

- User APIs

    localhost:4000/api/user/register => for user registration
  
    localhost:4000/api/user/login => for user login
  
    localhost:4000/api/user/admin => for admin login
  

- Product APIs

     localhost:4000/api/product/add

     localhost:4000/api/product/remove

     localhost:4000/api/product/list

     localhost:4000/api/product/single


- Cart APIs

     localhost:4000/api/cart/add
  
     localhost:4000/api/cart/update

     localhost:4000/api/cart/get


- Order APIs

     localhost:4000/api/order/list
  
     localhost:4000/api/order/status

     localhost:4000/api/order/userorders


 - All Order APIs Related to Payment

     localhost:4000/api/order/place => For COD
  
     localhost:4000/api/order/stripe => For Stripe Payment

     localhost:4000/api/order/razorpay => For Razorpay Payment

     localhost:4000/api/order/verifyStripe

     localhost:4000/api/order/verifyRazorpay

     

    

  




---

## SCREENSHOTS








