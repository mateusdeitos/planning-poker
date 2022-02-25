import { NextApiRequest, NextApiResponse } from "next";
import { createRoom } from "../../services/firebase/room-services";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).end();
	}

	const { authorName, roomName } = req.body;

	if (!authorName || !roomName) {
		return res.status(400).send("Missing authorName or roomName");
	}

	try {
		const { key: roomId } = await createRoom(roomName, authorName);

		return res.status(200).json({ roomId });
	} catch (e) {
		return res.status(500).send(e.message);
	}

}