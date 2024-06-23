import {authenticate, authorizeTo, isVerified} from "../../middlwares/authMiddleware.js";
import cartController from "./cartController.js";
import express from "express";

const router = express.Router();


router.get('/',
    authenticate,
    authorizeTo('User'), isVerified,
    cartController.getCart);


router.post('/',
    authenticate,
    authorizeTo('User'), isVerified,
    cartController.addToCart);


router.put('/',
    authenticate,
    authorizeTo('User'), isVerified,
    cartController.updateCartItem);


router.post('/increment',
    authenticate,
    authorizeTo('User'), isVerified,
    cartController.incrementCartItem);


router.post('/decrement',
    authenticate,
    authorizeTo('User'), isVerified,
    cartController.decrementCartItem);


router.delete('/item',
    authenticate,
    authorizeTo('User'), isVerified,
    cartController.removeCartItem);


router.delete('/',
    authenticate,
    authorizeTo('User'), isVerified,
    cartController.removeTheCart);

export default router;
