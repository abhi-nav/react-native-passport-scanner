import React, { useEffect } from "react";
import { logout } from "../app/auth/authSlice";
import { useAppDispatch } from "../app/hooks";

const LogoutScreen = () => {
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(logout());
	}, []);

	return null;
};

export default LogoutScreen;
