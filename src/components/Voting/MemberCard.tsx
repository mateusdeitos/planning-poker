import { Avatar, CardHeader, Tooltip } from "@chakra-ui/react";
import { useRoomDetails } from "../../hooks/useRoomDetails";
import { useRoomIdFromRouter } from "../../hooks/useRoomIdFromRouter";
import { App } from "../../types";
import { VotingCard } from "../VotingCard";

export const MemberCard = ({ member }: { member: App.User; }) => {
	const roomId = useRoomIdFromRouter();
	const { data, isSuccess } = useRoomDetails(roomId);
	const label = data?.cards.find(card => card.value === member.vote)?.label ?? "?";

	if (!isSuccess) return null;

	return <VotingCard>
		<CardHeader pos="absolute" top="-38px" left="-36px">
			<Tooltip label={member.displayName} hasArrow>
				<Avatar
					size="sm"
					name={member.displayName}
					src={member.photoURL} />
			</Tooltip>
		</CardHeader>
		{data?.votingState !== "finished" && member.voteStatus === "not-voted" && <VotingCard.NotVotedBody />}
		{data?.votingState !== "finished" && member.voteStatus === "voted" && <VotingCard.VotedBody />}
		{data?.votingState === "finished" && <VotingCard.RevealedBody value={label} />}
	</VotingCard>;
};