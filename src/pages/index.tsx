import { Button, Flex, FormControl, FormLabel, Input, VStack, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { Header } from "../components/Header";
import PrivatePage from "../components/PrivatePage";
import { Wrapper } from "../components/Wrapper";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../hooks/useForm";

type Form = {
	roomName: string;
	authorName: string;
}

function Home() {
	const toast = useToast();
	const { user } = useAuth();
	const [lockButton, setLockButton] = useState(false);
	const { register, getValues } = useForm<Form>({
		defaultValues: { roomName: "Teste", authorName: user.displayName }
	});
	const router = useRouter();

	const createRoom = useMutation({
		mutationFn: (form: Form) => axios.post<{ roomId: string }>("/api/create-room", {
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

	const handleCriarSala = async () => {
		setLockButton(true);
		const values = getValues();
		createRoom.mutate(values, {
			onError() {
				setLockButton(false);
			}
		});
	}

	return <Wrapper>
		<Header />
		<Flex h="100vh" direction="row" alignItems="center" justifyContent="center">
			<VStack spacing={4}>
				<FormControl>
					<FormLabel htmlFor="roomName">Nome da sala</FormLabel>
					<Input type="text" id="roomName" {...register("roomName")} />
				</FormControl>
				<FormControl>
					<FormLabel htmlFor="authorName">Como você quer ser chamado</FormLabel>
					<Input type="text" id="authorName" {...register("authorName")} />
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
			</VStack>
		</Flex>
	</Wrapper>
}

export default PrivatePage(Home);