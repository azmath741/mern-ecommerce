import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getAdminStats,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createOrder).get(protect, adminOnly, getAllOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/stats/overview").get(protect, adminOnly, getAdminStats);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/status").put(protect, adminOnly, updateOrderStatus);

export default router;

