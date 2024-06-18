import mongoose from "mongoose";
import Product from "../product/Product.js";

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: String,
    price: Number,
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    coverImage: {
        type: String,
        required: [true, "Product in cart must have an image"]
    }
}, {timestamps: true});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    items: [cartItemSchema],
}, {timestamps: true});

// Virtual to calculate the total price of items in the cart
cartSchema.virtual('totalPrice').get(function () {
    return this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
});

// Virtual to calculate the total quantity of items in the cart
cartSchema.virtual('totalQuantity').get(function () {
    return this.items.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
});

cartSchema.set('toObject', {virtuals: true});
cartSchema.set('toJSON', {virtuals: true});

// Instance method to add an item to the cart
cartSchema.methods.addItem = async function (product, quantity) {
    const itemIndex = this.items.findIndex(item => item.product.toString() === product._id.toString());

    if (itemIndex === -1) {
        if (quantity > 0) {
            this.items.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                coverImage: product.coverImage
            });
            product.availableStock -= quantity;  // Decrement available stock
            await product.save();  // Save the updated product
        }
    } else {
        const item = this.items[itemIndex];
        if (quantity === 0) {
            this.items.splice(itemIndex, 1);
            product.availableStock += item.quantity;  // Increment available stock
            await product.save();  // Save the updated product
        } else {
            const quantityChange = quantity - item.quantity;
            item.quantity = quantity;
            if (quantityChange > 0) {
                product.availableStock -= quantityChange;  // Decrement available stock
            } else {
                product.availableStock += -quantityChange;  // Increment available stock
            }
            await product.save();  // Save the updated product
        }
    }

    await this.save();
    return this;
};

// Instance method to update the quantity of an item in the cart
cartSchema.methods.updateItemQuantity = async function (productId, quantity) {
    const item = this.items.find(item => item.product.toString() === productId);

    if (!item) {
        throw new Error('Item not found in cart');
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new Error('Product not found');
    }

    const quantityChange = quantity - item.quantity;
    item.quantity = quantity;

    if (quantityChange > 0) {
        product.availableStock -= quantityChange;  // Decrement available stock
    } else {
        product.availableStock += -quantityChange;  // Increment available stock
    }

    await product.save();  // Save the updated product
    await this.save();
    return this;
};

// Instance method to remove an item from the cart
// Instance method to remove an item from the cart
cartSchema.methods.removeItem = async function (productId) {
    const itemIndex = this.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
        const item = this.items[itemIndex];
        const product = await Product.findById(productId);
        if (product) {
            product.availableStock += item.quantity;  // Increment available stock
            await product.save();  // Save the updated product
        }
        this.items.splice(itemIndex, 1);
        await this.save();
    }

    return this;
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
