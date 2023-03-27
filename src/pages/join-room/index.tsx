import { Button, Flex, FormControl, FormLabel, Input, Text, useToast, VStack } from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import PrivatePage from "../../components/PrivatePage";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "../../hooks/useForm";
import { App } from "../../types";

function JoinRoom() {
	const { user } = useAuth();
	const { register, getValues } = useForm({ defaultValues: { memberName: user.displayName } });
	const router = useRouter();
	const toast = useToast();
	const roomId = Array.isArray(router.query.roomId) ? router.query.roomId[0] : router.query.roomId;
	const { mutate, status } = useMutation({
		mutationFn: (user: App.User) => axios.post(`/api/join-room/${roomId}`, { user }),
		onSuccess: () => router.push(`/voting/${roomId}`),
		onError: (error: AxiosError<string>) => {
			toast({
				title: 'Ocorreu um erro.',
				description: error?.response?.data,
				status: 'error',
			})
		}
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
						mutate({
							...user,
							displayName: getValues().memberName,
							vote: null,
							voteStatus: "not-voted"
						});
					}
				}}>Join the room</Button>
			</VStack >
		</Flex>
	);

}

export default PrivatePage(JoinRoom);
