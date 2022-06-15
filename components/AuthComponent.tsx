import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { logout, reloginAuthToken, setHasWifi } from "../app/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import NetInfo, {
	NetInfoSubscription,
	useNetInfo,
} from "@react-native-community/netinfo";
import { StateType as AuthStateType } from "../app/auth/authSlice";

const AuthComponent = () => {
	let isFocused = useIsFocused();

	const authState: AuthStateType = useAppSelector((state) => state.auth);

	const dispatch = useAppDispatch();
	const netInfo = useNetInfo();

	const [netSubscription, setNetSubscription] =
		useState<NetInfoSubscription>();
	useEffect(() => {
		(async () => {
			const subscription = NetInfo.addEventListener((networkState) => {
				if (authState.hasWifi !== networkState.isConnected) {
					dispatch(setHasWifi(!!networkState.isConnected));
				}
				setNetSubscription(subscription);
				// console.log("Connection type - ", networkState.type);
				console.log("Is connected? - ", networkState.isConnected);
			});
			subscription();
		})();

		if (isFocused) {
			console.log("Checking Authentication ...");
			// console.log("authState", authState);
			if (!authState.token) {
				dispatch(logout());
			}

			if (authState.expiry && authState.expiry < Date.now()) {
				dispatch(
					reloginAuthToken({
						username: authState.username,
						password: authState.password,
					})
				);
			}
		}
		return () => {
			if (netSubscription) {
				netSubscription();
			}
		};
	}, [isFocused, authState, netInfo]);
	return null;
};

export default AuthComponent;
