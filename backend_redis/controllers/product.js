import ErrorHandler from "../middleWares/error.js";
import Product from "../models/product.js";
import {asyncHandler} from '../middleWares/AsyncErr.js'
import ApiFeatures from "../utils/apiFeatures.js";
import cloudinary from 'cloudinary';
import mongoose from "mongoose";
import { redisClient } from "../server.js";

const invalidateCache = async (cacheKey) => {
  try {
    await redisClient.del(cacheKey); // Remove the cached data
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};


export const newProduct = asyncHandler(async(req,res,next)=>{
  let images = [];
  if(typeof req.body.images == 'string'){
   images.push(req.body.images);
  }else{
   images = req.body.images;
  }
  const imagesLinks=[];
  for(let i=0;i<images.length;i++){
   const result = await cloudinary.v2.uploader.upload(images[i],{
      folder:"products",
   });

   imagesLinks.push({
      public_id: result.public_id,
      url:result.secure_url,
   })
  }
  req.body.images = imagesLinks;
//   -----------------------------------------------------------------------------
   req.body.user = req.user.id;
   const product = await Product.create(req.body);
   res.status(201).json({
      success:true,
      product,
   })

});
//Get All products for Admin
export const getAdminProducts = asyncHandler(async(req,res,next)=>{
  const cacheKey = req.originalUrl;
  const cachedData = await redisClient.get(cacheKey);
  
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }

  const products = await Product.find();
  if (!products) return next(new ErrorHandler("Product not found", 404));

  const responseData = {
    success: true,
    products,
  };
  await redisClient.setex(cacheKey, 3600, JSON.stringify(responseData));
  return res.status(200).json(responseData);
});

export const getAllProducts = asyncHandler(async(req,res,next)=>{
   const resultPerPage = 8;
   const productsCount = await Product.countDocuments();
   const apiFeature = new ApiFeatures(Product.find(), req.query)   // query , querystr
    .search()
    .filter()
    .pagination(resultPerPage)

    let products = await apiFeature.query;
    let filteredProductsCount = products.length;

   //  products = await apiFeature.query;
   const responseData = {
    success: true,
    message: "Here are all the products",
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  };

  res.status(200).json(responseData); 
});

export const updateProduct = asyncHandler(async (req, res, next) => {
   try {
     let product = await Product.findById(req.params.id);
     if (!product) {
       return next(new ErrorHandler("Product not found", 404));
     }
 
     let images = [];
     if (typeof req.body.images === 'string') {
       images.push(req.body.images);
     } else if (Array.isArray(req.body.images)) {
       images = req.body.images;
     }
 
     if (images.length > 0) {
       // Deleting old images from Cloudinary
       for (let i = 0; i < product.images.length; i++) {
         try {
           await cloudinary.v2.uploader.destroy(product.images[i].public_id);
         } catch (error) {
           console.error("Error deleting image:", error);
         }
       }
 
       const imagesLinks = [];
       for (let i = 0; i < images.length; i++) {
         try {
           if (typeof images[i] === 'string') {
             const result = await cloudinary.v2.uploader.upload(images[i], {
               folder: "products",
             });
             imagesLinks.push({
               public_id: result.public_id,
               url: result.secure_url,
             });
           } else {
             console.error("Invalid image format:", images[i]);
           }
         } catch (error) {
           console.error("Error uploading image:", error);
         }
       }
       req.body.images = imagesLinks;
     }
 
     product = await Product.findByIdAndUpdate(req.params.id, req.body, {
       new: true,
       runValidators: true,
       useFindAndModify: false,
     });
 
      // Invalidate cache after updating the product
      const cacheKey = `/products`; // Define cache key to be invalidated
      await invalidateCache(cacheKey);

     res.status(200).json({
       success: true,
       message: "Product updated",
       product,
     });
   } catch (error) {
     console.error("Internal Server Error:", error);
     return next(new ErrorHandler("Internal Server Error", 500));
   }
 });
 
export const deleteProduct = asyncHandler(async (req, res) => {
   const product =  await Product.findById(req.params.id)
   if(product){
      //deleting images from cloudinary
      for (let i = 0; i < product.images.length; i++) {
         await cloudinary.v2.uploader.destroy(product.images[i].public_id);
       }
       
       await Product.findOneAndDelete(req.params.id);
      // Invalidate cache after deleting the product
      const cacheKey = `/products`; // Define cache key to be invalidated
      await invalidateCache(cacheKey);

      res.status(200).json({
         success:true,
         message : 'Product Removed'})
      } 
   else{
      return next(new ErrorHandler("Product not found",404));
   }
})
 //getProductDetails
export const getProductById = asyncHandler(async (req, res,next) => {
   const product =  await Product.findById(req.params.id)
   if(product){
       res.json({
         success:true,
         product,
       })
   } else{
      return next(new ErrorHandler("Product not found",404));
   }
})

