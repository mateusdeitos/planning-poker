import {
	Button,
	ButtonProps,
	Flex,
	IconButton,
	Tooltip,
	useBreakpointValue,
	useToast,
} from "@chakra-ui/react";
import {
	IconDice,
	IconDoorExit,
	IconLink,
	IconPlayerPlay,
	IconUser,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import router from "next/router";
import { SECONDS_TO_REVEAL } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { useUi } from "../../context/UiContext";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { useRoomDetails } from "../../hooks/useRoomDetails";
import { useRoomIdFromRouter } from "../../hooks/useRoomIdFromRouter";
import { renderDrawer } from "../../renderDrawer";
import { api } from "../../services/firebase/api";
import { App } from "../../types";
import { ChangeNameDrawer } from "./ChangeNameDrawer";

export const Actions = () => {
	const [, dispatch] = useUi();
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
				title: "Ocorreu um erro.",
				description: error?.response?.data,
				status: "error",
			});
		},
	});

	const copyToClipboard = useCopyToClipboard(
		`${window.location.origin}/join-room?roomId=${roomId}`,
		"URL copiada para a área de transferência"
	);

	return (
		<Flex
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
					onClick={() =>
						queryClient.invalidateQueries().then(() => {
							mutation.mutate("revealing", {
								onSuccess: () => {
									setTimeout(() => {
										mutation.mutate("finished");
									}, SECONDS_TO_REVEAL * 1000);
								},
							});
						})
					}
				>
					Revelar cartas
				</ResponsiveButton>
			)}

			{votingState === "finished" && (
				<ResponsiveButton
					colorScheme="blue"
					leftIcon={<IconDice />}
					isLoading={mutation.isLoading}
					onClick={() => {
						dispatch({ type: "loader", payload: true });
						mutation.mutate("voting", {
							onSuccess: () => {
								queryClient.invalidateQueries(["room", roomId]);
							},
							onSettled: () => dispatch({ type: "loader", payload: false }),
						});
					}}
				>
					Nova rodada
				</ResponsiveButton>
			)}

			<ResponsiveButton leftIcon={<IconLink />} onClick={copyToClipboard}>
				Copiar Link de convite
			</ResponsiveButton>
			<ResponsiveButton
				leftIcon={<IconDoorExit />}
				onClick={() => leaveRoom.mutate()}
			>
				Sair da sala
			</ResponsiveButton>
			<ChangeNameButton />
		</Flex>
	);
};

const ChangeNameButton = () => {
	const { user } = useAuth();
	const toast = useToast();
	const roomId = useRoomIdFromRouter();
	const { data: member, updateMember } = useRoomDetails(roomId, {
		select(room) {
			return room.members[user.uid];
		},
	});

	const { mutate } = useMutation({
		mutationFn: (name: string) =>
			api.post(`/api/room/${roomId}/members/${user.uid}/change-name`, { name }),
		onSuccess: () =>
			toast({
				status: "success",
				description: "Nome alterado com sucesso",
			}),
		onError: (error: AxiosError<string>) =>
			toast({
				status: "error",
				title: "Ocorreu um erro",
				description: error?.response?.data,
			}),
	});

	const handleClick = async () => {
		const displayName = await renderDrawer<string>((props) => (
			<ChangeNameDrawer
				{...props}
				placement="bottom"
				currentName={member?.displayName}
			/>
		));

		if (displayName === member?.displayName) {
			return;
		}

		mutate(displayName, {
			onSuccess: () => {
				updateMember({ ...member, displayName });
			},
		});
	};

	return (
		<ResponsiveButton leftIcon={<IconUser />} onClick={() => handleClick()}>
			Mudar meu nome
		</ResponsiveButton>
	);
};

const ResponsiveButton = ({
	children,
	leftIcon,
	rightIcon,
	...props
}: ButtonProps) => {
	const isMobile = useBreakpointValue({ base: true, md: false, lg: false });

	if (isMobile) {
		const icon = leftIcon ?? rightIcon;
		return (
			<Tooltip label={children} hasArrow>
				<IconButton
					icon={icon}
					aria-label={typeof children === "string" ? children : ""}
					{...props}
				/>
			</Tooltip>
		);
	}

	return (
		<Button leftIcon={leftIcon} rightIcon={rightIcon} {...props}>
			{children}
		</Button>
	);
};
