import express from 'express';
import { authorizeRole, isAuthenticated } from '../middleWares/auth.js';
import { deleteOrder, getAllOrders, getSingleOrder, myOrders, newOrder, updateOrder } from '../controllers/order.js';

const router = express.Router();

router.post("/order/new", isAuthenticated, newOrder);
router.get("/order/me", isAuthenticated, myOrders);  // Apply cache for user orders
router.get("/order/:id", isAuthenticated, getSingleOrder); // Apply cache for single order
router.get("/admin/orders", isAuthenticated, authorizeRole("Admin"), getAllOrders); // Apply cache for all orders (admin)

router.route("/admin/order/:id")
    .put(isAuthenticated, authorizeRole("Admin"), updateOrder)
    .delete(isAuthenticated, authorizeRole("Admin"), deleteOrder)

export default router;
