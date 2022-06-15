import userPassportsSlice, {
	StateType as UserPassportStateType,
} from "./user-passports/userPassportsSlice";
import authSlice, { StateType as AuthStateType } from "./auth/authSlice";
import { CombinedState, combineReducers, Reducer } from "@reduxjs/toolkit";

export type RootReducerType = Reducer<
	CombinedState<{
		userPassports: AuthStateType;
		auth: UserPassportStateType;
	}>,
	any
>;

export const rootReducer = combineReducers({
	userPassports: userPassportsSlice,
	auth: authSlice,
});
