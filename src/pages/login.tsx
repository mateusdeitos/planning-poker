import { Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function Login() {
	return (
		<Flex
			h="100vh"
			direction="column"
			gap={4}
			alignItems="center"
			justifyContent="center"
			maxW="300px"
			m="0 auto"
		>
			<Heading size="lg">Bem vindo!</Heading>
			<Text size="md">
				Para poder utilizar o Planning Poker App, faça login com sua conta Google
			</Text>
			<Divider my={8} />
			<LoginWithGoogleButton />
		</Flex>
	);
}

export const LoginWithGoogleButton = () => {
	const router = useRouter();
	const { loginGoogle } = useAuth();
	return (
		<Button
			leftIcon={<IconBrandGoogle />}
			variant="solid"
			size="lg"
			bgGradient="linear(to-r, #4285F4, #34A853, #FBBC05, #EA4335)"
			_hover={{
				filter: "brightness(0.80)",
			}}
			transition="filter 0.3s"
			onClick={() => loginGoogle(router.asPath)}
		>
			Login com Google
		</Button>
	);
};
