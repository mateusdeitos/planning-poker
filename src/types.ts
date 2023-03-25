import { User as FireBaseUser } from "firebase/auth"
export declare module App {

	type User = Pick<FireBaseUser, "displayName" | "photoURL" | "email" | "uid">

	type Card = {
		value: string,
		label: string,
	}

	type Voting = {
		[userId: string]: Card["value"],
	}

	type Room = {
		members: App.User[],
		author: App.User,
		roomName: string;
		cards: App.Card[],
		voting: App.Voting,
	}

}