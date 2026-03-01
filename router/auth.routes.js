const { Router } = require("express");

const {
 register,
  verify,
  login
} = require("../controller/auth.controller");

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/verify", verify);
authRouter.post("/login", login);

module.exports = authRouter;