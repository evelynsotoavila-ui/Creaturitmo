import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, ok, publicUser } from "../../utils/http.js";
import { bootstrapAdmin, changePassword, login } from "./auth.service.js";

export const registerFirstAdmin = asyncHandler(async (req, res) => {
  const result = await bootstrapAdmin({
    email: req.body.email,
    password: req.body.password,
    fullName: req.body.fullName,
  });
  return created(res, result);
});

export const loginController = asyncHandler(async (req, res) => {
  const result = await login({
    email: req.body.email,
    password: req.body.password,
  });
  return ok(res, result);
});

export const meController = asyncHandler(async (req, res) => {
  return ok(res, publicUser(req.user));
});

export const changePasswordController = asyncHandler(async (req, res) => {
  const user = await changePassword(req.user.id, {
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
  });
  return ok(res, user);
});
