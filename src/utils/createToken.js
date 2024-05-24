import jwt from "jsonwebtoken";

function createToken(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return token;
}

export default createToken;
