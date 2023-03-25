import { getData, pushData, updateData } from '.'
import { User } from '../../models/User';
import { App } from '../../types';

export const createRoom = async (roomName: string, user: App.User) => {
	const author = User(user);
	const room: App.Room = {
		roomName,
		author,
		members: [author],
		cards: ["?", "0", "1/2", "1", "2", "3", "5", "8", "13", "20", "40", "100"].map(value => ({
			value,
			label: value,
		})),
		voting: {},
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

