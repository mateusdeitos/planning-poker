import { Button, Flex, FormControl, FormLabel, Input, VStack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import PrivatePage from "../components/PrivatePage";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../hooks/useForm";

function Home() {
	const toast = useToast();
	const { user, logout } = useAuth();
	const { register, getValues } = useForm({ defaultValues: { roomName: "Teste", authorName: user.displayName } });
	const router = useRouter();

	const handleCriarSala = async () => {
		const values = getValues();
		try {
			const response = await (await fetch("/api/create-room", {
				method: "POST",
				body: JSON.stringify({
					roomName: values.roomName,
					user: {
						...user,
						displayName: values.authorName
					}
				}),
				headers: {
					"Content-Type": "application/json",
				}
			})).json();

			toast({
				title: 'Sala criada.',
				description: `A sala (${response.roomId}) foi criada com sucesso`,
				status: 'success',
				duration: 2000,
				isClosable: true,
			})

			setTimeout(() => {
				router.push(`/voting/${response.roomId}`);
			}, 1000);
		} catch (error) {
			toast({
				title: 'Ocorreu um erro.',
				description: error?.message || error,
				status: 'error',
				duration: 2000,
				isClosable: true,
			})

		}
	}

	return <Flex h="100vh" direction="row" alignItems="center" justifyContent="center">
		<VStack spacing={4}>
			<FormControl>
				<FormLabel htmlFor="roomName">Nome da sala</FormLabel>
				<Input type="text" id="roomName" {...register("roomName")} />
			</FormControl>
			<FormControl>
				<FormLabel htmlFor="authorName">Como você quer ser chamado</FormLabel>
				<Input type="text" id="authorName" {...register("authorName")} />
			</FormControl>
			<Button variant="outline" onClick={handleCriarSala}>Criar sala</Button>
			<Button variant="outline" bg="red.300" onClick={logout}>Logout</Button>
		</VStack>
	</Flex>
}

export default PrivatePage(Home);