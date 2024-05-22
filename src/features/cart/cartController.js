import CartService from "./cartService.js";
import {
  sendError,
  sendFailure,
  sendSuccess,
} from "../../utils/resposeSender.js";

const getCart = async (req, res) => {
  try {
    const cart = await CartService.getCart(req.user._id);
    if (!cart) {
      return sendFailure(res, "Cart not found", 404);
    }
    sendSuccess(res, cart);
  } catch (error) {
    sendError(res, "Failed to get cart", 500, error);
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await CartService.addToCart(req.user._id, productId, quantity);
    sendSuccess(res, cart, 201);
  } catch (error) {
    sendError(res, "Failed to add to cart", 500, error);
  }
};

const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await CartService.updateCartItem(
      req.user._id,
      productId,
      quantity,
    );
    sendSuccess(res, cart);
  } catch (error) {
    sendError(res, "Failed to update cart item", 500, error);
  }
};

const removeCartItem = async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await CartService.removeCartItem(req.user._id, productId);
    sendSuccess(res, cart);
  } catch (error) {
    sendError(res, "Failed to remove cart item", 500, error);
  }
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
