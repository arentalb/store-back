import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase:true
        },

    },
    { timestamps: true },
);

const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;
