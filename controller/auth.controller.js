import bycrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

export const studentRegister = async (req, res) => {
  const {
    collegeId,
    email,
    pass,
    dept,
    name,
    institution,
    yog,
    areaOfIntrest,
  } = req.body;

  console.log(email);

  try {
    const userId = await prisma.student.findUnique({ where: { collegeId } });

    if (userId) {
      return res.status(402).json({ message: "Id Found" });
    }

    const hashedPassword = await bycrypt.hash(pass, 10);

    const newUser = await prisma.student.create({
      data: {
        password: hashedPassword,
        email,
        collegeId,
        dept,
        name,
        yearOfGraduation: yog,
        institution,
        areaOfIntrest,
      },
    });

    const { password: userPass, ...userinfo } = newUser;

    res.status(200).json(userinfo);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

export const aluminiRegister = async (req, res) => {
  const {
    collegeId,
    email,
    pass,
    dept,
    name,
    institution,
    yog,
    areaOfIntrest,
  } = req.body;

  try {
    const user = await prisma.alumini.findUnique({ where: { email } });

    if (user) {
      return res.status(402).json({ message: "Email Id Found" });
    }

    const userId = await prisma.alumini.findUnique({ where: { collegeId } });

    if (userId) {
      return res.status(401).json({ message: "Id Found" });
    }

    const hashedPassword = await bycrypt.hash(pass, 10);

    const newUser = await prisma.alumini.create({
      data: {
        password: hashedPassword,
        email,
        collegeId,
        dept,
        name,
        yearOfGraduation: yog,
        institution,
        areaOfIntrest,
      },
    });

    const { password: userPass, ...userinfo } = newUser;

    res.status(200).json(userinfo);
  } catch (err) {
    res.json(err);
  }
};

export const otpVerify = async (req, res) => {
  const { email, collegeId } = req.body;

  const OTP = Math.floor(1000 + Math.random() * 9000);

  try {
    const alumini = await prisma.alumini.findUnique({ where: { email } });

    const student = await prisma.student.findUnique({ where: { email } });

    const aluminiId = await prisma.alumini.findUnique({
      where: { collegeId: collegeId },
    });

    const studentId = await prisma.student.findUnique({
      where: { collegeId: collegeId },
    });

    if (alumini || student) {
      return res.status(201).json({ message: "user already" });
    }

    if (aluminiId || studentId) {
      return res.status(202).json({ message: "id found" });
    }

    const info = await transporter.sendMail({
      from: {
        name: "admin@Xperts",
        address: process.env.USER,
      },
      to: email,
      subject: "Otp Email Verification",
      text: `Your Otp for the verification:${OTP}`,

      html: `<div
        style='
        display:grid;
        place-items:center;
        background-color: #FFF;
        height:100px;
        font-size: xx-large;
        font-weight: bold;
      '
      >
        <p style="text-align:center">Otp:${OTP}</p>
      </div>`,
    });
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: "Email id not Found" });
  }

  return res.status(200).json({ message: OTP });
};

export const studentLogin = async (req, res) => {
  const { email, pass } = req.body;

  console.log(email);
  try {
    const user = await prisma.student.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(403).json({ message: "Enter a Valid Credientails" });
    }

    const checkPass = bycrypt.compareSync(pass, user.password);

    if (!checkPass) {
      return res.status(403).json({ message: "Enter a Valid Credientails" });
    }

    const { password, ...userInfo } = user;

    return res.status(200).json(userInfo);
  } catch (e) {
    return res.status(500).json({ message: "Login Failed" });
  }
};

export const aluminiLogin = async (req, res) => {
  const { email, pass } = req.body;

  try {
    const user = await prisma.alumini.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(403).json({ message: "Enter a Valid Credientails" });
    }

    const checkPass = bycrypt.compareSync(pass, user.password);

    if (!checkPass) {
      return res.status(403).json({ message: "Enter a Valid Credientails" });
    }

    const { password, ...userInfo } = user;

    return res.status(200).json(userInfo);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Login Failed" });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.body;

  try {
    const response = await prisma.user.findUnique({ where: { id } });
    const { password, ...userInfo } = response;

    return res.status(200).json(userInfo);
  } catch (err) {
    res.status(500).json({ message: "not a user" });
  }
};

export const sendFeedBack = async (req, res) => {
  const { name, email, feedback } = req.body;

  const info = await transporter.sendMail({
    from: {
      name: "Aura Support",
      address: process.env.USER,
    },
    to: "palanitce@gmail.com",
    subject: `Feedback from ${name} (${email})`,
    text: `Feedback from Name: ${name} Email: ${email}\n\nFeedback: ${feedback}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h1 style="color: #333; font-size: 24px; margin-bottom: 10px;">Feedback from ${name}</h1>
        <p style="font-size: 16px; margin-bottom: 20px;"><strong>Email:</strong> ${email}</p>
        <p style="font-size: 16px; line-height: 1.5;">${feedback}</p>
      </div>`,
  });

  return res.status(200).json({ message: "success" });
};

export const recommend = async (req, res) => {
  const { dept, institution, areaOfIntrest } = req.body;

  try {
    const users = await prisma.alumini.findMany({
      where: {
        dept,
        institution,
        areaOfIntrest,
      },
    });

    if (users.length > 0) {
      return res.status(200).json({ users });
    } else {
      return res.status(404).json({ message: "No users found." });
    }
  } catch (e) {
    res.status(200).json({ message: e });
  }
};
