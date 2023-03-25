import { User as FireBaseUser } from "firebase/auth"
export declare module App {

	type User = Pick<FireBaseUser, "displayName" | "photoURL" | "email" | "uid">

	type RoomDetailsResponse = {
		members: App.User[],
		author: App.User,
		roomName: string;
	}

}