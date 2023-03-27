import { App } from "../../types";
import { Grid, GridItem } from "@chakra-ui/react";
import { MemberCard } from "./MemberCard";

type MembersProps = {
	members: App.User[];
};

export const Members = ({ members }: MembersProps) => {
	return <Grid w="100%" flex={1} templateColumns={`repeat(${members.length}, 1fr)`} gap={4} p={50}>
		{members.map(member => <GridItem key={member.uid} colSpan={1}>
			<MemberCard member={member} />
		</GridItem>)}
	</Grid>;
};
