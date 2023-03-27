import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const PrivatePage = (Component: React.FC) => {
	return function Wrapper(props) {
		const router = useRouter();
		const { user, isLoading } = useAuth();
		useEffect(() => {
			if (!user && !isLoading) {
				router.push("/login", router.asPath);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [user, isLoading]);

		if (!user) {
			return null;
		}

		return <Component {...props} />
	}
}

export default PrivatePage;