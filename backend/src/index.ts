import express from "express";
import connectDatabase from "./config/db";
import authRouter from "./routes/authRoutes";
import { config } from "./config/env";
import contentRouter from "./routes/contentRoutes";
import errorHandler from "./middlewares/errorHandler";
import shareRouter from "./routes/shareRoutes";
import cors from "cors";

connectDatabase();

const app = express();
app.use(express.json());

// app.use(
//   cors({
//     origin: 'https://second-brain-suzie.vercel.app',
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     exposedHeaders: ['Authorization'],
//   })
// );

app.use(
  cors({
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
  })
);

// Routes
app.use("/api/v1", authRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/brain", shareRouter);
// app.use(errorHandler);

app.listen(config.PORT, (): void => {
  console.log("server started on port 3000");
});
