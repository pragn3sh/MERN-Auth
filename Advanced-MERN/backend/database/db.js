import mongoose from "mongoose";

export const connectToDB = () => {
	mongoose
		.connect(process.env.MONGO_URI)
		.then(() => {
			console.log(`Connected to MongoDB`);
		})
		.catch((err) => {
			console.log(`Error connceting to MongoDB ${err}`);
		});
};
