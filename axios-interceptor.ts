import { AxiosError, AxiosRequestConfig } from "axios";
import {
	REACT_APP_PRODUCTION_API_URL,
	REACT_APP_API_DEVELOPEMENT_URL,
} from "@env";

import instance from "./axios";

export const setUpInterceptor = (isProduction: boolean) => {
	const handleError = async (error: AxiosError) => {
		return Promise.reject(error);
	};

	console.log("isProduction Outside", isProduction);

	instance.interceptors.request.use(
		async (config: any | AxiosRequestConfig) => {
			console.log("isProduction INSIDE", isProduction);
			if (isProduction) {
				config.baseURL = REACT_APP_PRODUCTION_API_URL;
			} else {
				config.baseURL = REACT_APP_API_DEVELOPEMENT_URL;
			}
			/* your logic here */
			// console.log("axios config", config);
			return config;
		}
	);

	instance.interceptors.response.use((response) => response, handleError);
};

// export default setUpInterceptor;
