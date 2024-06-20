import {sendSuccess} from "../../utils/resposeSender.js";
import catchAsync from "../../utils/catchAsync.js";
import orderModel from "./Order.js";
import Order from "./Order.js";
import Cart from "../cart/Cart.js";

// User
const getUserOrders = catchAsync(async (req, res) => {
    const orders = await orderModel.find({user: req.user._id}).select("-items");
    sendSuccess(res, orders, 200);
});

const getUserOrderDetail = catchAsync(async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user._id;

    const orderDetail = await orderModel.findOne({user: userId, _id: orderId});
    if (!orderDetail) {
        throw new AppError("Order not found", 404);
    }
    sendSuccess(res, orderDetail, 200);
});

const createOrderFromCart = catchAsync(async (req, res) => {
    const {shippingAddress} = req.body;
    const userId = req.user._id;
    const cart = await Cart.findOne({user: userId}).populate("items.product");

    if (!cart) {
        throw new AppError("Cart not found", 404);
    }
    if (cart.items.length === 0) {
        throw new AppError("Cart is empty", 400);
    }

    const orderData = {
        user: userId,
        items: cart.items.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            coverImage: item.product.coverImage,
        })),
        totalPrice: cart.items.reduce(
            (acc, item) => acc + item.quantity * item.product.price,
            0
        ),
        shippingAddress,
        paymentMethod: "Credit card",
    };

    const order = await Order.create(orderData);

    cart.items = [];
    await cart.save();

    sendSuccess(res, order, 201);
});

// Admin
const getAllOrders = catchAsync(async (req, res) => {
    const orders = await orderModel.find().populate("user", "name username email").select("-items");
    sendSuccess(res, orders, 200);
});

const getOrderById = catchAsync(async (req, res) => {
    const order = await orderModel.findById(req.params.id).populate("user", "name email username");
    if (!order) {
        throw new AppError("Order not found", 404);
    }
    sendSuccess(res, order, 200);
});

const updateOrderStatus = catchAsync(async (req, res) => {
    const orderId = req.params.id;
    const order = await orderModel.findById(orderId);

    if (!order) {
        throw new AppError("Order not found", 404);
    }

    const {isPaid, isDelivered} = req.body;

    if (isDelivered !== undefined) {
        order.isDelivered = isDelivered;
    }

    await order.save();
    sendSuccess(res, order, 200);
});

export default {
    createOrderFromCart,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getUserOrders,
    getUserOrderDetail,
};
