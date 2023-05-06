import { Flex, Text } from "@chakra-ui/react";
import { IconFileBroken } from "@tabler/icons-react";

export default function Custom404() {
	return (
		<Flex h="100vh" direction="column" alignItems="center" justifyContent="center">
			<IconFileBroken size={100} />
			<Text>Sala não encontrada</Text>
		</Flex>
	);
}
