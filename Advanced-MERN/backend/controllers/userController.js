import ErrorHandler from "../middlewares/errorHandler";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userModel.js";

export const register = catchAsyncError(async (req, res, next) => {
	try {
		const { name, email, phone, password, verificationMethod } = req.body;
		if (!name || !email || !phone || !password || !verificationMethod) {
			return next(new ErrorHandler("All fields are required.", 400));
		}
		function vaildatePhoneNumber(phone) {
			const phoneRegex = /^+91\d{10}$/;
			return phoneRegex.test(phone);
		}

		if (!vaildatePhoneNumber) {
			return next(new ErrorHandler("Invalid Phone Number.", 400));
		}

		const existingUser = await User.findOne({
			$or: [
				{
					email,
					accountVerified: true,
				},
				{
					phone,
					accountVerified: true,
				},
			],
		});

		if (existingUser) {
			return next(
				new ErrorHandler("User Phone or Email is already in use.", 400),
			);
		}
		const registerAttemptByUser = await User.find({
			$or: [
				{ phone, accountVerified: false },
				{ email, accountVerified: false },
			],
		});
		if (registerAttemptByUser > 4) {
			return next(
				new ErrorHandler(
					"You have exceeded the maximum number of attempts (4). Please try again after an hour.",
					400,
				),
			);
		}
		const userData = {
			name,
			email,
			phone,
			password,
		};

		const user = await User.create(userData);
		const verificationCode = await user.generateVerificationCode();
		await user.save();
		sendVerificationCode(
			verificationMethod,
			verificationCode,
			name,
			email,
			phone,
			res,
		);
	} catch (error) {
		next(error);
	}
});
