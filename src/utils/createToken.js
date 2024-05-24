import jwt from "jsonwebtoken";

function createToken(res, userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Should be true if you are using HTTPS
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none", // 'none' for cross-domain cookies in production
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
}

export default createToken;
