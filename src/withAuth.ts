import { NextApiResponse } from "next";
import { auth } from "../lib/firebase-admin";
import { App } from "./types";

export function withAuth(handler: App.RouteHandler) {
	return async (req: App.RouteRequest, res: NextApiResponse) => {
		const authHeader = req.headers.authorization;
		if (!authHeader || typeof authHeader !== "string") {
			return res.status(401).end("Not authenticated. No Auth header");
		}

		const token = authHeader.split(" ")[1];
		let decodedToken;
		try {
			decodedToken = await auth.verifyIdToken(token);
			if (!decodedToken || !decodedToken.uid) {
				return res.status(401).end("Not authenticated");
			}

			req.uid = decodedToken.uid;
		} catch (error) {
			console.log(error.errorInfo);
			const errorCode = error.errorInfo.code;
			error.status = 401;
			if (errorCode === "auth/internal-error") {
				error.status = 500;
			}

			return res.status(error.status).json({ error: errorCode });
		}

		return handler(req, res);
	};
}
