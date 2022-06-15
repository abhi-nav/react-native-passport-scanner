import { UserPassport } from "./models/UserPassport";
import axios from "../../axios";

export type UserPassportDataType = {
	highland_id: string;
	full_name: string;
	sex: "male" | "female" | "nonspecified" | null | undefined;
	dob: string;
	passport_number: string;
	expiry_passport: string;
	sim_number: string;
	// country: string;
	// operator: string;
	icid_number: string;
	// visa_number: string;
	visa_expiry: string;
	// company_name: string;
	application_date: string;
	signature_image: string;
	passport_image: string;
	sim_image: string;
};

export type UploadedPassportType = {
	lastPage: number;
	currentPage: number;
	perPage: number;
	data: UserPassportDataType[];
};

export const fetchUserPassport = async (
	page: number = 1,
	token: string = ""
) => {
	const fetchUri = `/api/uploaded-data?token=${token}&page=${page}`;
	console.log("fetchURI", fetchUri);

	const response = await axios.get(fetchUri);
	return response.data;
};
