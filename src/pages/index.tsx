import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, useToast, VStack } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Header } from "../components/Header";
import { DrawerSalasParticipando } from "../components/Index/DrawerSalasParticipando";
import PrivatePage from "../components/PrivatePage";
import { Wrapper } from "../components/Wrapper";
import { useUi } from "../context/UiContext";
import { useAuth } from "../context/AuthContext";
import { renderDrawer } from "../renderDrawer";
import { api } from "../services/firebase/api";
import { App } from "../types";

type Form = {
	roomName: string;
	authorName: string;
}

function Home() {
	const toast = useToast();
	const { user } = useAuth();
	const [lockButton, setLockButton] = useState(false);
	const queryRoomsByUserUid = useQuery(["rooms", user.uid], () => api.get<App.ListRoomsResponse>("/api/list-rooms-by-user-uid").then(r => r.data));
	const { register, handleSubmit, formState } = useForm<Form>({
		defaultValues: {
			roomName: "",
			authorName: user.displayName?.split(" ")[0] || ""
		}
	});
	const [, dispatch] = useUi();

	const router = useRouter();

	const createRoom = useMutation({
		mutationFn: (form: Form) => api.post<{ roomId: string }>("/api/create-room", {
			roomName: form.roomName,
			user: {
				...user,
				displayName: form.authorName
			}
		}).then(r => r.data),
		onSuccess(response) {
			toast({
				title: 'Sala criada com sucesso',
				description: `Redirecionando...`,
				status: 'success',
				duration: 2000,
				isClosable: true,
			})

			setTimeout(() => {
				router.push(`/voting/${response.roomId}`);
			}, 1000);
		},
		onError(error: AxiosError<string>) {
			toast({
				title: 'Ocorreu um erro.',
				description: error?.message,
				status: 'error',
				duration: 2000,
				isClosable: true,
			})
		}
	})

	const handleCriarSala = handleSubmit((values) => {
		setLockButton(true);
		createRoom.mutate(values, {
			onError() {
				setLockButton(false);
			}
		});
	})

	const handleVerSalas = (data: App.ListRoomsResponse) => {
		renderDrawer(props => <DrawerSalasParticipando {...props} {...data} />)
			.then(roomId => {
				const toastId = toast({
					variant: "solid",
					status: "loading",
					colorScheme: "blue",
					title: "Redirecionando...",
				});

				dispatch({ type: "loader", payload: true });
				setTimeout(() => {
					router.push(`/voting/${roomId}`).then(() => {
						dispatch({ type: "loader", payload: false });
						toast.close(toastId);
					});
				}, 300)
			})
	}

	return <Wrapper>
		<Header />
		<Flex h="100vh" direction="row" alignItems="center" justifyContent="center">
			<VStack spacing={4}>
				<FormControl isInvalid={!!formState.errors?.roomName?.message}>
					<FormLabel htmlFor="roomName">Nome da sala</FormLabel>
					<Input type="text" id="roomName" {...register("roomName", {
						required: "Campo obrigatório",
						minLength: {
							value: 3,
							message: "Mínimo de 3 caracteres"
						},
						maxLength: {
							value: 50,
							message: "Máximo de 50 caracteres"
						}
					})} />
					<FormErrorMessage>{formState.errors?.roomName?.message}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={!!formState.errors?.authorName?.message}>
					<FormLabel htmlFor="authorName">Como você quer ser chamado</FormLabel>
					<Input type="text" id="authorName" {...register("authorName", {
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
					<FormErrorMessage>{formState.errors?.authorName?.message}</FormErrorMessage>
				</FormControl>
				<Button
					w="100%"
					isLoading={lockButton}
					colorScheme="teal"
					variant="solid"
					onClick={handleCriarSala}
				>
					Criar sala
				</Button>
				<Button
					w="100%"
					isLoading={queryRoomsByUserUid.isLoading}
					isDisabled={queryRoomsByUserUid.isError}
					colorScheme="blue"
					variant="solid"
					onClick={() => handleVerSalas(queryRoomsByUserUid.data)}
				>
					Ver salas que estou participando
				</Button>
			</VStack>
		</Flex>
	</Wrapper>
}

export default PrivatePage(Home);