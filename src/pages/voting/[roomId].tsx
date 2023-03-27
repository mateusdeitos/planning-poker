import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import PrivatePage from "../../components/PrivatePage";
import { Header } from "../../components/Voting/Header";
import { Members } from "../../components/Voting/Members";
import { Wrapper } from "../../components/Voting/Wrapper";
import { VotingCard } from "../../components/VotingCard";
import { useAuth } from "../../context/AuthContext";
import { useRoomDetails } from "../../hooks/useRoomDetails";
import { useRoomIdFromRouter } from "../../hooks/useRoomIdFromRouter";
import { App } from "../../types";

function VotingPage() {
	const { user, isLoading: isLoadingAuth } = useAuth();
	const roomId = useRoomIdFromRouter();
	// const [, { isError, isLoading, error }] = useRoomDetails(roomId)
	const members: App.User[] = [
		{
			"displayName": "Mateus Campos Deitos",
			"email": "matdeitos@gmail.com",
			"photoURL": "https://lh3.googleusercontent.com/a-/AOh14Gj9UapsiyM90aaYSPCK5uTGBfrzANPdQ3FwXfJo_VI=s96-c",
			"uid": "dAH4UIcyifUlikvxeebRZFInodF2",
			vote: null,
			voteStatus: "not-voted",
		}
	];

	// const loading = isLoading || isLoadingAuth;
	// const isInRoom = members?.some(member => member.uid === user.uid);

	// useEffect(() => {
	// 	if (loading) return;
	// 	if (!members?.length) return;
	// 	if (isInRoom) return;

	// 	router.push(`/join-room?roomId=${roomId}`);

	// }, [members, loading, isInRoom]);

	// if (loading || !isInRoom) return null;

	return (
		<Wrapper>
			<Header />
			{/* {isLoading && <p>Loading...</p>}
			{isError && <p>Error: {error.message}</p>} */}
			{!!members?.length && <Members members={members} />}
			<CardOptions />
		</Wrapper>
	);
}

const CardOptions = () => {
	const roomId = useRoomIdFromRouter();
	const { data, isSuccess } = useRoomDetails(roomId);
	const [selected, setSelected] = useState<number | null>(null);

	const toggle = (value: number) => {
		if (selected === value) setSelected(null);
		else setSelected(value);
	}

	if (!isSuccess) return null;

	return (
		<Flex
			direction="row"
			wrap="nowrap"
			overflowX="auto"
			w="100%"
			p="15px"
			minWidth="calc(100vw - 32px)"
			justifyContent="flex-start"
			gap="8px"
			mb={4}
		>
			{data?.cards?.map((card, index) => (
				<VotingCard
					key={index}
					h={100}
					w={75}
					selected={card.value === selected}
					onClick={() => toggle(card.value)}
					cursor="pointer"
				>
					<VotingCard.RevealedBody value={card.label} selected={card.value === selected} />
				</VotingCard>
			))}
		</Flex>
	)
}

export default PrivatePage(VotingPage);