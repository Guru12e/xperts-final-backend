import express from "express";
import {
  getUser,
  otpVerify,
  sendFeedBack,
  recommend,
  studentRegister,
  studentLogin,
  aluminiRegister,
  aluminiLogin,
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/studentRegister", studentRegister);
router.post("/studentLogin", studentLogin);
router.post("/aluminiRegister", aluminiRegister);
router.post("/aluminiLogin", aluminiLogin);
router.post("/otpVerify", otpVerify);
router.post("/getUser", getUser);
router.post("/getRecommend", recommend);
router.post("/feedback", sendFeedBack);

export default router;
