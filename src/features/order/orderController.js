import {sendSuccess} from "../../utils/resposeSender.js";
import catchAsync from "../../utils/catchAsync.js";
import orderModel from "./orderModel.js";
import OrderModel from "./orderModel.js";
import Cart from "../cart/Cart.js";


//user
const getUserOrders = catchAsync(async (req, res) => {
    const orders = await orderModel.find({user: req.user._id}).select("-items")
    sendSuccess(res, orders);

});
const getUserOrderDetail = catchAsync(async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user._id

    const orderDetail = await orderModel
        .findOne({user: userId, _id: orderId})
    sendSuccess(res, orderDetail);

});
const createOrderFromCart = catchAsync(async (req, res) => {
    const {shippingAddress} = req.body;

    const userId = req.user._id
    const cart = await Cart.findOne({user: userId}).populate("items.product");
    console.log(cart)

    if (!cart) {
        throw new Error("Cart not found");
    }
    if (cart.items.length === 0) {
        throw new Error("Cart is empty");
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
            0,
        ),
        shippingAddress,
        paymentMethod: "Credit card",
    };

    const order = await OrderModel.create(orderData)

    cart.items = [];
    await cart.save();

    sendSuccess(res, order, 201);

});


//admin
const getAllOrders = catchAsync(async (req, res) => {
    const orders = await orderModel.find().populate("user", "name username email").select("-items");
    sendSuccess(res, orders);

});
const getOrderById = catchAsync(async (req, res) => {
    const order = await orderModel
        .findById(req.params.id)
        .populate("user", "name email username")
    sendSuccess(res, order);

});

const updateOrderStatus = catchAsync(async (req, res) => {
    const orderId = req.params.id;
    const order = await orderModel.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    const {isPaid, isDelivered} = req.body;

    if (isDelivered !== undefined) {
        order.isDelivered = isDelivered;
    }

    await order.save();
    sendSuccess(res, order);
});


export default {
    createOrderFromCart,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getUserOrders,
    getUserOrderDetail,
};
