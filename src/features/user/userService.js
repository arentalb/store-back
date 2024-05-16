import userModel from "./userModel.js";

async function getAllUser() {
  try {
    return await userModel.find().select("-password");
  } catch (error) {
    throw new Error("Error fetching all user");
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

async function getUserByEmail(email) {
  try {
    return await userModel.findOne({ email });
  } catch (error) {
    throw new Error("Database error during email check");
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

async function deleteUser(id) {
  try {
    return await userModel.deleteOne({ _id: id });
  } catch (error) {
    throw new Error("Error deleting user");
  }
}

export default {
  getUserByEmail,
  createUser,
  getUserById,
  getAllUser,
  deleteUser,
};
