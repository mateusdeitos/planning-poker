import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Text, useToast, VStack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import PrivatePage from "../../components/PrivatePage";
import { useAuth } from "../../context/AuthContext";
import { useRoomDetails } from "../../hooks/useRoomDetails";
import { api } from "../../services/firebase/api";
import { App } from "../../types";

function JoinRoom() {
	const { user } = useAuth();
	const { register, handleSubmit, formState } = useForm({ defaultValues: { memberName: user.displayName } });
	const router = useRouter();
	const toast = useToast();
	const roomId = Array.isArray(router.query.roomId) ? router.query.roomId[0] : router.query.roomId;
	const { isLoading } = useRoomDetails(roomId, {
		onError: (error: AxiosError) => {
			if (error.response.status == 404) {
				router.push("404")
			}
		}
	});

	const { mutate, status } = useMutation({
		mutationFn: (user: App.User) => api.post(`/api/join-room/${roomId}`, { user }),
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

	if (isLoading) return null;

	return (
		<Flex h="100vh" direction="row" alignItems="center" justifyContent="center">
			<VStack spacing={4}>
				<FormControl isInvalid={!!formState.errors?.memberName?.message}>
					<FormLabel htmlFor="memberName">Como você quer ser chamado</FormLabel>
					<Input type="text" id="memberName" {...register("memberName", {
						required: {
							value: true,
							message: "Campo obrigatório"
						},
						minLength: {
							value: 3,
							message: "Mínimo de 3 caracteres"
						},
						maxLength: {
							value: 20,
							message: "Máximo de 20 caracteres"
						}
					})} />
					<FormErrorMessage>{formState.errors?.memberName?.message}</FormErrorMessage>
				</FormControl>
				<Button variant="solid" isLoading={status === 'loading'} onClick={handleSubmit((values) => {
					mutate({
						...user,
						displayName: values.memberName,
						vote: null,
						voteStatus: "not-voted"
					});
				})}>Join the room</Button>
			</VStack >
		</Flex>
	);

}

export default PrivatePage(JoinRoom);
