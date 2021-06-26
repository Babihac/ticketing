import express from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import { json } from "body-parser";
import { newOrderRouter } from "./routes/new";
import { currentUser, errorHandler } from "@mvticketsxxx/common";
import { showOrderRouter } from "./routes/show";
import { deleterOrdeRouter } from "./routes/delete";
import { indexOrderRouter } from "./routes/index";

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

app.use(deleterOrdeRouter);
app.use(currentUser);
app.use(showOrderRouter);
app.use(newOrderRouter);
app.use(indexOrderRouter);
app.use(errorHandler);

export { app };
