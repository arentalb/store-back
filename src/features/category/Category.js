import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
    },
    {timestamps: true},
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
