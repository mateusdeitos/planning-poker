import { Flex, useColorModeValue, useToast, useUpdateEffect } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMember } from "../../hooks/useMember";
import { useRoomDetails } from "../../hooks/useRoomDetails";
import { useRoomIdFromRouter } from "../../hooks/useRoomIdFromRouter";
import { api } from "../../services/firebase/api";
import { App } from "../../types";
import { VotingCard } from "../VotingCard";

export const CardOptions = () => {
	const { user } = useAuth();
	const toast = useToast();
	const roomId = useRoomIdFromRouter();
	const { data: room, isSuccess } = useRoomDetails(roomId);
	const memberQuery = useMember(roomId, user.uid, (data) => {
		setSelected(data.vote);
	});

	const [selected, setSelected] = useState<App.User["vote"] | null | undefined>(
		memberQuery?.data?.vote
	);
	const debounceMutationRef = useRef<NodeJS.Timeout | null>(null);
	const cardBgColor = useColorModeValue("white", "gray.700");

	const voteMutation = useMutation((vote: App.Card["value"]) =>
		api.post(`/api/vote/${roomId}`, {
			vote,
			user,
		})
	);

	const unVoteMutation = useMutation(() =>
		api.post(`/api/un-vote/${roomId}`, {
			user,
		})
	);

	const toggle = (value: App.Card["value"]) => {
		if (selected === value) {
			setSelected(null);
			memberQuery.setUnvote();
			return;
		}

		setSelected(value);
		memberQuery.setVote(value);
	};

	useUpdateEffect(() => {
		clearTimeout(debounceMutationRef.current);
		debounceMutationRef.current = setTimeout(() => {
			const onError = () => {
				toast({
					colorScheme: "red",
					title: "Ocorreu um erro ao salvar o voto",
				});

				memberQuery.invalidate();
			};

			if (selected === undefined) return;

			if (selected === null) {
				unVoteMutation.mutate(null, { onError });
				return;
			}

			voteMutation.mutate(selected, { onError });
		}, 500);

		return () => clearTimeout(debounceMutationRef.current);
	}, [selected]);

	if (!isSuccess) return null;
	if (!memberQuery.isSuccess) return null;

	return (
		<Flex
			direction="row"
			wrap="nowrap"
			overflowX="auto"
			w="100%"
			px={{ base: "10px", md: "50px" }}
			py={10}
			justifyContent="flex-start"
			gap="8px"
			mb={4}
		>
			{room?.cards?.map((card, index) => {
				const isSelected = card.value === selected;
				return (
					<VotingCard
						key={index}
						role="group"
						h={100}
						w={75}
						selected={isSelected}
						onClick={() => toggle(card.value)}
						border="2px solid"
						borderColor={isSelected ? "green.300" : cardBgColor}
						bg={cardBgColor}
						_hover={{ borderColor: "green.300" }}
						cursor="pointer"
					>
						<VotingCard.HoverableBody value={card.label} selected={card.value === selected} />
					</VotingCard>
				);
			})}
		</Flex>
	);
};
