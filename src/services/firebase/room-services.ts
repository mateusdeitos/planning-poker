import { getData, pushData, updateData } from '.'

export const createRoom = async (roomName: string, authorName: string) => {
	return pushData("rooms", {
		roomName,
		authorName,
		members: [
			authorName,
		]
	});
}

export const joinRoom = async (roomId: string, memberName: string) => {
	const room = await getData("rooms/" + roomId);
	if (!room) {
		throw new Error("Room not found");
	}

	const members = [...room.members, memberName];

	return updateData({
		[`rooms/${roomId}/members`]: members,
	});
}

export const getRoomDetails = async (roomId: string) => {
	return getData(`rooms/${roomId}`);
}
