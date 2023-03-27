import { Card, CardBody, CardProps, Heading, useColorModeValue } from "@chakra-ui/react";
import { IconBrandGit } from "@tabler/icons-react";
import { App } from "../../types";

type VotingCardProps = CardProps & {
	children: React.ReactNode;
	selected?: boolean;
}

export function VotingCard({ children, h = 150, w = 100, selected, ...props }: VotingCardProps) {
	return <Card
		{...props}
		h={h}
		w={w}
		minW={w}
		p="17px"
		transition="all 0.2s ease-in-out"
		transform={selected ? "translateY(-10px)" : "none"}
	>
		{children}
	</Card>;
}

type RevealedBodyProps = {
	value: App.Card["label"];
	selected?: boolean;
}

const RevealedBody = ({ value, selected = false }: RevealedBodyProps) => {
	const bg = useColorModeValue(
		selected ? "green.400" : "gray.100",
		selected ? "green.400" : "gray.600"
	);
	return <CardBody
		display="flex"
		flexDirection="column"
		alignItems="center"
		justifyContent="center"
		backgroundColor={bg}
		transition="background-color 0.2s ease-in-out"
		borderRadius="md"
	>
		<Heading as="h3" size="sm">
			{value}
		</Heading>
	</CardBody>
}

const HoverableBody = ({ value, selected = false }: RevealedBodyProps) => {
	const bg = useColorModeValue(
		selected ? "green.400" : "gray.100",
		selected ? "green.400" : "gray.600"
	);

	return <CardBody
		display="flex"
		flexDirection="column"
		alignItems="center"
		justifyContent="center"
		backgroundColor={bg}
		transition="all 0.2s ease-in-out"
		_groupHover={{
			backgroundColor: "green.400"
		}}
		borderRadius="md"
	>
		<Heading as="h3" size="sm">
			{value}
		</Heading>
	</CardBody>
}

const VotedBody = () => {
	return <CardBody
		display="flex"
		flexDirection="column"
		alignItems="center"
		justifyContent="center"
		backgroundColor="blue.400"
		borderRadius="md"
	/>
}

const NotVotedBody = () => {
	const bg = useColorModeValue(
		"gray.200",
		"gray.600"
	);

	return <CardBody
		display="flex"
		flexDirection="column"
		alignItems="center"
		justifyContent="center"
		backgroundColor={bg}
		borderRadius="md"
	/>
}

VotingCard.RevealedBody = RevealedBody;
VotingCard.VotedBody = VotedBody;
VotingCard.NotVotedBody = NotVotedBody;
VotingCard.HoverableBody = HoverableBody;
