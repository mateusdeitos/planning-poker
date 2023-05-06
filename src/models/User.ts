import { User as FireBaseUser } from "firebase/auth";
import { App } from "../types";

export const User = (
	user: App.User | FireBaseUser,
	role: App.User["role"] = "member"
): App.User => {
	return {
		displayName: user.displayName,
		photoURL: user.photoURL,
		email: user.email,
		uid: user.uid,
		vote: null,
		voteStatus: "not-voted",
		role,
	};
};

export const isUser = (user: any): user is App.User => {
	if (!user) {
		return false;
	}

	if (!user.displayName) {
		return false;
	}

	// if (!user.photoURL) {
	// 	return false;
	// }

	if (!user.email) {
		return false;
	}

	if (!user.uid) {
		return false;
	}

	return true;
};
