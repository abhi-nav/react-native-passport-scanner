import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import jwtDecode, { JwtPayload } from "jwt-decode";
import axios from "../../axios";

export interface StateType {
	isProduction: boolean;
	hasWifi: boolean;
	loading: boolean;
	errorMessage: string | undefined;
	username: string;
	password: string;
	token: string;
	expiry: number | undefined;
}

interface CustomAuthType {
	username: string;
	password: string;
	token: string;
	expiry: number;
}

const initialState: StateType = {
	isProduction: false,
	hasWifi: false,
	loading: false,
	token: "",
	errorMessage: undefined,
	username: "",
	password: "",
	expiry: 0,
};

const fakeState = {
	token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9haXJwb3J0LnBvY2tldHNvbHV0aW9uLm9yZ1wvYXBpXC9sb2dpbiIsImlhdCI6MTY0ODY0NDI4MywiZXhwIjoxNjQ4NzMwNjgzLCJuYmYiOjE2NDg2NDQyODMsImp0aSI6IjUxTzFsVkY1U2hvUGNTYXoiLCJzdWIiOjEsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.wsqBdJ_jUggD_Wl0j1tbffM-nPhCw0P1tL1Gu38NCn8",
	username: "----",
	password: "-----",
	// expiry: Date.now(),
	expiry: Date.now() + 60 * 1000,
};

const initialState_: StateType = { ...initialState, ...fakeState };

class TokenExpiredError extends Error {
	constructor(message: any) {
		super(message);
		this.name = "TokenExpiredError";
	}
}

const userAuthAsync = async (username: string, password: string) => {
	// return fakeState;
	let formData = new FormData();

	formData.append("username", username);
	formData.append("password", password);

	// await new Promise((res) => {
	// 	setTimeout(() => res(1), 5000);
	// });

	// return fakeState;
	// console.log("formdata", formData);

	// await setTimeout()
	const response = await axios.post("/api/login", { username, password });

	// console.log("response--", response);

	const data = response.data as { token: string };
	const decoded = jwtDecode<JwtPayload>(data.token);

	return {
		token: data.token,
		expiry: decoded.exp! * 1000,
		// expiry: Date.now() + 5000,
		username,
		password,
	};
};

export const reloginAuthToken = createAsyncThunk(
	"reloginAuth",
	async (arg: { username: string; password: string }) => {
		const { username, password } = arg;
		return await userAuthAsync(username, password);
	}
);

export const getAuthToken = createAsyncThunk(
	"/getAuth",
	async (arg: {
		username: string;
		password: string;
		shouldFakeState?: boolean;
	}) => {
		const { username, password, shouldFakeState = false } = arg;

		try {
			if (shouldFakeState) {
				return fakeState;
			}
			return await userAuthAsync(username, password);
			// return token;
		} catch (error: any) {
			// console.log("error.response", error.response);
			if (error.isAxiosError) {
				if (error.response) {
					const {
						status,
						data: { message },
					} = error.response;
					// console.log("status", status, message);
					error.message = message;
					error.code = status;
					if (status === 401) {
						// attempt for relogin
						// console.log("attempting for relogin");
						// await reloginAuthToken(username, password);
						// refresh Token
						throw new TokenExpiredError(error.message);
					}
				}
			}
			throw error;
		}
	}
);

const authSlice = createSlice({
	name: "authSlice",
	initialState: initialState,
	reducers: {
		setCustomAuth: (
			state: StateType,
			{
				payload: { username, password, token, expiry },
			}: PayloadAction<CustomAuthType>
		) => {
			state.username = username;
			state.password = password;
			state.token = token;
			state.expiry = expiry;
			state.loading = false;
		},
		logout: (state: StateType) => {
			state.token = "";
			state.username = "";
			state.password = "";
			state.expiry = 0;
			state.loading = false;
			// return initialState;
		},
		setHasWifi: (state: StateType, action: PayloadAction<boolean>) => {
			state.hasWifi = action.payload;
		},

		setIsProduction: (state: StateType, action: PayloadAction<boolean>) => {
			state.isProduction = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(
			getAuthToken.fulfilled,
			(
				state: StateType,
				{ payload: { token, username, password, expiry } }
			) => {
				Object.assign(state, {
					loading: false,
					errorMessage: "",
					token,
					username,
					password,
					expiry,
				});

				// state.token = payload.token;
				// return state;
			}
		);

		builder.addCase(
			getAuthToken.pending,
			(state: StateType, payload: PayloadAction) => {
				// console.log("im here pending", payload);
				state.loading = true;
			}
		);

		builder.addCase(
			getAuthToken.rejected,
			(state: StateType, { error }) => {
				// if (error.name === TokenExpiredError.constructor.name) {
				// 	// handle relogin
				// 	throw error;
				// }
				// state = initialState;
				// console.log(error);
				if (error.message) {
					return { ...initialState, errorMessage: error.message };
				}
				return initialState;
			}
		);

		builder.addCase(reloginAuthToken.pending, (state: StateType) => {
			state.loading = true;
		});

		builder.addCase(
			reloginAuthToken.fulfilled,
			(
				state: StateType,
				{ payload: { token, username, password, expiry } }
			) => {
				Object.assign(state, {
					loading: false,
					token,
					username,
					password,
					expiry,
				});
				// state.token = payload.token;
				// state.username = payload.username;
				// state.password = payload.password;
				// state.expiry = payload.expiry;
			}
		);

		builder.addCase(reloginAuthToken.rejected, (state: StateType) => {
			console.log("reloginAuthToken");
			// state = initialState;
			return initialState;
		});
	},
});

export const { setCustomAuth, logout, setHasWifi, setIsProduction } =
	authSlice.actions;

export default authSlice.reducer;
