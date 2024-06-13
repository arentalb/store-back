import {authenticate, authorizeTo} from "../../middlwares/authMiddleware.js";
import cartController from "./cartController.js";
import express from "express";

const router = express.Router();

// Get the cart for the authenticated user
// URL: GET /carts
router.get('/',
    authenticate,
    authorizeTo('User'),
    cartController.getCart);

// Add to cart, update quantity, or remove item if quantity is zero
// URL: POST /carts
router.post('/',
    authenticate,
    authorizeTo('User'),
    cartController.addToCart);

// Update the quantity of an item in the cart
// URL: PUT /carts
router.put('/',
    authenticate,
    authorizeTo('User'),
    cartController.updateCartItem);

// Increment the quantity of an item in the cart
// URL: POST /carts/increment
router.post('/increment',
    authenticate,
    authorizeTo('User'),
    cartController.incrementCartItem);

// Decrement the quantity of an item in the cart
// URL: POST /carts/decrement
router.post('/decrement',
    authenticate,
    authorizeTo('User'),
    cartController.decrementCartItem);

// Remove an item from the cart
// URL: DELETE /carts/item
router.delete('/item',
    authenticate,
    authorizeTo('User'),
    cartController.removeCartItem);

// Remove the entire cart
// URL: DELETE /carts
router.delete('/',
    authenticate,
    authorizeTo('User'),
    cartController.removeTheCart);

export default router;
