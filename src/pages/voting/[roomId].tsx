import { Button, Flex, useToast } from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMutation } from "react-query";
import PrivatePage from "../../components/PrivatePage";
import { useAuth } from "../../context/AuthContext";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { useRoomDetails } from "../../hooks/useRoomDetails";
import { useRoomMembers } from "../../hooks/useRoomMembers";

function VotingPage() {
	const { user, isLoading: isLoadingAuth } = useAuth();
	const router = useRouter();
	const toast = useToast();
	const roomId = Array.isArray(router.query.roomId) ? router.query.roomId[0] : router.query.roomId;
	const [room, { isError, isLoading, error }] = useRoomDetails(roomId)
	const [members] = useRoomMembers(roomId);
	const copyToClipboard = useCopyToClipboard(
		`${window.location.origin}/join-room?roomId=${roomId}`,
		"URL copiada para a área de transferência"
	);

	const leaveRoom = useMutation({
		mutationFn: () => axios.post(`/api/leave-room/${roomId}`, { user }),
		onSuccess: () => router.push(`/`),
		onError: (error: AxiosError<string>) => {
			toast({
				title: 'Ocorreu um erro.',
				description: error?.response?.data,
				status: 'error',
			})
		}
	})

	const loading = isLoading || isLoadingAuth;
	const userIsRoomAuthor = room?.author?.uid === user.uid;
	const isInRoom = members?.some(member => member.uid === user.uid);

	useEffect(() => {
		if (loading) return;
		if (!members?.length) return;
		if (isInRoom) return;

		router.push(`/join-room?roomId=${roomId}`);

	}, [members, loading, isInRoom]);

	if (loading || !isInRoom) return null;

	return (
		<Flex
			h="100vh"
			direction="column"
			alignItems="center"
			justifyContent="center"
		>
			<h1>Voting Page</h1>
			{isLoading && <p>Loading...</p>}
			{isError && <p>Error: {error.message}</p>}
			{!!members?.length && <ul>
				{members.map(member => <li key={member.uid}>{member.email}</li>)}
			</ul>}
			{!userIsRoomAuthor && <Button variant="solid" onClick={() => leaveRoom.mutate()}>Leave room</Button>}
			<Button variant="link" onClick={copyToClipboard}>Invite people to the room</Button>
		</Flex>
	);

}

export default PrivatePage(VotingPage);