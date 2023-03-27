import { getData, pushData, updateData } from '.'
import { User } from '../../models/User';
import { App } from '../../types';

export const createRoom = async (roomName: string, user: App.User) => {
	const author = User(user);
	const room: App.Room = {
		roomName,
		author,
		members: [author],
		cards: [
			{ label: "?", value: null },
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
	const room = await getData("rooms/" + roomId);
	if (!room) {
		throw new Error("Room not found");
	}

	if (room.members?.find((m: App.User) => m.uid === member.uid)) {
		throw new Error("User already in room");
	}

	const members = [...room.members, User(member)];

	return updateData({
		[`rooms/${roomId}/members`]: members,
	});
}

export const leaveRoom = async (roomId: string, memberId: string) => {
	const room = await getData("rooms/" + roomId);
	if (!room) {
		throw new Error("Room not found");
	}

	const members = room.members.filter((m: App.User) => m.uid !== memberId);

	return updateData({
		[`rooms/${roomId}/members`]: members,
	});
}

export const getRoomDetails = async (roomId: string) => {
	return getData(`rooms/${roomId}`);
}

