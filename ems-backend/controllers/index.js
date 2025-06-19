import { registerUser } from "./auth/registerController.js";
import { loginUser } from "./auth/loginController.js";
import { logoutUser } from "./auth/logoutController.js";
import { refreshToken } from "./refreshTokenController.js";

export const authController = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
};
