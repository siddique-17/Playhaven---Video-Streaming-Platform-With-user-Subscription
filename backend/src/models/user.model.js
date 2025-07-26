import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: "",
        },
        subscription: {
            plan: {
                type: String,
                enum: ["basic", "standard", "premium", "free"],
                default: "free",
            },
            expiresAt: {
                type: Date,
                default: "", // Expiry date of the subscription
            },
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;