import ErrorHandler from "../middleWares/error.js";
import Product from "../models/product.js";
import { asyncHandler } from '../middleWares/AsyncErr.js';
import Order from '../models/order.js';
import { redisClient } from "../server.js";

// Create a new order and clear relevant caches
export const newOrder = asyncHandler(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    // Clear cache related to user and admin orders
    await redisClient.del(`/order/me`);
    await redisClient.del(`/admin/orders`);

    res.status(200).json({
        success: true,
        message: "Placed Order"
    });
});

// Get a single order
export const getSingleOrder = asyncHandler(async (req, res, next) => {
    const cacheKey = req.url;
    const orderId = req.params.id;
    const cachedOrder = await redisClient.get(cacheKey);
    if(cachedOrder){
        return res.status(200).json({
            success:true,
            order:JSON.parse(cachedOrder)
        })
    }

    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler("order not found", 404));
    }

    // Cache the response
    await redisClient.setex(cacheKey, 3600, JSON.stringify(order)); // Cache for 1 hour

    res.status(200).json({
        success: true,
        order
    });
});

// Get all orders for a specific user
export const myOrders = asyncHandler(async (req, res, next) => {
    console.log("Line 70 - ",req.url);
    const userId = req.user._id;
    const cacheKey = req.url;
    const cachedOrder = await redisClient.get(cacheKey);
    if(cachedOrder){
        return res.status(200).json({
            success:true,
            orders:JSON.parse(cachedOrder)
        })
    }
    const orders = await Order.find({ user: userId });

    // Cache the response
    await redisClient.setex(cacheKey, 3600, JSON.stringify(orders)); // Cache for 1 hour

    res.status(200).json({
        success: true,
        orders
    });
});

// Admin: Get all orders
// req.url: This contains the URL path relative to the domain, including the query string (e.g., /admin/orders?page=1&limit=10), but it does not include any base path that may have been set by middleware like a router prefix or base path.

// req.originalUrl: This contains the full URL path that was originally requested, including the query string, even if some middleware has modified the path (for example, when using routers or mounted sub-paths).
export const getAllOrders = asyncHandler(async (req, res, next) => {
    const cacheKey = req.url;
    console.log('Original url -',req.originalUrl);
    console.log('url -',req.url);
    const cachedData = await redisClient.get(cacheKey);
    if(cachedData){
        const { totalAmount, orders } = JSON.parse(cachedData);
        return res.status(200).json({
            success:true,
            totalAmount,
            orders,
        })
    }
     try {
        const orders = await Order.find();
        const totalAmount = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        await redisClient.setex(cacheKey, 3600, JSON.stringify({ totalAmount, orders })); // Cache for 1 hour
        res.status(200).json({
            success: true,
            totalAmount,
            orders,
        });
    } catch (err) {
        next(new ErrorHandler("Failed to fetch orders", 500));
    }
});

// Update order status and clear relevant cache
export const updateOrder = asyncHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id);
    if (!order){
        return next(new ErrorHandler("order not found", 404));
    }

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('You have already delivered this order', 400));
    }

    if (req.body.status === "shipped") {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });
    }
    
    order.orderStatus = req.body.status;
    if (req.body.status === 'Delivered') {
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });

    // Clear cache for the updated order and related orders list
    await redisClient.del(`/order/${req.params.id}`);
    await redisClient.del(`/order/me`);
    await redisClient.del(`/admin/orders`);

    res.status(200).json({
        success: true
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false });
}

// Admin: Delete order and clear relevant cache
export const deleteOrder = asyncHandler(async (req, res, next) => {
    const orderId = req.params.id;
    const userId = req.user._id;
    
    // Delete the order
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    const userOrders = await Order.find({user:userId});
    await redisClient.setex(`order/me`,3600,JSON.stringify(userOrders));

    await redisClient.del(`/order/${orderId}`);
    await redisClient.del(`/admin/orders`);
        
    res.status(200).json({
        success: true,
        message:"Order deleted Successfully",
    });
});

// import ErrorHandler from "../middleWares/error.js";
// import Product from "../models/product.js";
// import {asyncHandler} from '../middleWares/AsyncErr.js'
// import Order from '../models/order.js';

// export const newOrder = asyncHandler(async(req,res,next)=>{
//     const {
//         shippingInfo,
//         orderItems,
//         paymentInfo,
//         itemsPrice,
//         taxPrice,
//         shippingPrice,
//         totalPrice,
//       } = req.body;
//      const order = await Order.create({
//         shippingInfo,
//         orderItems,
//         paymentInfo,
//         itemsPrice,
//         taxPrice,
//         shippingPrice,
//         totalPrice,
//         paidAt:Date.now(),
//         user:req.user._id,
//      })
//      res.status(200).json({
//         success:true,
//         message:"Placed Order"
//      })

// })

// export const getSingleOrder = asyncHandler(async(req,res,next)=>{
//     const order = await Order.findById(req.params.id).populate(
//         "user",
//         "name email"
//     )
//     if(!order){
//         return next(new ErrorHandler("order not found",404));
//     }
//     res.status(200).json({
//         success:true,
//         order
//     })
    
// })

// export const myOrders = asyncHandler(async(req,res,next)=>{
//   try {
//     console.log("User:", req.user);
//     const orders = await Order.find({user:req.user._id});
//     console.log(orders);
//     res.status(200).json({
//         success:true,
//         orders
//     })  
//   } catch (error) {
//     return next(new ErrorHandler("orders not found",404));
//   }
// })
// //for admin
// export const getAllOrders = asyncHandler(async(req,res,next)=>{
//     const orders = await Order.find();

//     let totalAmount = 0;
//     orders.forEach((i)=>{
//         totalAmount += i.totalPrice;
//     })
//     res.status(200).json({
//         success:true,
//         totalAmount,
//         orders,
        
//     }) 
// })

// export const updateOrder = asyncHandler(async(req,res,next)=>{
//     const order = await Order.findById(req.params.id);
//     if(!order){
//         return next(new ErrorHandler("order not found",404));
//     }

//     if(order.orderStatus === 'Delivered'){
//         return next(new ErrorHandler('You have already delivered this order',400));
//     }
//     if(req.body.status === "shipped"){
//         order.orderItems.forEach(async(o)=>{
//             await updateStock(o.product,o.quantity);
//         })
//     }
//    order.orderStatus = req.body.status;
//    if(req.body.status === 'Delivered'){
//     order.deliveredAt = Date.now();
//    }
//    await order.save({validateBeforeSave : false});
//    res.status(200).json({
//     success:true
//    })
// })

// async function updateStock(id,quantity){
//     const product = await Product.findById(id);
//     product.stock = product.stock - quantity;
//     await product.save({validateBeforeSave:false});
// }
// //admin
// export const deleteOrder = asyncHandler(async(req,res,next)=>{
//     Order.findOneAndDelete(req.params.id,(err)=>{
//      if(err){
//         return next(new ErrorHandler("order not found",404));
//      }
//     })
//     res.status(200).json({
//         success:true
//     })
// })
