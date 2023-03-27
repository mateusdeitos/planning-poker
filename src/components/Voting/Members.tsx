import { Flex } from "@chakra-ui/react";
import { App } from "../../types";
import { MemberCard } from "./MemberCard";

type MembersProps = {
	members: App.Room["members"];
};

export const Members = ({ members }: MembersProps) => {
	return <Flex
		w="100%"
		flex={1}
		gap={30}
		wrap="wrap"
		p={50}
		overflowY="auto"
	>
		{Object.values(members).map((member, index) => <MemberCard key={index} member={member} />)}
	</Flex>;
};
