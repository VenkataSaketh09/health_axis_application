import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "unauthorized login",
      });
    }
    const token_decrypt = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decrypted:", token_decrypt);
    req.userId = token_decrypt.id;
    next();
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export default authUser;
