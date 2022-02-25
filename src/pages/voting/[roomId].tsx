import { Flex, useToast, Button } from "@chakra-ui/react";
import { onValue, ref } from "firebase/database";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { database } from "../../services/firebase";

interface IResponseRoomDetails {
	members: string[],
	authorName: string,
	roomName: string;
}


export default function VotingPage() {
	const [members, setMembers] = useState<string[]>([]);
	const router = useRouter();
	const toast = useToast();
	const roomId = Array.isArray(router.query.roomId) ? router.query.roomId[0] : router.query.roomId;
	const { isLoading, isError, error } = useQuery<any, Error>("room", () => fetch(`/api/room/${roomId}`).then(res => res.json()), {
		enabled: !!roomId,
		refetchOnWindowFocus: false,
		onSuccess: (data: IResponseRoomDetails) => {
			// console.log(data);
			setMembers(data.members);
		}
	});

	const copyToClipboard = () => {
		navigator.clipboard.writeText(`${window.location.origin}/join-room/${roomId}`).then(() => {
			toast({
				variant: "subtle",
				status: "success",
				title: "URL copiada para a área de transferência",
			})
		});
	}

	useEffect(() => {
		if (roomId) {
			const unsubscribe = onValue(ref(database, `rooms/${roomId}/members`), (snapshot) => {
				setMembers(snapshot.val());
			});

			return () => unsubscribe();
		}
	}, [roomId])

	return (
		<Flex
			h="100vh"
			direction="column"
			alignItems="center"
			justifyContent="center"
		>
			<h1>Voting Page</h1>
			<p>Room ID: {roomId}</p>
			{isLoading && <p>Loading...</p>}
			{isError && <p>Error: {error.message}</p>}
			{members && <ul>
				{members && members.map(member => <li key={member}>{member}</li>)}
			</ul>}
			<Button variant="link" onClick={copyToClipboard}>Invite colleagues to the room</Button>
		</Flex>
	);

}
