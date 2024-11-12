import express from 'express';
import { createProductReview, deleteProduct, deleteReviews, getAdminProducts, getAllProducts, getAllReviews, getAllReviewsForAdmin, getProductById, getReviewsByUserId, newProduct, updateProduct } from '../controllers/product.js';
import { authorizeRole, isAuthenticated } from '../middleWares/auth.js';
import { cacheMiddleware } from '../middleWares/cacheMiddleware.js'; // Import the caching middleware

const router = express.Router();

// Apply cacheMiddleware to these routes
router.get("/products", cacheMiddleware, getAllProducts);
router.get("/admin/products", isAuthenticated, authorizeRole("Admin"), cacheMiddleware, getAdminProducts);
router.post("/admin/product/new", isAuthenticated, authorizeRole("Admin"), newProduct);
router.route("/admin/product/:id")
  .put(isAuthenticated, authorizeRole("Admin"), updateProduct)
  .delete(isAuthenticated, authorizeRole("Admin"), deleteProduct);
router.get("/product/:id",cacheMiddleware,getProductById);
router.route("/product/review").put(isAuthenticated, createProductReview);
router.route("/product/reviews")
  .get(cacheMiddleware,getAllReviews)
  .delete(isAuthenticated, deleteReviews);
router.get("/getReviewsForUser/:userId", isAuthenticated, getReviewsByUserId);
router.post("/admin/products/reviews",getAllReviewsForAdmin);
export default router;
