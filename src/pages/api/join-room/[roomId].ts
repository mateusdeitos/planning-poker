import { NextApiRequest, NextApiResponse } from "next";
import { joinRoom } from "../../../services/firebase/room-services";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).end();
	}

	const { memberName } = req.body;
	const { roomId } = req.query;

	if (!memberName || !roomId) {
		return res.status(400).send("Missing roomId or memberName");
	}

	try {
		await joinRoom(Array.isArray(roomId) ? roomId[0] : roomId, memberName);

		return res.status(200).send("Joined room");
	} catch (e) {
		return res.status(500).send(e.message);
	}

}