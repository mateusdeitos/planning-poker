import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { App } from "../types";
import { useSubscribeToRef } from "./useSubscribeToRef";

type Options<S = any> = {
	onEmptySnapshot?: () => void;
	onError?: (error: AxiosError<string>) => void;
	select?: (room: App.Room) => S;
}

export const useRoomDetails = <S = App.Room>(roomId: string, options?: Options<S>) => {
	const queryClient = useQueryClient();
	const queryKey = ["room", roomId];
	const query = useQuery<App.Room, AxiosError<string>, S>(queryKey,
		() => axios.get(`/api/room/${roomId}`).then(res => res.data),
		{
			enabled: !!roomId,
			retry: false,
			refetchOnWindowFocus: false,
			staleTime: Infinity,
			select: options?.select ?? ((room) => room as unknown as S),
			onError: options?.onError,
		}
	);

	useSubscribeToRef<App.Room>(`rooms/${roomId}`, (room) => {
		if ((room === null || room === undefined) && options?.onEmptySnapshot) {
			options.onEmptySnapshot();
			return;
		}

		queryClient.setQueryData<App.Room>(queryKey, room);
	});

	const invalidate = () => queryClient.invalidateQueries(queryKey);

	const updateMember = (member: App.User) => {
		queryClient.setQueryData<App.Room>(queryKey, (room) => {
			if (!room) {
				return room;
			}

			return {
				...room,
				members: {
					...room.members,
					[member.uid]: member,
				},
			};
		});
	}

	return {
		...query,
		updateMember,
		invalidate,
	};
}