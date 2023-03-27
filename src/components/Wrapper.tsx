import { Flex } from "@chakra-ui/react";

export const Wrapper = ({ children }) => {
	return <Flex
		h="100vh"
		direction="column"
		alignItems="center"
		justifyContent="flex-start"
	>{children}
	</Flex>;
};
