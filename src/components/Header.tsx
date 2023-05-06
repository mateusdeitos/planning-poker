import {
	Flex,
	Heading,
	HStack,
	IconButton,
	Link,
	Tooltip,
	useColorMode,
	useColorModeValue,
	VStack,
} from "@chakra-ui/react";
import { IconLogout, IconMoonStars, IconSunHigh } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";

export const Header = ({ subTitle = <></> }) => {
	const { toggleColorMode } = useColorMode();
	const headerBg = useColorModeValue("gray.200", "gray.700");
	const IconColorMode = useColorModeValue(
		<IconMoonStars size={24} />,
		<IconSunHigh size={24} />
	);
	const colorButtonToggleColorMode = useColorModeValue(
		"gray.700",
		"yellow.500"
	);
	const colorButtonLeaveRoom = useColorModeValue("gray.700", "gray.200");
	const { user, logout } = useAuth();

	return (
		<Flex
			w="100%"
			h="75px"
			alignItems="center"
			justifyContent="space-between"
			bg={headerBg}
			px={{ base: "10px", md: "50px" }}
		>
			<VStack alignItems="flex-start" spacing="sm">
				<Heading size="md">
					<Link href="/" textDecoration="none">
						Planning Poker
					</Link>
				</Heading>
				{!!subTitle && subTitle}
			</VStack>
			<HStack>
				<Tooltip label="Mudar tema">
					<IconButton
						icon={IconColorMode}
						color={colorButtonToggleColorMode}
						size="sm"
						aria-label="Mudar tema"
						variant="solid"
						onClick={() => toggleColorMode()}
					/>
				</Tooltip>
				{!!user && (
					<Tooltip label="Logout" placement="left">
						<IconButton
							icon={<IconLogout size={24} />}
							color={colorButtonLeaveRoom}
							size="sm"
							aria-label="Logout"
							variant="solid"
							onClick={() => logout()}
						/>
					</Tooltip>
				)}
			</HStack>
		</Flex>
	);
};
