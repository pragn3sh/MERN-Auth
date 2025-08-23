import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectToDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorHandler.js";

export const app = express();

app.use(
	cors({
		origin: [process.env.FRONTEND_URL],
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	}),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDB();


app.use(errorMiddleware);