import mongoose, {Schema} from "mongoose";

const reviewSchema = new Schema({
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product is required']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required']
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [0, 'Rating must be at least 0'],
            max: [5, 'Rating cannot be more than 5']
        },
        comment: {
            type: String,
            maxlength: [500, 'Comment cannot be more than 500 characters']
        }
    },
    {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    },
);


reviewSchema.pre(/^find/, async function (next) {
    this.populate({
        path: "user",
        select: "username  -_id",
    });
    next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
