import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserPassport } from "./models/UserPassport";
import axios from "../../axios";

export {
	storePassportDetails,
	uploadPassportImages,
} from "./storePassportAsync";

export interface StateType {
	loading: boolean;
	isBusy: boolean;
	items: Partial<UserPassport>[];
}

interface AddUserSignatureType {
	id: string;
	signatureImage: string;
}

const initialState: StateType = {
	loading: false,
	isBusy: false,
	items: [],
};

export const validateHighlandId = async (highlandId: string, token: string) => {
	const { data } = await axios.get(
		`api/valid-sim?token=${token}&highland_id=${highlandId}`
	);
	return data;
};

export const validateHighlandIccid = async (iccid: string, token: string) => {
	// for testing
	// iccid = "89427021117530699";

	const { data } = await axios.get(
		`api/valid-sim?token=${token}&iccid=${iccid}`
	);
	return data;
};

const userPassportsSlice = createSlice({
	name: "userPassport",
	initialState,
	reducers: {
		setLoading: (state: StateType, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},

		setIsBusy: (state: StateType, action: PayloadAction<boolean>) => {
			state.isBusy = action.payload;
		},

		updateUserPassport: (
			state: StateType,
			action: PayloadAction<Partial<UserPassport>>
		) => {
			// console.log("action.payload", action.payload);
			const index = state.items.findIndex(
				(item) => item.id === action.payload.id
			);

			if (index > -1) {
				state.items[index] = action.payload;
			}
			state.loading = false;
		},

		addUserPassport: (
			state: StateType,
			action: PayloadAction<Partial<UserPassport>>
		) => {
			console.log("inserting payload", action);
			state.loading = false;
			state.items.unshift(action.payload);
			// return state;
		},

		addUserHighlandImage: (
			state: StateType,
			action: PayloadAction<Partial<UserPassport>>
		) => {
			const index = state.items.findIndex(
				(item) => item.id === action.payload.id
			);

			if (index > -1) {
				state.items[index].highlandImage = action.payload.highlandImage;
			}
			state.loading = false;
		},

		addUserHighlandInfo: (
			state: StateType,
			action: PayloadAction<Partial<UserPassport>>
		) => {
			const index = state.items.findIndex(
				(item) => item.id === action.payload.id
			);

			if (index > -1) {
				state.items[index].highlandId = action.payload.highlandId;
				state.items[index].iccid = action.payload.iccid;
				state.items[index].simNumber = action.payload.simNumber;
			}
			state.loading = false;
		},

		addUserIccid: (
			state: StateType,
			action: PayloadAction<Partial<UserPassport>>
		) => {
			const index = state.items.findIndex(
				(item) => item.id === action.payload.id
			);

			if (index > -1) {
				// state.items[index].highlandId = action.payload.highlandId;
				state.items[index].iccid = action.payload.iccid;
				// state.items[index].simNumber = action.payload.simNumber;
			}
			state.loading = false;
		},

		addUserSignature: (
			state: StateType,
			action: PayloadAction<AddUserSignatureType>
		) => {
			// let userPassport = state.items.find(
			// 	(item) => item.id === action.payload.id
			// );
			const index = state.items.findIndex(
				(item) => item.id === action.payload.id
			);
			if (index > -1) {
				state.items[index].signatureImage =
					action.payload.signatureImage;
			}
			state.loading = false;
		},

		deleteUserPassport: (
			state: StateType,
			action: PayloadAction<Partial<UserPassport>>
		) => {
			const index = state.items.findIndex(
				(item) => item.id === action.payload.id
			);
			if (index > -1) {
				state.items.splice(index, 1);
			}
		},

		hydrate: (
			state: StateType,
			action: PayloadAction<Partial<UserPassport>[]>
		) => {
			state.items = action.payload;
		},
	},
});

export const {
	setLoading,
	setIsBusy,
	updateUserPassport,
	addUserPassport,
	addUserSignature,
	addUserHighlandImage,
	addUserHighlandInfo,
	deleteUserPassport,
	addUserIccid,
} = userPassportsSlice.actions;

export const getUserPassportFromId = (state: StateType, id: string) => {
	if (state.items.length > 0) {
		const index = state.items.findIndex((item) => item.id === id);

		if (index > -1) {
			return state.items[index];
		}
	}
	return null;
	// if (state.items.length > 0) {
	// 	return state.items[0];
	// } else {
	// 	return null;
	// }
};

export default userPassportsSlice.reducer;
