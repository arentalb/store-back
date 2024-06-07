import jwt from "jsonwebtoken";

const createToken = (userId) => {
    const accessToken = jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({id: userId}, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    return {accessToken, refreshToken};
};


export default createToken
