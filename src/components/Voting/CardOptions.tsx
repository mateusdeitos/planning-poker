import { Flex, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";
import { VotingCard } from "../VotingCard";
import { useAuth } from "../../context/AuthContext";
import { useRoomDetails } from "../../hooks/useRoomDetails";
import { useRoomIdFromRouter } from "../../hooks/useRoomIdFromRouter";
import { App } from "../../types";
import { useMember } from "../../hooks/useMember";

export const CardOptions = () => {
	const { user } = useAuth();
	const toast = useToast();
	const roomId = useRoomIdFromRouter();
	const { data: room, isSuccess } = useRoomDetails(roomId);
	const memberQuery = useMember(roomId, user.uid);
	const selected = memberQuery?.data?.vote;
	const debounceMutationRef = useRef<NodeJS.Timeout | null>(null);

	const voteMutation = useMutation((vote: App.Card["value"]) => axios.post(`/api/vote/${roomId}`, {
		vote,
		user
	}));

	const unVoteMutation = useMutation(() => axios.post(`/api/un-vote/${roomId}`, {
		user
	}));

	const optimisticUpdate = (value: App.Card["value"]) => {
		if (selected === value) {
			memberQuery.setUnvote();
			return "un-vote";
		}

		memberQuery.setVote(value);
		return "vote";
	};

	const onSelectCard = (value: App.Card["value"]) => {
		const isLoading = voteMutation.isLoading || unVoteMutation.isLoading;
		if (isLoading) return;

		const action = optimisticUpdate(value);
		clearTimeout(debounceMutationRef.current);
		debounceMutationRef.current = setTimeout(() => {
			const onError = () => {
				toast({
					colorScheme: "red",
					title: "Ocorreu um erro ao salvar o voto",
				});

				memberQuery.invalidate();
			};

			if (action === "un-vote") {
				unVoteMutation.mutate(null, { onError });
				return;
			}

			voteMutation.mutate(value, { onError });
		}, 500);
	};

	if (!isSuccess) return null;
	if (!memberQuery.isSuccess) return null;

	return (
		<Flex
			direction="row"
			wrap="nowrap"
			overflowX="auto"
			w="100%"
			px={50}
			py={10}
			justifyContent="flex-start"
			gap="8px"
			mb={4}
		>
			{room?.cards?.map((card, index) => {
				const isSelected = card.value === selected;
				return <VotingCard
					key={index}
					h={100}
					w={75}
					selected={isSelected}
					onClick={() => onSelectCard(card.value)}
					cursor="pointer"
				>
					<VotingCard.RevealedBody value={card.label} selected={card.value === selected} />
				</VotingCard>;
			})}
		</Flex>
	);
};
