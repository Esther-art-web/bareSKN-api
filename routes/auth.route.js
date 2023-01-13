const express = require("express");
const { signupUser, signinUser, changePassword, verifyJWT, signinGuestUser } = require("../controllers/auth.controller");
const { authenticateUser } = require("../middlewares/authentication.middleware");
const { validateCreateUser, validateChangePassword } = require("../middlewares/validators/user.validator");

const authRouter = express.Router();

authRouter.post("/signup", validateCreateUser, signupUser);

authRouter.post("/signin", signinUser);

// Handles guest sign in feature
authRouter.post("/signin_guest", signinGuestUser);

authRouter.get("/verify_jwt", authenticateUser, verifyJWT);

authRouter.post("/change_password", [authenticateUser, validateChangePassword], changePassword);

authRouter.post("/reset_password");


module.exports = authRouter;