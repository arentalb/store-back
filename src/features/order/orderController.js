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

export default {
  createOrderFromCart,
};
