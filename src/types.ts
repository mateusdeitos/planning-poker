import { User as FireBaseUser } from "firebase/auth"
export declare module App {

	type User = Pick<FireBaseUser, "displayName" | "photoURL" | "email" | "uid"> & {
		vote: Card["value"];
		voteStatus: "voted" | "not-voted";
	}

	type Card = {
		value: number | null,
		label: string,
	}


	type Room = {
		members: Record<User["uid"], App.User>,
		author: App.User,
		roomName: string;
		cards: App.Card[],
		votingState: "voting" | "revealing" | "finished",
	}

}