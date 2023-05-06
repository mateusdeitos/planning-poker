import { useRouter } from "next/router";

export const useRoomIdFromRouter = () => {
	const router = useRouter();
	const roomId = Array.isArray(router.query.roomId)
		? router.query.roomId[0]
		: router.query.roomId;
	return roomId;
};
