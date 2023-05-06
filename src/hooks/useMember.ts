import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "../services/firebase/api";
import { App } from "../types";
import { useRoomDetails } from "./useRoomDetails";
import { useSubscribeToRef } from "./useSubscribeToRef";

export const useMember = (
	roomId: string,
	memberId: string,
	onSuccess?: (data: App.User) => void
) => {
	const queryClient = useQueryClient();
	const queryKey = ["room", roomId, "members", memberId];
	const query = useQuery<App.User, AxiosError<string>>(
		queryKey,
		() => api.get(`/api/room/${roomId}/members/${memberId}`).then((res) => res.data),
		{
			enabled: !!roomId && !!memberId,
			refetchOnWindowFocus: false,
			staleTime: Infinity,
			cacheTime: 0,
			onSuccess(data) {
				if (onSuccess) {
					onSuccess(data);
				}
			},
		}
	);

	const { updateMember } = useRoomDetails(roomId);

	useSubscribeToRef<App.User>(`rooms/${roomId}/members/${memberId}`, (member) => {
		if (!member) {
			return;
		}

		queryClient.setQueryData<App.User>(queryKey, member);
	});

	const updateVoteStatus = (voteStatus: App.User["voteStatus"], vote: App.User["vote"]) => {
		const currentMember = queryClient.getQueryData<App.User>(queryKey);
		if (!currentMember) return;
		const newMember = {
			...currentMember,
			voteStatus,
			vote,
		};

		queryClient.setQueryData<App.User>(queryKey, newMember);
		updateMember(newMember);
	};

	const setVote = (vote: App.Card["value"]) => {
		updateVoteStatus("voted", vote);
	};

	const setUnvote = () => {
		updateVoteStatus("not-voted", null);
	};

	return {
		...query,
		setVote,
		setUnvote,
		invalidate: () => queryClient.invalidateQueries(queryKey),
	};
};
