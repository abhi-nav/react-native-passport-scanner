import { ResultFields } from "mrz";
import { UserPassport } from "../app/user-passports/models/UserPassport";

export const createUserPassportPartial = (
	data: ResultFields,
	imageData: string
) => {
	const userPassport: Partial<UserPassport> = {
		id: Math.random().toString(),
		details: data,
		passportImage: imageData,
		status: "pending",
	};
	return userPassport;
};
