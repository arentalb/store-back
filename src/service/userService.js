import userModel from "../models/userModel.js";

async function getUserByEmail(email) {
    try {
        return await userModel.findOne({email});
    } catch (error) {
        throw new Error("Database error during email check");
    }
}

async function getUserById(id) {
    try {
        //do not include password field
        return await userModel.findById(id).select("-password");
    } catch (error) {
        throw new Error("Database error during find user by id ");
    }
}


async function createUser(userDetails) {
    try {
        const a = await userModel.create(userDetails);
        return a;
    } catch (error) {
        throw new Error("Error creating user");
    }
}

async function getAllUser() {
    try {

        return await userModel.find();
    } catch (error) {
        throw new Error("Error fetching all user");
    }
}

async function getUserProfile(id) {
    try {
        return await userModel.findById(id);
    } catch (error) {
        throw new Error("Error fetching profile");
    }
}

export default {getUserByEmail, createUser, getUserById, getAllUser, getUserProfile};
