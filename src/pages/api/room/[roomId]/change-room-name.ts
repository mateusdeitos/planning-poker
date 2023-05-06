import { changeRoomName } from "../../../../services/firebase/room-services";
import { withAuth } from "../../../../withAuth";

export default withAuth(async (req, res) => {
	if (req.method !== "POST") {
		return res.status(405).end();
	}

	const { name } = req.body;
	const { roomId } = req.query;

	if (typeof name !== "string" || name.trim() === "") {
		return res.status(400).send("Missing name");
	}

	if (typeof roomId !== "string") {
		return res.status(400).send("Missing roomId");
	}

	try {
		const response = await changeRoomName(roomId, name);

		return res.status(200).json(response);
	} catch (e) {
		return res.status(500).send(e.message);
	}
});
