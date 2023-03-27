import { Flex, Heading, HStack, IconButton, Link, Tooltip, useColorMode, useColorModeValue, useToast } from "@chakra-ui/react";
import { IconLogout, IconMoonStars, IconSunHigh } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
	const { toggleColorMode } = useColorMode();
	const headerBg = useColorModeValue("gray.200", "gray.700")
	const IconColorMode = useColorModeValue(<IconMoonStars size={24} />, <IconSunHigh size={24} />);
	const colorButtonToggleColorMode = useColorModeValue("gray.700", "yellow.500");
	const colorButtonLeaveRoom = useColorModeValue("gray.700", "gray.200");
	const router = useRouter();
	const toast = useToast();
	const { user, logout } = useAuth();
	const roomId = Array.isArray(router.query.roomId) ? router.query.roomId[0] : router.query.roomId;

	return <Flex
		w="100%"
		h="50px"
		alignItems="center"
		justifyContent="space-between"
		bg={headerBg}
		p="0 20px"
	>
		<Heading size="md">
			<Link href="/" textDecoration="none">Planning Poker</Link>
		</Heading>
		<HStack>
			<Tooltip label="Mudar tema">
				<IconButton
					icon={IconColorMode}
					color={colorButtonToggleColorMode}
					size="sm"
					aria-label="Mudar tema"
					variant="solid"
					onClick={() => toggleColorMode()} />
			</Tooltip>
			{!!user && (
				<Tooltip label="Logout" placement="left">
					<IconButton
						icon={<IconLogout size={24} />}
						color={colorButtonLeaveRoom}
						size="sm"
						aria-label="Logout"
						variant="solid"
						onClick={() => logout()} />
				</Tooltip>
			)}
		</HStack>
	</Flex>;
};
