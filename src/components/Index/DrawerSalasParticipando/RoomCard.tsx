import {
	Avatar,
	AvatarProps,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Heading,
	HStack,
	Tooltip,
} from "@chakra-ui/react";
import { IconExternalLink } from "@tabler/icons-react";
import { useDrawerContext } from "../../../renderDrawer";
import { App } from "../../../types";

export const RoomCard = ({
	room,
	roomId,
	isAuthor,
}: {
	room: App.Room;
	roomId: string;
	isAuthor: boolean;
}) => {
	const { close } = useDrawerContext<string>();
	return (
		<Card
			direction="column"
			gap={4}
			alignItems="flex-start"
			mb={4}
			cursor="pointer"
			transition="all 0.2s"
			onClick={() => close(roomId)}
			_hover={{
				filter: "brightness(0.9)",
				transform: "translateY(-2px)",
			}}
		>
			<CardHeader display="flex" justifyContent="space-between" w="100%">
				<Heading size="md">{room.roomName}</Heading>
				<IconExternalLink />
			</CardHeader>
			<CardBody py={0}>
				<Heading color="gray.400" size="sm" mb={2}>
					Participantes
				</Heading>
				<HStack>
					{Object.values(room?.members ?? {}).map((member, index) => {
						const props: AvatarProps = {
							src: member.photoURL,
							name: member.displayName,
							transform: `translateX(-${index * 20}px)`,
						};

						return (
							<Tooltip key={member.uid} label={member.displayName} placement="bottom">
								<Avatar {...props} />
							</Tooltip>
						);
					})}
				</HStack>
			</CardBody>
			<CardFooter>
				<Heading color="gray.400" size="sm">
					Criador: {isAuthor ? "Eu" : room.author.displayName}
				</Heading>
			</CardFooter>
		</Card>
	);
};
