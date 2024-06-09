import Cart from "./Cart.js";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import Product from "../product/Product.js";
import {sendSuccess} from "../../utils/resposeSender.js";

const getCart = catchAsync(async (req, res) => {
    const cart = await Cart.findOne({user: req.user.id});
    if (!cart) {
        throw new AppError("Cart not found", 404);
    }
    sendSuccess(res, cart);
});

const addToCart = catchAsync(async (req, res) => {
    const {productId, quantity} = req.body;
    const userId = req.user.id;

    if (!productId) {
        throw new AppError("Please provide a valid product ID", 400);
    }

    if (quantity === undefined) {
        throw new AppError("Please provide a quantity", 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError("Product not found", 404);
    }

    if (quantity > product.availableStock) {
        throw new AppError("Requested quantity exceeds available stock", 400);
    }

    let cart = await Cart.findOne({user: userId});

    if (!cart) {
        cart = new Cart({user: userId, items: []});
    }

    await cart.addItem(product, quantity);
    sendSuccess(res, cart, 200);
});

// Update the quantity of an item in the cart
const updateCartItem = catchAsync(async (req, res) => {
    const {productId, quantity} = req.body;
    const userId = req.user.id;

    if (quantity < 0) {
        throw new AppError('Quantity cannot be negative', 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError("Product not found", 404);
    }

    if (quantity > product.availableStock) {
        throw new AppError("Requested quantity exceeds available stock", 400);
    }

    const cart = await Cart.findOne({user: userId});

    if (!cart) {
        throw new AppError('Cart not found', 404);
    }

    await cart.updateItemQuantity(productId, quantity);
    sendSuccess(res, cart, 200);
});

// Increment the quantity of an item in the cart
const incrementCartItem = catchAsync(async (req, res) => {
    const {productId} = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({user: userId});

    if (!cart) {
        throw new AppError('Cart not found', 404);
    }

    const item = cart.items.find(item => item.product.toString() === productId);

    if (!item) {
        throw new AppError('Item not found in cart', 404);
    }

    const product = await Product.findById(productId);
    if (item.quantity + 1 > product.availableStock) {
        throw new AppError("Requested quantity exceeds available stock", 400);
    }

    item.quantity += 1;
    product.availableStock -= 1;

    await cart.save();
    await product.save();
    sendSuccess(res, cart, 200);
});

// Decrement the quantity of an item in the cart
const decrementCartItem = catchAsync(async (req, res) => {
    const {productId} = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({user: userId});

    if (!cart) {
        throw new AppError('Cart not found', 404);
    }

    const item = cart.items.find(item => item.product.toString() === productId);

    if (!item) {
        throw new AppError('Item not found in cart', 404);
    }

    if (item.quantity === 1) {
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        cart.items.splice(itemIndex, 1);
        const product = await Product.findById(productId);
        if (product) {
            product.availableStock += 1;
            await product.save();
        }
        await cart.save();
        return sendSuccess(res, cart, 200);
    }

    item.quantity -= 1;
    const product = await Product.findById(productId);
    product.availableStock += 1;

    await cart.save();
    await product.save();
    sendSuccess(res, cart, 200);
});

// Remove an item from the cart
const removeCartItem = catchAsync(async (req, res) => {
    const {productId} = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({user: userId});

    if (!cart) {
        throw new AppError('Cart not found', 404);
    }

    await cart.removeItem(productId);
    sendSuccess(res, cart, 200);
});

// Remove the entire cart
const removeTheCart = catchAsync(async (req, res) => {
    const userId = req.user.id;

    const cart = await Cart.findOneAndDelete({user: userId});

    if (!cart) {
        throw new AppError('Cart not found', 404);
    }

    sendSuccess(res, "Cart deleted", 200);
});

export default {
    getCart,
    addToCart,
    updateCartItem,
    incrementCartItem,
    decrementCartItem,
    removeCartItem,
    removeTheCart,
};
