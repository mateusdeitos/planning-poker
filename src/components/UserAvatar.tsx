import { Avatar, AvatarProps, Tooltip, TooltipProps } from "@chakra-ui/react";
import { App } from "../types";

type Props = Omit<AvatarProps, "name" | "src"> & {
	user: App.User;
	tooltipPlacement?: TooltipProps["placement"];
};

export const UserAvatar = ({
	user,
	tooltipPlacement = "top",
	...props
}: Props) => {
	return (
		<Tooltip label={user.displayName} hasArrow placement={tooltipPlacement}>
			<Avatar {...props} src={user.photoURL} name={user.displayName} />
		</Tooltip>
	);
};
