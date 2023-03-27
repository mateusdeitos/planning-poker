import { useRouter } from "next/router";
import { useEffect } from "react";
import PrivatePage from "../../components/PrivatePage";
import { Header } from "../../components/Header";
import { Members } from "../../components/Voting/Members";
import { Wrapper } from "../../components/Wrapper";
import { useAuth } from "../../context/AuthContext";
import { useRoomDetails } from "../../hooks/useRoomDetails";
import { useRoomIdFromRouter } from "../../hooks/useRoomIdFromRouter";
import { CardOptions } from "../../components/Voting/CardOptions";
import { RevealingOverlay } from "../../components/Voting/RevealingOverlay";
import { Actions } from "../../components/Voting/Actions";
import { Results } from "../../components/Voting/Results";
import { Text } from "@chakra-ui/react";

function VotingPage() {
	const { user, isLoading: isLoadingAuth } = useAuth();
	const roomId = useRoomIdFromRouter();
	const router = useRouter();
	const { data: room, isError, isLoading, error } = useRoomDetails(roomId, {
		onEmptySnapshot() {
			router.push("/");
		},
		onError(error) {
			if (error.response.status == 404) {
				router.push("/404");
			}
		},
	});

	const isRevealing = room?.votingState === "revealing";
	const loading = isLoading || isLoadingAuth;
	const isInRoom = !!room?.members?.[user?.uid];

	useEffect(() => {
		if (loading) return;
		if (!room?.members) return;
		if (isInRoom) return;

		router.push(`/join-room?roomId=${roomId}`);

	}, [loading, isInRoom]);

	if (loading || !isInRoom) return null;

	return (
		<Wrapper>
			<Header subTitle={<Text>{room.roomName}</Text>} />
			<Actions />
			{isRevealing && <RevealingOverlay />}
			{isLoading && <p>Loading...</p>}
			{isError && <p>Error: {error.message}</p>}
			{!!room?.members && <Members members={room.members} />}
			{room.votingState !== "finished" && <CardOptions />}
			{room.votingState === "finished" && <Results />}
		</Wrapper>
	);
}

export default PrivatePage(VotingPage);