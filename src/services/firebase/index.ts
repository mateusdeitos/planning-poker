// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { child, get, getDatabase, push, ref, update } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_APP_ID,
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const database = getDatabase(firebaseApp);

export const pushData = async (refId: string, data: Record<string, any>) => {
	return push(ref(getDatabase(firebaseApp), refId), data);
}

export const updateData = async (updates: Record<string, any>) => {
	return update(ref(getDatabase(firebaseApp)), updates);
}

export const getData = async <T>(refId: string) => {
	return get(child(ref(getDatabase(firebaseApp)), refId)).then(snapshot => snapshot.val() as T);
}

export const auth = getAuth(firebaseApp);