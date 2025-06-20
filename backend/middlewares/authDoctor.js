import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({
        success: false,
        message: "unauthorized login",
      });
    }
    const token_decrypt = jwt.verify(dtoken, process.env.JWT_SECRET);
    console.log("Token decrypted:", token_decrypt);
    req.doctorId = token_decrypt.id;
    next();
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export default authDoctor;
