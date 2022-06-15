import { UserPassport } from "./models/UserPassport";
import axios from "../../axios";
// import { converterDataURItoBlob } from "../../helper/image";
import RNFetchBlob from "react-native-fetch-blob";

export const storePassportDetails = async (
	userPassport: UserPassport,
	token: string
) => {
	const {
		details: {
			firstName,
			lastName,
			birthDate,
			expirationDate,
			documentNumber,
			personalNumber,
			sex,
		},
		highlandId,
		simNumber,
		iccid,
	} = userPassport;

	const postData = {
		highland_id: highlandId,
		full_name: `${firstName} ${lastName}`,
		sex: sex === "male" ? "Male" : sex === "female" ? "Female" : "",
		sim_number: simNumber,
		icid_number: iccid,
		passport_number: documentNumber,
		dob: birthDate,
		expiry_passport: expirationDate,
		citizen_number: personalNumber,
		company_name: "Shoof",
	};
	try {
		const response = await axios.post(
			`/api/sim-distribute?token=${token}`,
			postData,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		return response.data;
	} catch (error) {
		// console.log(
		// 	"storePassportDetails Upload Passport Details Error",
		// 	error
		// );
		throw error;
	}
};

// avoiding this as data is being send as _parts in body field. But working in debugging mode (Bug ?)
export const storePassportDetails_ = async (
	userPassport: UserPassport,
	token: string
) => {
	const form = new FormData();
	const {
		details: {
			firstName,
			lastName,
			birthDate,
			expirationDate,
			documentNumber,
			personalNumber,
			sex,
		},
		highlandId,
		simNumber,
		iccid,
	} = userPassport;

	form.append("highland_id", highlandId);
	form.append("full_name", `${firstName} ${lastName}`);
	form.append(
		"sex",
		sex === "male" ? "Male" : sex === "female" ? "Female" : ""
	);
	form.append("sim_number", simNumber);
	form.append("icid_number", iccid);
	form.append("passport_number", documentNumber!);
	form.append("dob", birthDate!);
	form.append("expiry_passport", expirationDate!);
	form.append("citizen_number", personalNumber!);
	form.append("company_name", "Shoof");
	try {
		const response = await axios.post(
			`/api/sim-distribute?token=${token}`,
			form,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return response.data;
	} catch (error) {
		// console.log(
		// 	"storePassportDetails Upload Passport Details Error",
		// 	error
		// );
		throw error;
	}
};

export const uploadPassportImages_ = async (
	userPassport: UserPassport,
	token: string
) => {
	const form = new FormData();

	console.log("RNFETCHBlob", RNFetchBlob.wrap(userPassport.signatureImage));

	form.append("id", userPassport.serverDBId!.toString());
	form.append("passport_image", userPassport.passportImage);
	form.append("sim_image", userPassport.highlandImage);
	try {
		const response = await axios.post(
			`/api/upload-images?token=${token}`,
			form,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return response.data;
	} catch (error) {
		// console.log("uploadPassportImages Upload Passport Images Error", error);
		throw error;
	}
};

export const uploadPassportImages = async (
	userPassport: UserPassport,
	token: string
) => {
	// throw new Error("New Error");
	const uploadUri =
		axios.defaults.baseURL + `/api/upload-images?token=${token}`;
	// console.log(userPassport);
	return new Promise((res, rej) => {
		RNFetchBlob.fetch(
			"POST",
			uploadUri,
			{
				"Content-Type": "multipart/form-data",
			},
			[
				{
					name: "id",
					data: userPassport.serverDBId?.toString(),
				},
				// element with property `filename` will be transformed into `file` in form data
				{
					name: "signature_image",
					filename: `${userPassport.details.documentNumber}_signature_image.jpg`,
					data: RNFetchBlob.wrap(userPassport.signatureImage),
				},
				{
					name: "passport_image",
					filename: `${userPassport.details.documentNumber}_passport_image.jpg`,
					data: RNFetchBlob.wrap(userPassport.passportImage),
				},
				{
					name: "sim_image",
					filename: `${userPassport.details.documentNumber}_sim_image.jpg`,
					data: RNFetchBlob.wrap(userPassport.highlandImage),
				},
			]
		)
			.then((resp) => {
				console.log("response", resp);

				if (resp.respInfo.status !== 200) {
					throw new Error(resp.data.message);
				}

				res(resp.data);
			})
			.catch((err) => {
				// console.log("got upload error", err);
				rej(err);
				// throw err;
			});
	});
};
