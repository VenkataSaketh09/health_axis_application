import jwt from "jsonwebtoken";

const authAdmin = async (req, res,next  ) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.json({
        success: false,
        message: "unauthorized login",
      });
    }
    const token_decrypt = jwt.verify(atoken, process.env.JWT_SECRET);
    if (
      token_decrypt !==
      process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD
    ) {
      return res.json({
        success: false,
        message: "unauthorized login",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export default authAdmin;
