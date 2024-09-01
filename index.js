import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: "https://xperts-final-frontend.vercel.app", credentials: true }));

app.use("/auth", authRouter);

app.listen(5000, () => {
  console.log("App is listening at 5000");
});
