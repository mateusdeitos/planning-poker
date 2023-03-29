import { Button, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, Flex, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { DrawerContainer, TDrawerComponent, useDrawerContext } from "../../renderDrawer";

export const ChangeNameDrawer = ({ currentName, ...props }: TDrawerComponent<{ currentName: string; }>) => {
	const { register, handleSubmit, formState } = useForm<{ authorName: string; }>({
		defaultValues: {
			authorName: currentName
		},
	});

	const { close, reject } = useDrawerContext<string>();

	return <DrawerContainer {...props} onClose={() => reject()}>
		<DrawerContent>
			<DrawerCloseButton />
			<Flex direction="column" maxW={500} m="0 auto">
				<DrawerHeader>Alterar o nome</DrawerHeader>
				<DrawerBody>
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
				</DrawerBody>
				<DrawerFooter>
					<Button colorScheme="teal" onClick={handleSubmit(({ authorName }) => close(authorName))}>Salvar</Button>
				</DrawerFooter>
			</Flex>
		</DrawerContent>
	</DrawerContainer>;
};
