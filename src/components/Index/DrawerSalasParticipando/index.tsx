import {
	DrawerContent,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
} from "@chakra-ui/react";
import { DrawerContainer, TDrawerComponent } from "../../../renderDrawer";
import { App } from "../../../types";
import { RoomCard } from "./RoomCard";

export const DrawerSalasParticipando = ({
	asMember,
	asAuthor,
	...props
}: TDrawerComponent<App.ListRoomsResponse>) => {
	return (
		<DrawerContainer {...props} size="lg">
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>Salas que sou membro</DrawerHeader>
				<DrawerBody>
					{Object.entries(asMember).map(([key, room]) => {
						return (
							<RoomCard
								key={key}
								roomId={key}
								room={room}
								isAuthor={!!asAuthor[key]}
							/>
						);
					})}
				</DrawerBody>
			</DrawerContent>
		</DrawerContainer>
	);
};
