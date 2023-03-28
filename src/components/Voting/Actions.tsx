import { Button, ButtonProps, Flex, IconButton, Tooltip, useBreakpointValue, useToast } from "@chakra-ui/react";
import { IconDice, IconDoorExit, IconLink, IconPlayerPlay } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import router from "next/router";
import { SECONDS_TO_REVEAL } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { useRoomDetails } from "../../hooks/useRoomDetails";
import { useRoomIdFromRouter } from "../../hooks/useRoomIdFromRouter";
import { api } from "../../services/firebase/api";
import { App } from "../../types";

export const Actions = () => {
	const roomId = useRoomIdFromRouter();
	const { user } = useAuth();
	const toast = useToast();
	const { data: votingState, isLoading } = useRoomDetails(roomId, {
		select(room) {
			return room.votingState;
		},
	});

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ["change-state"],
		mutationFn: async (phase: App.Room["votingState"]) => {
			return api.post(`/api/change-state/${roomId}`, { user, phase });
		},
	});

	const leaveRoom = useMutation({
		mutationFn: () => api.post(`/api/leave-room/${roomId}`, { user }),
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
		py={4}
		w="100%"
		gap={4}
		alignItems="center"
		justifyContent="flex-start"
		px={{ base: "10px", md: "50px" }}
	>
		{votingState !== "finished" && (
			<ResponsiveButton
				leftIcon={<IconPlayerPlay />}
				colorScheme="cyan"
				isLoading={mutation.isLoading || isLoading}
				onClick={() => queryClient.invalidateQueries().then(() => {
					mutation.mutate("revealing", {
						onSuccess: () => {
							setTimeout(() => {
								mutation.mutate("finished");
							}, SECONDS_TO_REVEAL * 1000);
						}
					});
				})}
			>
				Revelar cartas
			</ResponsiveButton>
		)}

		{votingState === "finished" && (
			<ResponsiveButton
				colorScheme="blue"
				leftIcon={<IconDice />}
				isLoading={mutation.isLoading}
				onClick={() => mutation.mutate("voting")}
			>
				Nova rodada
			</ResponsiveButton>
		)}

		<ResponsiveButton
			leftIcon={<IconLink />}
			onClick={copyToClipboard}
		>
			Copiar Link de convite
		</ResponsiveButton>
		<ResponsiveButton
			leftIcon={<IconDoorExit />}
			onClick={() => leaveRoom.mutate()}
		>
			Sair da sala
		</ResponsiveButton>
	</Flex>;
};

const ResponsiveButton = ({ children, leftIcon, rightIcon, ...props }: ButtonProps) => {
	const isMobile = useBreakpointValue({ base: true, md: false, lg: false })

	if (isMobile) {
		const icon = leftIcon ?? rightIcon;
		return <Tooltip label={children} hasArrow>
			<IconButton
				icon={icon}
				aria-label={typeof children === "string" ? children : ""}
				{...props}
			/>
		</Tooltip>
	}

	return <Button leftIcon={leftIcon} rightIcon={rightIcon} {...props}>{children}</Button>
}
