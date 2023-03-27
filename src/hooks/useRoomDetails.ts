import { useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "../types";
import { useSubscribeToRef } from "./useSubscribeToRef";

type Options = {
	onEmptySnapshot?: () => void;
}

export const useRoomDetails = (roomId: string, options?: Options) => {
	const queryClient = useQueryClient();
	const queryKey = ["room", roomId];
	const query = useQuery<App.Room, Error>(queryKey, () => fetch(`/api/room/${roomId}`).then(res => res.json()), {
		enabled: !!roomId,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});

	useSubscribeToRef<App.Room>(`rooms/${roomId}`, (room) => {
		if (room === null || room === undefined && options?.onEmptySnapshot) {
			options.onEmptySnapshot();
			return;
		}

		queryClient.setQueryData<App.Room>(queryKey, room);
	})

	return query;
}