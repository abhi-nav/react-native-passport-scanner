import moment from "moment";
import { UserPassport } from "../app/user-passports/models/UserPassport";
import { UserPassportDataType } from "../app/user-passports/getPassportAsync";
import {
	REACT_APP_PRODUCTION_API_URL,
	REACT_APP_API_DEVELOPEMENT_URL,
} from "@env";

export const getFormattedData = (date: string | null) => {
	// 	console.log(date);

	return date ? moment(date, "YYMMDD").format("YYYY-MM-DD") : null;
};

export const isFormComplete = (userPassport: Partial<UserPassport>) => {
	return (
		userPassport.details &&
		userPassport.iccid &&
		userPassport.signatureImage &&
		userPassport.highlandImage
	);
};

export const isUpdatedInServer = (userPassport: Partial<UserPassport>) => {
	return !!userPassport.serverDBId;
};

export const convertUploadedToUserPassport = (
	items: UserPassportDataType[]
) => {
	const userPassports: Partial<UserPassport>[] = [];
	for (let item of items) {
		const userPassport = {
			id: Math.random().toString(),
			details: {
				birthDate: item.dob,
				sex: item.sex,
				documentNumber: item.passport_number,
				expirationDate: item.expiry_passport,
				firstName: item.full_name.split(" ")[0],
				lastName: item.full_name.split(" ")[1],
			},
			serverDBId: parseInt(item.highland_id) || 1,
			passportImage: item.passport_image,
			signatureImage: item.signature_image,
			highlandImage: item.sim_image,
			highlandId: item.highland_id,
			iccid: item.icid_number,
			simNumber: item.sim_number,
			status: "success" as "success",
		};
		userPassports.push(userPassport);
	}
	return userPassports;
};

export const getProductionAppUrl = () => {
	return REACT_APP_PRODUCTION_API_URL;
};

export const getDevelopmentAppUrl = () => {
	return REACT_APP_API_DEVELOPEMENT_URL;
};
