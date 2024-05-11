import userModel from "../models/userModel.js";

async function checkIfUserExistByEmail(email) {
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

export default { checkIfUserExistByEmail, createUser };
