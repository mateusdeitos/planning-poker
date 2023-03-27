import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { App } from "../types";
import { useSubscribeToRef } from "./useSubscribeToRef";

export const useMember = (roomId: string, memberId: string, onSuccess?: (data: App.User) => void) => {
	const queryClient = useQueryClient();
	const queryKey = ["room", roomId, "members", memberId];
	const query = useQuery<App.User, AxiosError<string>>(queryKey,
		() => axios.get(`/api/room/${roomId}/members/${memberId}`).then(res => res.data),
		{
			enabled: !!roomId && !!memberId,
			refetchOnWindowFocus: false,
			staleTime: Infinity,
			onSuccess(data) {
				if (onSuccess) {
					onSuccess(data);
				}
			},
		}
	);

	useSubscribeToRef<App.User>(`rooms/${roomId}/members/${memberId}`, (member) => {
		if (!member) {
			return;
		}

		queryClient.setQueryData<App.User>(queryKey, member);
	});

	return {
		...query,
		invalidate: () => queryClient.invalidateQueries(queryKey)
	};
};
