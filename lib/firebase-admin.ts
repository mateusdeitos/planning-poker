import * as firebaseAdmin from "firebase-admin";

try {
	firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert(
			JSON.parse(process.env.SERVICE_ACCOUNT)
		),
		databaseURL: process.env.DATABASE_URL,
	});
} catch (error) {
	if (error.code !== "app/duplicate-app") {
		throw error;
	}
}
export const auth = firebaseAdmin.auth();

export const getData = async <T>(refId: string) => {
	const { database } = firebaseAdmin;
	return database()
		.ref(refId)
		.get()
		.then((snapshot) => snapshot.val() as T);
};

export const pushData = async (refId: string, data: any) => {
	const { database } = firebaseAdmin;
	return database().ref(refId).push(data);
};

export const updateData = async (refId: string, data: any) => {
	const { database } = firebaseAdmin;
	return database().ref(refId).update(data);
};

export const remove = async (refId: string) => {
	const { database } = firebaseAdmin;
	return database().ref(refId).remove();
};
