import { useAuth } from "../../context/AuthContext";
import { useRoomDetails } from "../../hooks/useRoomDetails";
import { useRoomIdFromRouter } from "../../hooks/useRoomIdFromRouter";
import { Button, Flex } from "@chakra-ui/react";
import { IconDice, IconPlayerPlay } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { App } from "../../types";
import { SECONDS_TO_REVEAL } from "../../pages/voting/[roomId]";

export const Actions = () => {
	const roomId = useRoomIdFromRouter();
	const { user } = useAuth();
	const { data: votingState, invalidate, isLoading } = useRoomDetails(roomId, {
		select(room) {
			return room.votingState;
		},
	});

	const mutation = useMutation({
		mutationKey: ["change-state"],
		mutationFn: async (phase: App.Room["votingState"]) => {
			return axios.post(`/api/change-state/${roomId}`, { user, phase });
		},
	});

	return <Flex py={4} px={50} w="100%" alignItems="center" justifyContent="flex-start">
		{votingState !== "finished" && (
			<Button
				leftIcon={<IconPlayerPlay />}
				isLoading={mutation.isLoading || isLoading}
				onClick={() => invalidate().then(() => {
					mutation.mutate("revealing", {
						onSuccess: () => {
							setTimeout(() => {
								mutation.mutate("finished");
							}, SECONDS_TO_REVEAL * 1000);
						}
					});
				})}
			>
				Revelar cartas
			</Button>
		)}

		{votingState === "finished" && (
			<Button
				leftIcon={<IconDice />}
				isLoading={mutation.isLoading}
				onClick={() => mutation.mutate("voting")}
			>
				Nova rodada
			</Button>
		)}
	</Flex>;
};
