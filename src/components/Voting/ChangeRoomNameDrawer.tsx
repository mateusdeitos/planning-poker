import {
	Button,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { DrawerContainer, TDrawerComponent, useDrawerContext } from "../../renderDrawer";

export const ChangeRoomNameDrawer = ({
	currentName,
	...props
}: TDrawerComponent<{ currentName: string }>) => {
	const { register, handleSubmit, formState } = useForm<{ roomName: string }>({
		defaultValues: {
			roomName: currentName,
		},
	});

	const { close, reject } = useDrawerContext<string>();

	return (
		<DrawerContainer {...props} onClose={() => reject()}>
			<DrawerContent>
				<DrawerCloseButton />
				<Flex direction="column" maxW={500} m="0 auto">
					<DrawerHeader>Alterar o nome da sala</DrawerHeader>
					<DrawerBody>
						<FormControl isInvalid={!!formState.errors?.roomName?.message}>
							<FormLabel htmlFor="roomName">Qual o novo nome da sala?</FormLabel>
							<Input
								type="text"
								id="roomName"
								autoFocus
								{...register("roomName", {
									required: {
										value: true,
										message: "Campo obrigatório",
									},
									minLength: {
										value: 3,
										message: "Mínimo de 3 caracteres",
									},
									maxLength: {
										value: 20,
										message: "Máximo de 20 caracteres",
									},
								})}
							/>
							<FormErrorMessage>{formState.errors?.roomName?.message}</FormErrorMessage>
						</FormControl>
					</DrawerBody>
					<DrawerFooter>
						<Button
							colorScheme="teal"
							onClick={handleSubmit(({ roomName }) => close(roomName))}
						>
							Salvar
						</Button>
					</DrawerFooter>
				</Flex>
			</DrawerContent>
		</DrawerContainer>
	);
};
