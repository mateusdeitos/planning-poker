
import * as firebaseAdmin from "firebase-admin";

try {
	firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert({
			clientEmail: process.env.CLIENT_EMAIL,
			privateKey: process.env.PRIVATE_KEY
				? process.env.PRIVATE_KEY.replace(/\\n/gm, "\n")
				: undefined,
			projectId: process.env.PROJECT_ID,
		}),
		databaseURL: process.env.DATABASE_URL,
	});
} catch (error) {
	if (error.code !== "app/duplicate-app") {
		throw error;
	}
}
export const auth = firebaseAdmin.auth();