export const createProductReview = asyncHandler(async(req,res,next)=>{
   const{rating ,comment ,productId} = req.body;

   const review ={
      user:req.user._id,
      name:req.user.name,
      rating: Number(rating),
      comment,
   };

   const product = await Product.findById(productId); 

  const isReviewed = product.reviews.find((rev)=>
  { rev.user.toString() === req.user._id.toString() }
  );
   if(isReviewed){
  product.reviews.forEach((rev)=>{
   if(rev.user.toString() === req.user._id.toString() ){
      (rev.rating = rating),(rev.comment = comment)  ; }
  })
   }
   else{
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length
   }
   let avg = 0;

   product.reviews.forEach((rev) => {
      avg = avg + rev.rating;})

  product.rating= avg/product.reviews.length;

  await product.save({ validateBeforeSave: false });          // its very imp to pass validateBeforeSave option 

  await invalidateCache(`/product/${productId}`);
  res.status(200).json({
   success:true
  })
});

export const getAllReviews = asyncHandler(async(req,res,next)=>{

   const product = await Product.findById(req.query.productId);
   if(!product){
      return next(new ErrorHandler("Product not found",404));
   }
   res.status(200).json({
      success:true,
      reviews: product.reviews,
     })
})

export const deleteReviews = asyncHandler(async(req,res,next)=>{

   const product = await Product.findById(req.query.productId);
   if(!product){
      return next(new ErrorHandler("Product not found",404));
   }
   const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );

let avg = 0;

product.reviews.forEach((rev) => {
   avg = avg + rev.rating;
})

const newRating = avg/product.reviews.length;

const numOfReviews = product.reviews.length;

await Product.findByIdAndUpdate(req.query.productId,{
   reviews,
   rating : newRating,
   numOfReviews ,
},{ new:true,
   runValidators:true,
   useFindAndModify: false, })

  await invalidateCache(`/product/${req.query.productId}`);

   res.status(200).json({
      success:true,
     })
})
         
export const getReviewsByUserId = asyncHandler(async(req,res)=>{
  const {userId} = req.params;
  try {
    const reviews = await Product.aggregate([
      {
        $match:{'reviews.user' :  new mongoose.Types.ObjectId(userId)}
      },{
        $unwind: '$reviews'
      },{
        $match:{'reviews.user':  new mongoose.Types.ObjectId(userId)}
      },{
        $project:{
          productId:'$_id',
          reviews:'$reviews'
        }
      }
    ]);

    if(reviews.length === 0){
      return res.status(404).json({
        message:"No reviews for this user"
      })
    }

    return res.status(200).json(reviews)  

  } catch (error) {
    console.error("Line 270 in the productController",error);
    return res.status(500).json({message:"Internal Server Error"})
  }
});

export const getAllReviewsForAdmin = asyncHandler(async (req, res) => {
  const { page, limit } = req.query; 
  try {
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    const reviews = await Product.aggregate([
      // Match all products (you can add filters here if needed)
      {
        $match: {}
      },
      // Unwind the reviews array to separate each review as its own document
      {
        $unwind: '$reviews'
      },
      // Lookup to join user data with reviews
      {
        $lookup: {
          from: 'users', // The name of the users collection
          localField: 'reviews.user',
          foreignField: '_id',
          as: 'reviewer' // Alias for the joined user data
        }
      },
      // Unwind the user (reviewer) array to get each reviewer's details
      {
        $unwind: {
          path: '$reviewer',
          preserveNullAndEmptyArrays: true // Ensure null for products without reviews
        }
      },
      // Project only the necessary fields
      {
        $project: {
          productId: '$_id',
          productName: '$name',
          reviewId: '$reviews._id',
          userId: '$reviewer._id',
          userName: '$reviewer.name',
          userEmail: '$reviewer.email',
          rating: '$reviews.rating',
          comment: '$reviews.comment',
          date: '$reviews.createdAt'
        }
      },
      // Optional: Sort reviews by creation date (descending)
      {
        $sort: { 'reviews.createdAt': -1 }
      },
      // Skip the reviews that belong to previous pages
      {
        $skip: skip
      },
      // Limit the number of reviews per page
      {
        $limit: parseInt(limit)
      }
    ]);

    // Fetch the total count of reviews to calculate total pages
    const totalReviews = await Product.aggregate([
      { $unwind: '$reviews' },
      { $count: 'totalReviews' }
    ]);

    const totalReviewsCount = totalReviews.length > 0 ? totalReviews[0].totalReviews : 0;
    const totalPages = Math.ceil(totalReviewsCount / limit);

    // If no reviews are found, return a 404 error
    if (reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No reviews found for any products'
      });
    }

    // Return the paginated reviews along with pagination info
    return res.status(200).json({
      success: true,
      reviews,
      totalReviews: totalReviewsCount,
      totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error in aggregation pipeline', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});
