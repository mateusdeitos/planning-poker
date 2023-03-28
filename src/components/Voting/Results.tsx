import { Flex, Stat, StatHelpText, StatLabel, StatNumber, useColorModeValue } from "@chakra-ui/react";
import { useMemo } from "react";
import { useRoomDetails } from "../../hooks/useRoomDetails";
import { useRoomIdFromRouter } from "../../hooks/useRoomIdFromRouter";
import { App } from "../../types";

export const Results = () => {
	const roomId = useRoomIdFromRouter();
	const { data: room } = useRoomDetails(roomId);
	const statBg = useColorModeValue("gray.200", "gray.700");

	interface IResults {
		average: number;
		count: number;
		highest: App.User;
		lowest: App.User;
	};

	const results = useMemo<IResults | null>(() => {
		if (!room)
			return null;
		if (Object.keys(room.members).length === 0)
			return null;
		let sum = 0;
		let count = 0;
		let highest: App.User = null;
		let lowest: App.User = null;
		Object.values(room.members).forEach(member => {
			if (member.voteStatus === "voted" && typeof member.vote === "number") {
				sum += member.vote;
				count++;
				if (member.vote > highest?.vote || highest === null)
					highest = member;
				if (member.vote < lowest?.vote || lowest === null)
					lowest = member;
			}
		});

		const average = (sum / count);

		return {
			average,
			count,
			highest,
			lowest,
		};

	}, [room]);

	if (!room)
		return null;

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
			<Stat bg={statBg} p={4} borderRadius={4} w={100}>
				<StatLabel>Total</StatLabel>
				<StatNumber>{results.count.toFixed(2)}</StatNumber>
			</Stat>
			<Stat bg={statBg} p={4} borderRadius={4} w={100}>
				<StatLabel>Média</StatLabel>
				<StatNumber>{results.average.toFixed(2)}</StatNumber>
			</Stat>
			{!!results.lowest && (
				<Stat bg={statBg} p={4} borderRadius={4} w={300}>
					<StatLabel>Menor</StatLabel>
					<StatNumber>{results.lowest.vote}</StatNumber>
					<StatHelpText>{results.lowest.displayName}</StatHelpText>
				</Stat>
			)}
			{!!results.highest && (
				<Stat bg={statBg} p={4} borderRadius={4} w={300}>
					<StatLabel>Maior</StatLabel>
					<StatNumber>{results.highest.vote}</StatNumber>
					<StatHelpText>{results.highest.displayName}</StatHelpText>
				</Stat>
			)}
		</Flex>
	);
};
