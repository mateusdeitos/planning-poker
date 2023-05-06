import {
	Flex,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	useColorModeValue,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useRoomDetails } from "../../hooks/useRoomDetails";
import { useRoomIdFromRouter } from "../../hooks/useRoomIdFromRouter";
import { App } from "../../types";
import { UserAvatar } from "../UserAvatar";

export const Results = () => {
	const roomId = useRoomIdFromRouter();
	const { data: room } = useRoomDetails(roomId);
	const statBg = useColorModeValue("gray.200", "gray.700");

	interface IResults {
		average: number;
		count: number;
		highest: App.User[];
		lowest: App.User[];
		lowestVote: number;
		highestVote: number;
	}

	const results = useMemo<IResults | null>(() => {
		if (!room) return null;
		if (Object.keys(room.members).length === 0) return null;
		let sum = 0;
		let count = 0;
		let highestVote: number = 0;
		let lowestVote: number = 0;
		const memberVoteMap: Record<number, App.User[]> = {};
		const pushMemberVote = (user: App.User) => {
			if (!memberVoteMap[user.vote]) {
				memberVoteMap[user.vote] = [];
			}

			memberVoteMap[user.vote].push(user);
		};

		Object.values(room.members).forEach((member) => {
			if (member.voteStatus === "voted" && typeof member.vote === "number") {
				sum += member.vote;
				count++;
				if (member.vote > highestVote) {
					highestVote = member.vote;
				}

				if (member.vote < lowestVote || lowestVote === 0) {
					lowestVote = member.vote;
				}

				pushMemberVote(member);
			}
		});

		const highest: App.User[] = memberVoteMap[highestVote] ?? [];
		const lowest: App.User[] = memberVoteMap[lowestVote] ?? [];

		const average = count === 0 ? 0 : sum / count;

		return {
			average,
			count,
			highest,
			lowest,
			highestVote,
			lowestVote,
		};
	}, [room]);

	if (!room) return null;

	return (
		<Flex
			direction="row"
			wrap="wrap"
			overflowX="auto"
			w="100%"
			px={{ base: "10px", md: "50px" }}
			py={10}
			justifyContent="flex-start"
			gap="8px"
			mb={4}
		>
			<Stat bg={statBg} p={4} borderRadius={4} w={100} maxW={100}>
				<StatLabel>Total</StatLabel>
				<StatNumber>{results.count.toFixed(2)}</StatNumber>
			</Stat>
			<Stat bg={statBg} p={4} borderRadius={4} w={100} maxW={100}>
				<StatLabel>Média</StatLabel>
				<StatNumber>{results.average.toFixed(2)}</StatNumber>
			</Stat>
			{!!results.lowestVote && (
				<Stat bg={statBg} p={4} borderRadius={4} w={300} maxW={300}>
					<StatLabel>Menor</StatLabel>
					<StatNumber>{results.lowestVote}</StatNumber>
					<StatHelpText>
						{results.lowest.map((u, index) => (
							<UserAvatar
								key={u.uid}
								user={u}
								size="sm"
								transform={`translateX(-${10 * index}px)`}
							/>
						))}
					</StatHelpText>
				</Stat>
			)}
			{!!results.highestVote && (
				<Stat bg={statBg} p={4} borderRadius={4} w={300} maxW={300}>
					<StatLabel>Maior</StatLabel>
					<StatNumber>{results.highestVote}</StatNumber>
					<StatHelpText>
						{results.highest.map((u, index) => (
							<UserAvatar
								key={u.uid}
								user={u}
								size="sm"
								transform={`translateX(-${10 * index}px)`}
							/>
						))}
					</StatHelpText>
				</Stat>
			)}
		</Flex>
	);
};
