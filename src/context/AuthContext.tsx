import React, { createContext, useContext } from "react";
import {
	User,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

interface AuthProps {
	user: User | null;
	loginGoogle: (redirectUrl?: string) => void;
	logout: () => void;
	isLoading: boolean;
}

const Context = createContext<AuthProps>({} as AuthProps);

export const useAuth = () => useContext(Context);

export const AuthProvider = ({ children }) => {
	const router = useRouter();
	const [user, isLoading] = useAuthState(auth);

	const loginGoogle = async (redirectUrl = "/") => {
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
		router.push(redirectUrl);
	};

	const logout = React.useCallback(async () => {
		await signOut(auth);
		router.push("/login");
	}, []);

	return (
		<Context.Provider value={{ user, loginGoogle, isLoading, logout }}>
			{children}
		</Context.Provider>
	);
};
