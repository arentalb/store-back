import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please provide username "],
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Please provide email "],

        },
        password: {
            type: String,
            required: [true, "Please provide password "],
        },
        role: {
            type: String,
            enum: ["SuperAdmin", "Admin", "User"],
            default: "User",
        },
        active: {
            type: Boolean,
            default: true,
            select: false,
        },

        isVerified: {type: Boolean, default: false},
        emailVerificationToken: String,
        emailVerificationExpires: Date,

        resetPasswordToken: String,
        resetPasswordExpires: Date,

        refreshToken: {
            type: String,
        },
    },
    {timestamps: true},
);
UserSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    // Hash the password
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
});
const User = mongoose.model("User", UserSchema);

export default User;
