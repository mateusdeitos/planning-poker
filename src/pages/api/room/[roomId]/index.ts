import { getRoomDetails } from "../../../../services/firebase/room-services";
import { withAuth } from "../../../../withAuth";

export default withAuth(async (req, res) => {
	if (req.method !== "GET") {
		return res.status(405).end();
	}

	const { roomId } = req.query;

	if (!roomId) {
		return res.status(400).send("Missing roomId");
	}

	try {
		const response = await getRoomDetails(
			Array.isArray(roomId) ? roomId[0] : roomId
		);
		if (!response) {
			return res.status(404).send("Room not found");
		}
		return res.status(200).json(response);
	} catch (e) {
		return res.status(500).send(e.message);
	}
});
