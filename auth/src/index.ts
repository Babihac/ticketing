import mongoose from "mongoose";
import { app } from "./services/app";

const main = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("fff");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("Connected to DB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("listeninng on port 3000 HA");
  });
};

main();
