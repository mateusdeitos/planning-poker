import { getData, pushData, updateData } from '.'
import { User } from '../../models/User';
import { App } from '../../types';

export const createRoom = async (roomName: string, user: App.User) => {
	const author = User(user);
	const room: App.Room = {
		roomName,
		author,
		members: {
			[author.uid]: author,
		},
		cards: [
			{ label: "?", value: "?" },
			{ label: "0", value: 0 },
			{ label: "1/2", value: 0.5 },
			{ label: "1", value: 1 },
			{ label: "2", value: 2 },
			{ label: "3", value: 3 },
			{ label: "5", value: 5 },
			{ label: "8", value: 8 },
			{ label: "13", value: 13 },
			{ label: "20", value: 20 },
			{ label: "40", value: 40 },
			{ label: "100", value: 100 },
		],
		votingState: "voting"
	}

	return pushData("rooms", room);
}

export const joinRoom = async (roomId: string, member: App.User) => {
	const room = await getRoomDetails(roomId);
	if (!room) {
		throw new Error("Room not found");
	}

	if (!!room.members[member.uid]) {
		return Promise.resolve();
	}

	const members: App.Room["members"] = {
		...room.members,
		[member.uid]: User(member)
	};

	return updateData({
		[`rooms/${roomId}/members`]: members,
	});
}

export const leaveRoom = async (roomId: string, memberId: string) => {
	const room = await getRoomDetails(roomId);
	if (!room) {
		throw new Error("Room not found");
	}

	const members = { ...room.members };
	delete members[memberId];

	return updateData({
		[`rooms/${roomId}/members`]: members,
	});
}

export const vote = async (roomId: string, memberId: string, vote: App.Card["value"]) => {
	const room = await getRoomDetails(roomId);
	if (!room) {
		throw new Error("Room not found");
	}

	if (!room.members[memberId]) {
		throw new Error("Member not found");
	}

	const members = { ...room.members };
	members[memberId].vote = vote;
	members[memberId].voteStatus = "voted";

	return updateData({
		[`rooms/${roomId}/members`]: members,
	});
}

export const unVote = async (roomId: string, memberId: string) => {
	const room = await getRoomDetails(roomId);
	if (!room) {
		throw new Error("Room not found");
	}

	if (!room.members[memberId]) {
		throw new Error("Member not found");
	}

	const members = { ...room.members };
	members[memberId].vote = null;
	members[memberId].voteStatus = "not-voted";

	return updateData({
		[`rooms/${roomId}/members`]: members,
	});
}

export const getRoomDetails = async (roomId: string) => {
	return getData<App.Room | null>(`rooms/${roomId}`);
}

