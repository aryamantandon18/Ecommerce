import express from 'express'
import { createProductReview, deleteProduct, deleteReviews, getAllProducts, getAllReviews, getProductById, newProduct, updateProduct } from '../controllers/product.js';
import { authorizeRole, isAuthenticated } from '../middleWares/auth.js';

const router = express.Router();

router.get("/products",getAllProducts);
router.post("/admin/product/new",isAuthenticated,authorizeRole("admin"),newProduct);
router.route("/admin/product/:id")
.put(isAuthenticated,authorizeRole("admin"),updateProduct)
.delete(isAuthenticated,authorizeRole("admin"),deleteProduct)

router.get("/product/:id",getProductById);
router.route("/product/review").put(isAuthenticated,createProductReview);
router.route("/product/reviews")
.get(getAllReviews)
.delete(isAuthenticated,deleteReviews);

export default router