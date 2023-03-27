import { useEffect, useRef, useState } from "react";
import { Flex, Heading } from "@chakra-ui/react";
import { SECONDS_TO_REVEAL } from "../../pages/voting/[roomId]";

export const RevealingOverlay = () => {
	const [count, setCount] = useState(SECONDS_TO_REVEAL);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		clearInterval(intervalRef.current);

		intervalRef.current = setInterval(() => {
			setCount(count => {
				if (count > 0) {
					return count - 1;
				}

				return 0;
			});
		}, 1000);

		if (count <= 0) {
			clearInterval(intervalRef.current);
			return;
		}


		return () => clearInterval(intervalRef.current);
	}, [count]);

	return <Flex
		zIndex={9999}
		position="absolute"
		top={0}
		left={0}
		right={0}
		bottom={0}
		alignItems="center"
		justifyContent="center"
		bg="rgba(0,0,0,0.5)"
	>
		<Heading color="gray.100">
			Revelando cartas em: {count}
		</Heading>
	</Flex>;
};
