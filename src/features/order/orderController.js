import expressAsyncHandler from "express-async-handler";
import { sendError, sendSuccess } from "../../utils/resposeSender.js";
import orderService from "./orderService.js";

const createOrderFromCart = expressAsyncHandler(async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const order = await orderService.createOrderFromCart(
      req.user._id,
      shippingAddress,
    );
    sendSuccess(res, order, 201);
  } catch (error) {
    sendError(res, "Failed to create order from cart", 500, error);
  }
});

const getAllOrders = expressAsyncHandler(async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    sendSuccess(res, orders);
  } catch (error) {
    sendError(res, "Failed to fetch orders", 500, error);
  }
});
const getOrderById = expressAsyncHandler(async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    sendSuccess(res, order);
  } catch (error) {
    sendError(res, "Failed to fetch order details", 500, error);
  }
});
const updateOrderStatus = expressAsyncHandler(async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body);
    sendSuccess(res, order);
  } catch (error) {
    sendError(res, "Failed to update order status", 500, error);
  }
});
const getUserOrders = expressAsyncHandler(async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.user._id);
    sendSuccess(res, orders);
  } catch (error) {
    sendError(res, "Failed to fetch user orders", 500, error);
  }
});
const getUserOrderDetail = expressAsyncHandler(async (req, res) => {
  try {
    const orderid = req.params.id;
    const orderdetail = await orderService.getUserOrderDetail(
      req.user._id,
      orderid,
    );
    sendSuccess(res, orderdetail);
  } catch (error) {
    sendError(res, "Failed to fetch user orders", 500, error);
  }
});
export default {
  createOrderFromCart,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getUserOrders,
  getUserOrderDetail,
};
