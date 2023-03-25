import { NextApiRequest, NextApiResponse } from "next";
import { isUser } from "../../models/User";
import { createRoom } from "../../services/firebase/room-services";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

	try {
		const { key: roomId } = await createRoom(roomName, user);

		return res.status(200).json({ roomId });
	} catch (e) {
		return res.status(500).send(e.message);
	}

}