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

    const cart = await Cart.findOne({user: userId});
    if (!cart) {
        throw new AppError('Cart not found', 404);
    }

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) {
        throw new AppError('Item not found in cart', 404);
    }

    const quantityChange = quantity - item.quantity;

    if (quantityChange > 0 && quantity > product.availableStock + item.quantity) {
        throw new AppError("Requested quantity exceeds available stock", 400);
    }

    item.quantity = quantity;

    if (quantityChange > 0) {
        product.availableStock -= quantityChange; // Decrement available stock
    } else {
        product.availableStock += -quantityChange; // Increment available stock
    }

    await cart.save();
    await product.save(); // Save the updated product
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
    product.availableStock -= 1;  // Decrement available stock

    await cart.save();
    await product.save();  // Save the updated product

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
            product.availableStock += 1;  // Increment available stock
            await product.save();  // Save the updated product
        }
        await cart.save();
        return sendSuccess(res, cart, 200);
    }

    item.quantity -= 1;
    const product = await Product.findById(productId);
    product.availableStock += 1;  // Increment available stock

    await cart.save();
    await product.save();  // Save the updated product

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

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex === -1) {
        throw new AppError('Item not found in cart', 404);
    }

    const item = cart.items[itemIndex];
    const product = await Product.findById(productId);
    if (product) {
        product.availableStock += item.quantity; // Increment available stock
        await product.save(); // Save the updated product
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    sendSuccess(res, cart, 200);
});

// Remove the entire cart
const removeTheCart = catchAsync(async (req, res) => {
    const userId = req.user.id;

    const cart = await Cart.findOne({user: userId});
    if (!cart) {
        throw new AppError('Cart not found', 404);
    }

    for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (product) {
            product.availableStock += item.quantity; // Increment available stock
            await product.save(); // Save the updated product
        }
    }

    await Cart.findOneAndDelete({user: userId});

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
