import { Flex, Heading, HStack, IconButton, Tooltip, useToast } from "@chakra-ui/react";
import { IconDoorExit, IconLink } from "@tabler/icons-react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

export const Header = () => {
	const router = useRouter();
	const toast = useToast();
	const { user } = useAuth();
	const roomId = Array.isArray(router.query.roomId) ? router.query.roomId[0] : router.query.roomId;

	const leaveRoom = useMutation({
		mutationFn: () => axios.post(`/api/leave-room/${roomId}`, { user }),
		onSuccess: () => router.push(`/`),
		onError: (error: AxiosError<string>) => {
			toast({
				title: 'Ocorreu um erro.',
				description: error?.response?.data,
				status: 'error',
			});
		}
	});
	const copyToClipboard = useCopyToClipboard(
		`${window.location.origin}/join-room?roomId=${roomId}`,
		"URL copiada para a área de transferência"
	);

	return <Flex
		w="100%"
		h="50px"
		alignItems="center"
		justifyContent="space-between"
		bg="gray.200"
		p="0 20px"
	>
		<Heading size="md">Planning Poker</Heading>
		<HStack>
			<Tooltip label="Copy invitation link">
				<IconButton
					icon={<IconLink size={24} />}
					color="cyan.500"
					size="sm"
					aria-label="Copy invitation link"
					variant="solid"
					onClick={() => copyToClipboard()} />
			</Tooltip>
			<Tooltip label="Leave room">
				<IconButton
					icon={<IconDoorExit size={24} />}
					color="gray.700"
					size="sm"
					aria-label="Leave room"
					variant="solid"
					onClick={() => leaveRoom.mutate()} />
			</Tooltip>
		</HStack>
	</Flex>;
};
