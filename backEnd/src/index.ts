import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import newspostsRouter from "./routes/newsposts";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import passport from "./auth/passport";
import { requestLogger } from "./middlewares/requestLogger";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

const HOST = process.env.HOST || "localhost";
const PORT = Number(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);

app.use("/api/newsposts", newspostsRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
    res.send("Backend is working");
});

app.use(errorHandler);

app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
});