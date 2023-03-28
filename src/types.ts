import { User as FireBaseUser } from "firebase/auth"
import { NextApiRequest, NextApiResponse } from "next";
export declare module App {

	type User = Pick<FireBaseUser, "displayName" | "photoURL" | "email" | "uid"> & {
		vote: Card["value"];
		voteStatus: "voted" | "not-voted";
	}

	type Card = {
		value: number | "?",
		label: string,
	}


	type Room = {
		members: Record<User["uid"], App.User>,
		author: App.User,
		roomName: string;
		cards: App.Card[],
		votingState: "voting" | "revealing" | "finished",
	}

	interface RouteRequest extends NextApiRequest {
		uid: string;
	}

	type RouteHandler = (req: RouteRequest, res: NextApiResponse) => Promise<any>;

}