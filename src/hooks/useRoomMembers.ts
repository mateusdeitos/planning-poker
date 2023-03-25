import { useRoomDetails } from "./useRoomDetails";

export const useRoomMembers = (roomId: string) => {
	const [{ members }, query] = useRoomDetails(roomId);

	return [members, query] as const;
}