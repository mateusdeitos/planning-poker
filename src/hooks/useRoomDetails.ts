import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/firebase/api";
import { App } from "../types";
import { useSubscribeToRef } from "./useSubscribeToRef";

type Options<S = any> = {
	onEmptySnapshot?: () => void;
	onError?: (error: AxiosError<string>) => void;
	select?: (room: App.Room) => S;
}

export const useRoomDetails = <S = App.Room>(roomId: string, options?: Options<S>) => {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const queryKey = ["room", roomId];
	const query = useQuery<App.Room, AxiosError<string>, S>(queryKey,
		() => api.get(`/api/room/${roomId}`).then(res => res.data),
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

		queryClient.setQueryData<App.Room>(queryKey, oldRoom => {
			if (!room) return oldRoom;

			if (oldRoom?.votingState != room.votingState) {
				return room;
			}

			return {
				...oldRoom,
				...room,
				members: Object.values(oldRoom?.members ?? {}).reduce((acc, member) => {
					// Não atualiza o user atual, porque ele é atualizado via 'updateMember' quando alguma mutation que altere o member seja executada
					if (member.uid === user?.uid) {
						acc[member.uid] = member;
						return acc;
					}

					return acc;
				}, room?.members ?? {}),
			}
		});
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