import express from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import { json } from "body-parser";
import { currentUser, errorHandler } from "@mvticketsxxx/common";
import { createChargeRouter } from "./routes/new";

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

app.use(currentUser);
app.use(createChargeRouter);
app.use(errorHandler);

export { app };
