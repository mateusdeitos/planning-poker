import { useState } from "react";
import { useQuery } from "react-query";
import { App } from "../types";
import { useSubscribeToRef } from "./useSubscribeToRef";

export const useRoomDetails = (roomId: string) => {
	const [room, setRoom] = useState<Partial<App.Room>>({});
	const query = useQuery<any, Error>("room", () => fetch(`/api/room/${roomId}`).then(res => res.json()), {
		enabled: !!roomId,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
		onSuccess: (data) => {
			setRoom(data);
		}
	});

	useSubscribeToRef<App.Room>(`rooms/${roomId}`, (room) => {
		setRoom(room);
	})

	return [room, query] as const;
}