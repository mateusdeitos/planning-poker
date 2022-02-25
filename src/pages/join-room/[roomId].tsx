import { Button, Flex, FormControl, FormLabel, Input, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { useForm } from "../../hooks/useForm";

const joinRoom = async (roomId: string, memberName: string) => {
	return fetch(`/api/join-room/${roomId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			memberName,
		}),
	});
}

export default function JoinRoom() {
	const { register, getValues } = useForm({ defaultValues: { memberName: "Amanda" } });
	const router = useRouter();
	const roomId = Array.isArray(router.query.roomId) ? router.query.roomId[0] : router.query.roomId;
	const { mutateAsync, status, error } = useMutation((memberName: string) => joinRoom(roomId, memberName), {
		onSuccess: () => router.push(`/voting/${roomId}`),
	});

	if (!roomId) {
		return <Flex
			h="100vh"
			direction="column"
			alignItems="center"
			justifyContent="center"
		>
			<Text>Deu erro :(</Text>
		</Flex>
	}

	return (
		<Flex h="100vh" direction="row" alignItems="center" justifyContent="center">
			<VStack spacing={4}>

				<FormControl>
					<FormLabel htmlFor="memberName">Como você quer ser chamado</FormLabel>
					<Input type="text" id="memberName" {...register("memberName")} />
				</FormControl>
				<Button variant="solid" isLoading={status === 'loading'} onClick={async () => {
					if (getValues().memberName) {
						await mutateAsync(getValues().memberName);
					}
				}}>Join the room</Button>
			</VStack >
		</Flex>
	);

}
