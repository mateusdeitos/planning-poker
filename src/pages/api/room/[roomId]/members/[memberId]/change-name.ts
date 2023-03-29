import { changeMemberName } from "../../../../../../services/firebase/room-services";
import { withAuth } from "../../../../../../withAuth";

export default withAuth(async (req, res) => {
	if (req.method !== "POST") {
		return res.status(405).end();
	}

	const { name } = req.body;
	const { roomId, memberId } = req.query;

	if (typeof name !== "string" || name.trim() === "") {
		return res.status(400).send("Missing name");
	}

	if (typeof roomId !== "string") {
		return res.status(400).send("Missing roomId");
	}

	if (typeof memberId !== "string") {
		return res.status(400).send("Missing memberId");
	}

	if (req.uid !== memberId) {
		return res.status(401).send("Not authorized");
	}

	try {
		const response = await changeMemberName(roomId, memberId, name);

		return res.status(200).json(response)
	} catch (e) {
		return res.status(500).send(e.message);
	}

});