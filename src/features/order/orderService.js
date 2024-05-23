import CartModel from "../cart/cartModel.js";
import OrderModel from "./orderModel.js";
import orderModel from "./orderModel.js";

const createOrderFromCart = async (userId, shippingAddress) => {
  const cart = await CartModel.findOne({ userId }).populate("items.productId");

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const orderData = {
    userId,
    items: cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      quantity: item.quantity,
      price: item.productId.price,
      image: item.productId.image,
    })),
    totalPrice: cart.items.reduce(
      (acc, item) => acc + item.quantity * item.productId.price,
      0,
    ),
    shippingAddress,
    paymentMethod: "Pay on Delivery",
  };

  const order = new OrderModel(orderData);
  await order.save();

  // Clear the cart
  cart.items = [];
  await cart.save();

  return order;
};

const getAllOrders = async () => {
  return await orderModel.find().populate("userId", "name email");
};

const getOrderById = async (orderId) => {
  return await orderModel
    .findById(orderId)
    .populate("userId", "name email")
    .populate("items.productId", "name price");
};

const updateOrderStatus = async (orderId, updateData) => {
  const order = await orderModel.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  Object.keys(updateData).forEach((key) => {
    order[key] = updateData[key];
  });

  await order.save();
  return order;
};

export default {
  createOrderFromCart,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
