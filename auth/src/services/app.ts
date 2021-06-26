import express from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import { json } from "body-parser";
import { currentUserRouter } from "../routes/current-user";
import { signInRouter } from "../routes/signin";
import { signOutRouter } from "../routes/signout";
import { signUpRouter } from "../routes/signup";
import { errorHandler } from "@mvticketsxxx/common";
//import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true);
app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV != "test",
  })
);

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signOutRouter);
app.use(signInRouter);
app.use(errorHandler);

export { app };
