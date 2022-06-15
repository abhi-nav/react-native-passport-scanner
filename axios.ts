import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { REACT_APP_API_DEVELOPEMENT_URL } from "@env";

const axiosInstance: AxiosInstance = axios.create({
	baseURL: REACT_APP_API_DEVELOPEMENT_URL,
	/* other custom settings */
} as AxiosRequestConfig);

export default axiosInstance;
