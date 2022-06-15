import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
	storePassportDetails,
	uploadPassportImages,
	updateUserPassport,
	setLoading,
	deleteUserPassport,
	validateHighlandIccid,
} from "../app/user-passports/userPassportsSlice";
import { UserPassport } from "../app/user-passports/models/UserPassport";
import { useInterval } from "./useInterval";
import { StateType as AuthStateType } from "../app/auth/authSlice";
import { StateType as PassportStateType } from "../app/user-passports/userPassportsSlice";
import { clearImageFromUri, clearCacheDirectoy } from "../helper/clearImage";

export const useUserPassportStoreHandler = () => {
	// The `state` arg is correctly typed as `RootState` already
	const dispatch = useAppDispatch();

	const authState: AuthStateType = useAppSelector((state) => state.auth);

	const userPassports: PassportStateType = useAppSelector(
		(state) => state.userPassports
	);

	const updateServerHandler = async () => {
		console.log("IN INTERNVAL HOOKs");
		// console.log("Net Fetch", await NetInfo.fetch());

		// dispatch(setLoading(false));
		if (userPassports.loading) return;
		if (!authState.token) return;
		// console.log("im in userpassport store handler hook");

		const uploadUserPassportImages = async (
			userPassport: UserPassport,
			token: string
		) => {
			try {
				const data = await uploadPassportImages(userPassport, token);
				console.log("image uploaded......", data);

				dispatch(
					updateUserPassport({
						...userPassport,
						status: "success",
					})
				);
			} catch (error) {
				console.log("uploadUserPassportImages Error", error);
			}
		};

		const uploadUserPassportDetails = async (
			userPassport: UserPassport,
			token: string
		) => {
			try {
				const data = await storePassportDetails(userPassport, token);
				// console.log("passport detail saved", data);
				dispatch(
					updateUserPassport({
						...userPassport,
						// status: "success",
						serverDBId: data.id,
					})
				);
			} catch (error) {
				console.log("uploadUserPassportDetails Error", error);
			}
		};

		const getUserSimInfo = async (
			userPassport: UserPassport,
			token: string
		) => {
			try {
				const data = await validateHighlandIccid(
					userPassport.iccid,
					token
				);
				// console.log("getUserSimInfo", data);
				dispatch(
					updateUserPassport({
						...userPassport,
						highlandId: data.highland_id,
						simNumber: data.sim_no,
						// status: "success",
						// serverDBId: data.id,
					})
				);
			} catch (error) {
				console.log("getUserSimInfo Error", error);
			}
		};

		const completeUserPassports = userPassports.items.filter(
			(userPassport) => {
				return (
					// userPassport.highlandId &&
					// userPassport.simNumber &&
					userPassport.iccid &&
					userPassport.signatureImage &&
					userPassport.highlandImage &&
					userPassport.details &&
					userPassport.status === "pending"
				);
			}
		);

		completeUserPassports.length && dispatch(setLoading(true));

		// console.log("time starts", completeUserPassports.length);
		// await new Promise((resolve) => setTimeout(resolve, 1000));
		// console.log("time end");

		for (const completeUserPassport of completeUserPassports) {
			// dispatch(
			// 	updateUserPassport({
			// 		...completeUserPassport,
			// 		status: "pending",
			// 	})
			// );
			// console.log(completeUserPassport);
			try {
				if (completeUserPassport.serverDBId) {
					// upload images
					uploadUserPassportImages(
						completeUserPassport as UserPassport,
						authState.token
					);
				} else if (!completeUserPassport.simNumber) {
					getUserSimInfo(
						completeUserPassport as UserPassport,
						authState.token
					);
				} else {
					// upload info details first
					uploadUserPassportDetails(
						completeUserPassport as UserPassport,
						authState.token
					);
				}
			} catch (error) {
				console.log("got error", error);
			}
		}

		completeUserPassports.length && dispatch(setLoading(false));
	};

	const removeUpdatedPassport = async () => {
		const updatedUserPassports = userPassports.items.filter(
			(userPassport) => {
				return (
					userPassport.serverDBId && userPassport.status === "success"
				);
			}
		);
		if (updatedUserPassports.length > 0) {
			for (const updatedUserPassport of updatedUserPassports) {
				clearImageFromUri(updatedUserPassport.highlandImage!);
				clearImageFromUri(updatedUserPassport.passportImage!);
				clearImageFromUri(updatedUserPassport.signatureImage!);

				// const highlandImage = await FileSystem.getInfoAsync(
				// 	updatedUserPassport.highlandImage!
				// );
				// const passportImage = await FileSystem.getInfoAsync(
				// 	updatedUserPassport.passportImage!
				// );
				// const signatureImage = await FileSystem.getInfoAsync(
				// 	updatedUserPassport.signatureImage!
				// );
				// console.log(highlandImage);
				// console.log(passportImage);
				// console.log(signatureImage);
				dispatch(deleteUserPassport(updatedUserPassport));
			}
		}
		// Free up Cache if the list is empty
		if (userPassports.items.length === 0 && !userPassports.isBusy) {
			clearCacheDirectoy();
		}
	};

	useInterval(updateServerHandler, 10000);
	useInterval(removeUpdatedPassport, 60000);
};
