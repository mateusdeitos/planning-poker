import { isUser } from "../../models/User";
import { createRoom } from "../../services/firebase/room-services";
import { withAuth } from "../../withAuth";

export default withAuth(async (req, res) => {
	if (req.method !== "POST") {
		return res.status(405).end();
	}

	const { user, roomName } = req.body;

	if (!isUser(user)) {
		return res.status(400).send("Missing user");
	}

	if (!roomName) {
		return res.status(400).send("Missing email or roomName");
	}

	if (req.uid != user.uid) {
		return res.status(401).send("Not authorized");
	}

	try {
		const { key: roomId } = await createRoom(roomName, user);

		return res.status(200).json({ roomId });
	} catch (e) {
		return res.status(500).send(e.message);
	}
});
