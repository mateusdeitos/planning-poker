import { useRouter } from "next/router";
import { useEffect } from "react";
import PrivatePage from "../../components/PrivatePage";
import { Header } from "../../components/Voting/Header";
import { Members } from "../../components/Voting/Members";
import { Wrapper } from "../../components/Voting/Wrapper";
import { useAuth } from "../../context/AuthContext";
import { useRoomDetails } from "../../hooks/useRoomDetails";
import { useRoomIdFromRouter } from "../../hooks/useRoomIdFromRouter";
import { CardOptions } from "../../components/Voting/CardOptions";

function VotingPage() {
	const { user, isLoading: isLoadingAuth } = useAuth();
	const roomId = useRoomIdFromRouter();
	const router = useRouter();
	const { data: room, isError, isLoading, error } = useRoomDetails(roomId, {
		onEmptySnapshot() {
			router.push("/");
		},
	});

	// const members: App.Room["members"] = new Array(50).fill({
	// 	"displayName": "Mateus Campos Deitos",
	// 	"email": "matdeitos@gmail.com",
	// 	"photoURL": "https://lh3.googleusercontent.com/a-/AOh14Gj9UapsiyM90aaYSPCK5uTGBfrzANPdQ3FwXfJo_VI=s96-c",
	// 	"uid": "dAH4UIcyifUlikvxeebRZFInodF2",
	// 	vote: null,
	// 	voteStatus: "not-voted",
	// }).reduce((acc, member, index) => {
	// 	acc[index.toString()] = member;
	// 	return acc;
	// }, {});


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
			<Header />
			{isLoading && <p>Loading...</p>}
			{isError && <p>Error: {error.message}</p>}
			{!!room?.members && <Members members={room.members} />}
			<CardOptions />
		</Wrapper>
	);
}

export default PrivatePage(VotingPage);