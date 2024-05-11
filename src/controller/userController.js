import expressAsyncHandler from "express-async-handler";
import userService from "../service/userService.js";
import bcrypt from "bcrypt";
import createToken from "../utils/createToken.js";

const createUser = expressAsyncHandler(async (req, res) => {
    const {username, email, password} = req.body;

    const userExists = await userService.checkIfUserExistByEmail(email);
    if (userExists) {
        res.status(409).json({message: "User already exists with that email"});
    } else {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userService.createUser({
            username,
            email,
            password: hashedPassword,
        });
        createToken(res, newUser._id)
        const userResponse = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
        };
        res.status(201).json(userResponse);
    }
});

export default {createUser};
