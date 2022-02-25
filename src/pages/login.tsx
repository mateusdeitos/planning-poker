import { Flex, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";


export default function Login() {
	return <Flex h="100vh" direction="row" alignItems="center" justifyContent="center">
		<LoginWithGoogleButton />
	</Flex>
}

export const LoginWithGoogleButton = () => {
	const router = useRouter();
	const { loginGoogle } = useAuth();
	return <Button variant="solid" bg="blue.500" size="lg" onClick={() => loginGoogle(router.asPath)}>Logar no Google</Button>
}