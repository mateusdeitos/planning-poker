import { onValue, ref } from "firebase/database";
import { useEffect } from "react";
import { database } from "../services/firebase";

export const useSubscribeToRef = <T>(refId: string, onSnapshot: (data: T) => void) => {
	useEffect(() => {
		if (refId) {
			const unsubscribe = onValue(ref(database, refId), (snapshot) => {
				onSnapshot(snapshot.val() as T);
			});

			return () => unsubscribe();
		}
	}, [refId]);
}