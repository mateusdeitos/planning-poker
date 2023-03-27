import { useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "../types";
import { useSubscribeToRef } from "./useSubscribeToRef";

export const useRoomDetails = (roomId: string) => {
	const queryClient = useQueryClient();
	const query = useQuery<App.Room, Error>(["room"], () => fetch(`/api/room/${roomId}`).then(res => res.json()), {
		enabled: !!roomId,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});

	useSubscribeToRef<App.Room>(`rooms/${roomId}`, (room) => {
		if (!!room) {
			queryClient.setQueryData<App.Room>(["room"], room);
		}
	})

	return query;
}