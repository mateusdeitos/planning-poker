import axios from "axios";
import { auth } from ".";

export const api = axios.create();

api.interceptors.request.use(async (config) => {
	const currentUser = auth.currentUser;
	if (currentUser) {
		const token = await currentUser.getIdToken();
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});